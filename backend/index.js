const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'myschedule',
	port: 3306,
});
db.connect((err) => {
	if (err) throw err;
	console.log('Connection to MySql database succeeded.');
});


app.get('/', (req, res) => {
	res.send('CS348!!!!');
});

app.get('/login', (req, res) => {
	// req.query contains, for example: { userName: '40000000', userpw: 'secretpw' }

	/**
	 * check DB if userName exists, if so check if pw matches. return true if info are correct,
	 * false otherwise
	 */
	userID = parseInt(req.query.userName, 10);
	if (isNaN(userID)) {
		// no need to throw error here, the server should still function
		res.send(false);
		return;
	}

	db.query(`
		SELECT id, pword
		FROM PROFESSOR
		WHERE id=${userID} AND pword='${req.query.userpw}'`,
		(err, results) => {
			if (err) throw err;
			if (results.length > 0) {
				res.json({ auth: true, admin: true });
				return;
			}

			db.query(`
			SELECT id, pword
			FROM Student
			WHERE id=${userID} AND pword='${req.query.userpw}'`, (err, results) => {
				if (err) throw err;
				res.json({ auth: results.length > 0, admin: false });
			})
		});
})

app.get('/search', async (req, res) => {
	/** req.query:

		req.query has 10 fields in total, which can all be null
		setup the sql command to add each condition one by one

		searchAll implies whether you should concatenate all the conditions with 'and' or 'or'


		example:
		{
		courseSub: 'ECE',
		courseCode: '252',
		avail: 'Available Only',
		courseType: 'LAB',
		courseName: null,
		credit: '0.5',
		campusOff: 'UW',
		building: 'E2',
		room: '3056',
		searchAll: 'true'
		}

	 */

	const attrMapper = {
		'courseSub': 'csub',
		'courseCode': 'cnum',
		'courseType': 'ctype',
		'courseName': 'title',
		'campusOff': 'campoff',
	}

	const concatenator = req.query.searchAll === 'true' ? ' OR ' : ' AND '
	const whereClause = Object.entries(req.query)
		.map(([attribute, value]) => {
			if (attribute === 'searchAll') {
				return undefined
			} else if (attribute === 'courseName') {
				return `${attrMapper[attribute]} LIKE '%${value}%'`
			} else if (attribute === 'avail') {
				return 'enrolltot < enrollcap'
			}
			return `${attrMapper[attribute] || attribute} = '${value}'`
		})
		.filter(e => e !== undefined)
		.join(concatenator)

	db.query(`
		SELECT *
		FROM component NATURAL JOIN course
		${whereClause && 'WHERE '.concat(whereClause)}
	`,
		(err, results) => {
			if (err) throw err;
			res.send(results)
		})
})

//
app.get('/friends', async (req, res) => {
	const { userId } = req.query

	// // find all friends and their names
	db.query(`
	SELECT id, first_name, last_name
	FROM friends INNER JOIN student ON friendeeid=student.id
	WHERE frienderid = ${userId}`,
		(err, results) => {
			if (err) throw err;
			res.send(results)
		})
})

app.get('/popular', async (req, res) => {
	db.query(`
	SELECT *, totEnroll + likes AS popularity
	FROM 
    (SELECT csub, cnum, SUM(enrollTot) AS totEnroll,   
        SUM(enrollCap) AS totalCap, likes
        FROM
            (SELECT csub, cnum, COUNT(SID) AS likes
            FROM Likes
            GROUP BY csub, cnum )
            AS T1 NATURAL JOIN Component
        GROUP BY csub, cnum) AS T2
    ORDER BY popularity DESC;`, (err, results) => {
		if (err) throw err;
		res.send(results);
	})
});

app.get('/schedule', async (req, res) => {
	const { userId } = req.query

	db.query(`
		SELECT *
		FROM component
		WHERE id in (
			SELECT cid
			FROM attends
			WHERE sid = ${userId}
		)`,
		(err, results) => {
			if (err) throw err;
			res.send(results)
		}
	)
})

app.get('/sharedClasses', async (req, res) => {
	const { userId } = req.query

	// need first_name, last_name, csub, cnum at the minimum, feel free to return more attributes
	db.query(`
		SELECT friendeeid, first_name, last_name, cid, csub, cnum, ctype, secnum
		FROM student INNER JOIN (
			SELECT DISTINCT friendeeid, C.id AS cid, csub, cnum, ctype, secnum
			FROM friends, component AS C
			WHERE frienderid = ${userId}
				AND C.id IN (SELECT cid FROM attends WHERE sid = frienderid) 
				AND C.id IN (SELECT cid FROM attends WHERE sid = friendeeid)) AS T
		ON id = friendeeid`,
		(err, results) => {
			if (err) throw err;
			res.send(results)
		})
})

app.get('/popular', (req, res) => {
	// req.query doesn't contain any parameters

	/**
	 * Need csub, cnum, totEnroll, totCap, likes, popularity
	 */

	db.query(`
	SELECT *, totEnroll + likes AS popularity
	FROM 
		(SELECT csub, cnum, SUM(enrollTot) AS totEnroll, SUM(enrollCap) AS totalCap, likes
    	FROM
    		(SELECT csub, cnum, COUNT(SID) AS likes
          	FROM Likes
          	GROUP BY csub, cnum ) AS T1 NATURAL JOIN Component
    GROUP BY csub, cnum) AS T2
	ORDER BY popularity DESC`,
		(err, results) => {
			if (err) throw err;
			res.send(results);
		})
})

app.delete('/modifyFriends', async (req, res) => {
	const { userId, target } = req.query
	/**
	 * sample req.query:
	 * {
	 *          userId: '10000000',
				target: '20000000'
	 * }
	 */

	db.query(`
	DELETE FROM friends
	WHERE frienderid = ${userId} AND friendeeid = ${target}`,
		(err, results) => {
			if (err) throw err;
			res.send(results)
		})
})


app.post('/modifyFriends', async (req, res) => {
	const { userId, target } = req.body
	/**
	 * sample req.body:
	 * {
	 *          userId: '10000000',
				target: '20000000'
	 * }
	 */
	db.query(`INSERT IGNORE INTO friends VALUES(${userId}, ${target})`,
		(err, results) => {
			if (err) throw err;
			res.send(results)
		})
})

app.delete('/modifyCourse', (req, res) => {
	const { userId, target } = req.query
	console.log(req)
	// Need logic to delete target from attends table
	// target = componentID to be deleted
	/**
	 * sample req.body:
	 * {
	 *          userId: '10000000',
				target: '20000000'
	 * }
	 */
	db.query(`
	DELETE FROM attends
	WHERE sid = ${userId} and cid = ${target}`,
		(err, results) => {
			if (err) throw err
			res.send(results)
		})
})

app.post('/modifyCourse', (req, res) => {
	/**
	 * req.body:
	 * user, the 8 digit id
	 * addMethod, either 'add' or 'report'
	 * componentID: the component ID
	 * 
	 * for 'report' method, simple check against user's existing schedule to make sure no conflict
	 * for 'add' method, check against user's existing schedule but also capacity of the component
	 * 
	 * return true for successful addition of the course, or a string that indicate failing reason:
	 */
	const { user, addMethod, componentID } = req.body

	if (addMethod == 'add') {
		db.query(`
		INSERT INTO attends VALUES(${user}, ${componentID});
		`,
			(err, results) => {
				if (err) res.send('You cannot add this course due to a schedule conflict')
				else res.send(true);
			})
	} else if (addMethod == 'report') {
		db.query(`
		SELECT *
		FROM Attends
		WHERE sid=${user} AND cid=${componentID}
		`,
			(err, results) => {
				if (err) throw err;
				res.send(results.length > 0);
			}
		)
	} else {
		throw new Error("Invalid add method.");
	}
})

app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`);
});

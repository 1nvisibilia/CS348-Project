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
	console.log(req.query)
	// req.query contains, for example: { userName: 'j63tao', userpw: 'secretpw' }

	/**
	 * check DB if userName exists, if so check if pw matches. return true if info are correct,
	 * false otherwise
	 */

	res.json(true); // stub
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
		'campusOff' : 'campoff',
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

app.get('/sharedClasses', async (req, res) => {
	const { userId } = req.query

	// need first_name, last_name, csub, cnum at the minimum, feel free to return more attributes
	db.query(`
		SELECT friendeeid, first_name, last_name, cid, csub, cnum
		FROM student INNER JOIN (
			SELECT DISTINCT friendeeid, C.id AS cid, csub, cnum
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


app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`);
});

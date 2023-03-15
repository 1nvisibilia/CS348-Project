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

app.get('/search', async (req, res) => {
	console.log(req.query);
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


		// sample stub
		res.json([
			{ csub: 'CS', cnum: '102' },
			{ csub: 'CS', cnum: '240' },
			{ csub: 'CS', cnum: '241' },
			{ csub: 'CS', cnum: '242' },
			{ csub: 'CS', cnum: '350' }
		]);
	 */
	db.query('SELECT csub, cnum FROM course',
		(err, results) => {
			if (err) throw err;
			res.send(results)
		})
})

//
app.get('/friends', async (req, res) => {
	console.log(req.query.userId);

	// find all friends and their names
	// stub
	res.json([
		{ id: "20000000", first_name: "Henry", last_name: "Guo" },
		{ id: "30000000", first_name: "Ryan", last_name: "Zhang" },
		{ id: "40000000", first_name: "Jiadi", last_name: "Tao" },
		{ id: "50000000", first_name: "Matthew", last_name: "Elias" }
	]);
})

app.post('/modifyFriends', async (req, res) => {
	console.log(req.body);
	/**
	 * sample res.body:
	 * {
	 *          userId: '10000000',
				action: 'add',                       // action is either 'add' or 'delete',
													 // which means adding or removing friend
				target: '20000000'
	 * }
	 */

	// return the new friend list after the add or delete opreration on the database

	res.json([
		{ id: "20000000", first_name: "Henry", last_name: "Guo" },
		{ id: "30000000", first_name: "Ryan", last_name: "Zhang" },
		{ id: "40000000", first_name: "Jiadi", last_name: "Tao" },
		{ id: "50000000", first_name: "Matthew", last_name: "Elias" }
	]);
})

app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`);
});

const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'testDB',
	port: 3306,
});
db.connect((err) => {
	if (err) throw err;
	console.log('Connection to MySql database succeeded.');
});


app.get('/', (req, res) => {
	res.send('CS348!!!!');
});

app.get('/courses', async (req, res) => {
	db.query('SELECT * FROM courses',
		(err, results) => {
			if (err) throw err
			res.send(results)
		})
});


app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`);
});

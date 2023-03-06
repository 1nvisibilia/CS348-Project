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
	/** req.query:
	 * {
			'courseSub': string | null,
			'courseCode': string | null
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


app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`);
});

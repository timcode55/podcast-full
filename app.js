const mongoose = require('mongoose');
require('./db/mongoose');
const dotenv = require('dotenv');
const cheerio = require('cheerio');
const request = require('request-promise');
const express = require('express');
const path = require('path');
const mongodb = require('mongodb');
const Rating = require('./db/Rating');
const connectDB = require('./db/mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config.env' });

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'static')));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const PORT = 7000;

connectDB();

app.get('/podcasts', async (req, res) => {
	try {
		const podcast = await Rating.find({}).lean();
		res.send(podcast);
	} catch (e) {
		res.status(500).send();
	}
});

app.post('/findId', async (req, res) => {
	try {
		const podcast = await Rating.findOne({ id: req.body.id.id }).lean();
		res.send(podcast);
	} catch (e) {
		res.status(500).send();
	}
});

// 'https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=' +
// 			genreId +
// 			'&page=' +
// 			page +
// 			'&region=us&safe_mode=0',
// 		{
// 			method: 'GET',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-ListenAPI-Key': '89c65a60479f48a18b39223f8f721ef1'
// 			},
// 			credentials: 'same-origin'
// 		}

app.get('/searchPods/', async (req, res) => {
	const genreId = req.query.genreId;
	const page = req.query.page;
	url = `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${genreId}&page=${page}&region=us&safe_mode=0`;
	await request(
		{
			url,
			headers: {
				'Content-Type': 'application/json',
				'X-ListenAPI-Key': process.env.ListenAPI
			},
			credentials: 'same-origin'
		},
		(error, response, body) => {
			if (error || response.statusCode !== 200) {
				return res.status(500).json({ type: 'error', message: err.message });
			}
			res.json(JSON.parse(body));
		}
	);
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.listen(PORT, () => {
	console.log('Server is up on port ' + PORT);
});

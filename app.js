const mongoose = require('mongoose');
require('./db/mongoose');
const dotenv = require('dotenv');
const cheerio = require('cheerio');
const request = require('request-promise');
let express = require('express');
const path = require('path');
let mongodb = require('mongodb');
const Rating = require('./db/Rating');
const connectDB = require('./db/mongoose');
const bodyParser = require('body-parser');

// Load env vars
dotenv.config({ path: './config.env' });

let app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
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

app.get('/fetchPod/', async (req, res) => {
	try {
		const podcast = await Rating.find({});
		res.status(200).json({ sucess: true, data: podcast });
	} catch (e) {
		res.status(500).send();
	}
});

app.get('fetchPod', async (req, res) => {
	res.send(podcast);
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
app.get('/podcast_data', (req, res) => {
	url = `https://itunes.apple.com/lookup?id=${req.query.id}`;
	request({ url }, (error, response, body) => {
		res.json(JSON.parse(body));
	});
});

app.listen(PORT, () => {
	console.log('Server is up on port ' + PORT);
});

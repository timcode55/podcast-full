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

app.post('/findId', async (req, res) => {
	try {
		const podcast = await Rating.findOne({ id: req.body.id.id }).lean();
		res.send(podcast);
		// console.log(req.body, 'req.body.id');
	} catch (e) {
		res.status(500).send();
	}
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.listen(PORT, () => {
	console.log('Server is up on port ' + PORT);
});

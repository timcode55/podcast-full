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
const PORT = process.env.PORT || 4000;

connectDB();

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
app.get('/podcast_data', (req, res) => {
	url = `https://itunes.apple.com/lookup?id=${req.query.id}`;
	request({ url }, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			return res.status(500).json({ type: 'error', message: err.message });
		}

		res.json(JSON.parse(body));
	});
});

let testArray = [];
async function main(list) {
	for (let i = 0; i < list.length; i++) {
		try {
			const html = await request.get(`${list[i]}`);
			const $ = await cheerio.load(html);
			let object = {};
			const titles = $('.product-header__title');
			const ratings = $('.we-customer-ratings__averages__display');
			const genre = $('.inline-list__item--bulleted');
			const numberOfRatings = $('p.we-customer-ratings__count');
			await sleep(200);
			titles.each((i, element) => {
				const title = $(element).text().trim();
				object['title'] = title;
			});

			ratings.each((i, element) => {
				const rating = $(element).text().trim();
				object['rating'] = parseFloat(rating);
			});
			genre.each((i, element) => {
				const genre = $(element).text().trim();
				object['genre'] = genre;
			});
			numberOfRatings.each((j, element) => {
				let numberOfRatings = $(element, j).text().split(' ')[0];
				for (let i = 0; i < numberOfRatings.length; i++) {
					if (numberOfRatings[i] === 'K') {
						numberOfRatings = parseFloat(numberOfRatings) * 1000;
					} else {
						numberOfRatings;
					}
				}
				object['numberOfRatings'] = numberOfRatings;
			});
			const podRating = new Rating({
				title: object.title,
				rating: object.rating,
				numberOfRatings: object.numberOfRatings,
				genre: object.genre,
				url: list[i] || ''
			});

			const podFromDb = await Rating.findOne({ title: object.title });
			try {
				if (!podFromDb) {
					try {
						testArray.push(podRating);
						podRating.save();
					} catch (error) {
						console.log('PROBLEM', error);
					}
				} else {
					try {
						Rating.findOneAndUpdate(
							{ title: object.title },
							{
								$set: {
									rating: object.rating,
									numberOfRatings: object.numberOfRatings
								}
							},
							{ new: true },
							function(err, res) {
								if (err) throw err;
							}
						);
					} catch (e) {
						console.log(e);
					}
				}
			} catch (err) {
				console.log(err);
			}

			app.get('/api/podcasts', (req, res) => {
				res.send(result);
			});
		} catch (e) {
			console.log(e);
			continue;
		}
	}
}

async function sleep(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

app.get('/podcasts', async (req, res) => {
	try {
		const podcast = await Rating.find({});
		res.send(podcast);
	} catch (e) {
		res.status(500).send();
	}
});

app.get('/rating', async (req, res) => {
	try {
		const rating = await Rating.findOne({ title: 'Base Layer' }, { rating: 1.0 });
		res.send(podcast);
	} catch (e) {
		res.status(500).send();
	}
});

app.use(express.static(path.join(__dirname, 'static')));

app.get('/podcasts/index', function(req, res) {
	res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.get('/podcasts/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const podcast = await Rating.findById(_id);
		if (!podcast) {
			return res.status(404).send();
		}
		res.send(podcast);
	} catch (e) {
		res.status(500).send();
	}
});

app.post('/podcasts', (req, res) => {
	main(req.body.urls);
	res.send({ status: 'ok' });
});

app.listen(PORT, () => {
	console.log('Server is up on port ' + PORT);
});

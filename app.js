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

// Load env vars
dotenv.config({ path: './config.env' });

let app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));
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

// console.log(__dirname);
// app.get('/podcast', (req, res) => {
// 	// res.sendFile(path.join(__dirname + '/index.html'));
// 	res.sendFile(path.join(__dirname + './test.html'));
// });

// app.get('/podcast', (req, res) => {
// 	// res.sendFile(path.join(__dirname + '/index.html'));
// 	res.sendFile(path.join(__dirname + '/static/index.html'));
// });

// let db;

// let connectionString =
// 	'mongodb+srv://iRatingUser:XbeycTPF2n5nqVrY@cluster0-b5bni.mongodb.net/iRatings?retryWrites=true&w=majority';
// mongoose
// 	.connect(connectionString, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useCreateIndex: true,
// 		useFindAndModify: false
// 	})
// 	.then(() => {
// 		console.log('DB connection was successful!');
// 		var currentPath = process.cwd();
// 		console.log(currentPath);
// 		// app.listen(5000);
// 	});

// const ratingSchema = new mongoose.Schema({
// 	name: String,
// 	// description: String,
// 	rating: Number
// });

// const Rating = mongoose.model('Rating', ratingSchema);
// var currentPath = process.cwd();
// console.log(currentPath);
// app.listen(5000);
// });

// const array = [
// 	'https://podcasts.apple.com/us/podcast/business-addicts-podcast-for-people-who-are-addicted/id976998315?uo=4',
// 	'https://podcasts.apple.com/us/podcast/brick-order/id1506078603?uo=4',
// 	'https://podcasts.apple.com/us/podcast/all-in-with-chamath-palihapitiya-jason-calacanis/id1502871393?uo=4',
// 	'https://podcasts.apple.com/us/podcast/glorious-professionals/id1506387898?uo=4',
// 	'https://podcasts.apple.com/us/podcast/traffic-secrets-underground-playbook-for-filling-your/id1504721836?uo=4'
// ];

const array = [
	// 'https://podcasts.apple.com/us/podcast/coronavirus-global-update/id1501720184?uo=4'
	// 'https://podcasts.apple.com/us/podcast/whoop-podcast/id1445509665?uo=4'
	// 'https://podcasts.apple.com/us/podcast/rebel-eaters-club/id1495401238?uo=4'
	// 'https://podcasts.apple.com/us/podcast/being-well-with-dr-rick-hanson/id1120885936?uo=4'
	// 'https://podcasts.apple.com/us/podcast/how-did-we-get-here/id1491735705?uo=4'
	// 'https://podcasts.apple.com/us/podcast/heres-the-sitch-with-mike-laurens/id1499164128?uo=4'
	// 'https://podcasts.apple.com/us/podcast/epidemic-with-dr-celine-gounder-and-ronald-klain/id1499394284?uo=4'
	// 'https://podcasts.apple.com/us/podcast/coronavirus-central/id1498528686?uo=4'
	// 'https://podcasts.apple.com/us/podcast/an-arm-and-a-leg/id1438778444?uo=4'
	// 'https://podcasts.apple.com/us/podcast/yang-speaks/id1508035243?uo=4'
	// 'https://podcasts.apple.com/us/podcast/outside-podcast/id1090500561?uo=4'
	// "https://podcasts.apple.com/us/podcast/naked-beauty/id1131628553?uo=4"
	// "https://podcasts.apple.com/us/podcast/get-sleepy-sleep-meditation-and-stories/id1487513861?uo=4"
	// "https://podcasts.apple.com/us/podcast/fitness-disrupted-with-tom-holland/id1480751239?uo=4"
	// "https://podcasts.apple.com/us/podcast/the-wellness-mama-podcast/id886538772?uo=4"
	// "https://podcasts.apple.com/us/podcast/the-gabby-reece-show/id1492179907?uo=4"
	// "https://podcasts.apple.com/us/podcast/american-glutton/id1490933138?uo=4"
	// 'https://podcasts.apple.com/us/podcast/the-dr-axe-show/id1493717594?uo=4'
	// 'https://podcasts.apple.com/us/podcast/the-school-of-greatness/id596047499?uo=4'
	// 'https://podcasts.apple.com/us/podcast/sleepy/id1349652154?uo=4'
	// "https://podcasts.apple.com/us/podcast/food-we-need-to-talk/id1490621476?uo=4"
	// "https://podcasts.apple.com/us/podcast/faster-way-podcast/id1489399975?uo=4"
	// "https://podcasts.apple.com/us/podcast/heal-survive-thrive/id1438033349?uo=4"
	// "https://podcasts.apple.com/us/podcast/rxd-radio/id1197955534?uo=4"
	// "https://podcasts.apple.com/us/podcast/gozen-anxiety-relief-for-kids/id960739852?uo=4"
	// "https://podcasts.apple.com/us/podcast/the-ketogenic-athlete-podcast/id1143236434?uo=4"
	// "https://podcasts.apple.com/us/podcast/unshakable-self-confidence/id1163350738?uo=4"
	// "https://podcasts.apple.com/us/podcast/functioning-minimalist/id1118822483?uo=4"
	// "https://podcasts.apple.com/us/podcast/not-another-anxiety-show/id1175495815?uo=4"
	// "https://podcasts.apple.com/us/podcast/motivational-mornings/id1073196213?uo=4"
	// "https://podcasts.apple.com/us/podcast/high-intensity-health-with-mike-mutzel-ms/id910048041?uo=4"
	// "https://podcasts.apple.com/us/podcast/daily-meditation-podcast/id892107837?uo=4"
	// "https://podcasts.apple.com/us/podcast/greatest-motivational-and-inspirational-speeches-ever/id1459957079?uo=4"
	// "https://podcasts.apple.com/us/podcast/sleep-meditation-podcast/id1365312021?uo=4"
	// "https://podcasts.apple.com/us/podcast/late-night-health/id1077035871?uo=4"
	// "https://podcasts.apple.com/us/podcast/hope-to-recharge/id1464788845?uo=4"
	// "https://podcasts.apple.com/us/podcast/my-favorite-distraction/id1471119496?uo=4"
	// "https://podcasts.apple.com/us/podcast/energy-clearing-for-life-force/id1470861149?uo=4"
	// "https://podcasts.apple.com/us/podcast/the-balanced-life/id1466283984?uo=4"
	// "https://podcasts.apple.com/us/podcast/doing-this-for-you-tone-and-sculpt/id1465737552?uo=4"
	// "https://podcasts.apple.com/us/podcast/danica-patrick-pretty-intense-podcast/id1465014169?uo=4"
	// "https://podcasts.apple.com/us/podcast/goopfellas/id1459400887?uo=4"
	//   "https://podcasts.apple.com/us/podcast/missing-in-alaska/id1506816225?uo=4"
	// "https://podcasts.apple.com/us/podcast/black-history-year/id1471015571?uo=4"
	// "https://podcasts.apple.com/us/podcast/the-dissenters-with-debra-messing-and-mandana-dayani/id1510623465?uo=4"
	// "https://podcasts.apple.com/us/podcast/no-stupid-questions/id1510056899?uo=4"
	// "https://podcasts.apple.com/us/podcast/rzim-let-my-people-think-broadcasts/id1174079089?uo=4"
	// "https://podcasts.apple.com/us/podcast/ten-percent-happier-with-dan-harris/id1087147821?uo=4"
	// "https://podcasts.apple.com/us/podcast/the-dream-team-tapes-with-jack-mccallum/id1498713408?uo=4"
	// "https://podcasts.apple.com/us/podcast/the-daily-smile/id1511191961?uo=4"
	// "https://podcasts.apple.com/us/podcast/the-last-archive/id1506207997?uo=4"
	// "https://podcasts.apple.com/us/podcast/disappearing-spoon-a-science-history-podcast-by-sam-kean/id1506994358?uo=4"
	// 'https://podcasts.apple.com/us/podcast/radio-headspace/id1510981488?uo=4'
	// 'https://podcasts.apple.com/us/podcast/living-with-landyn-with-landyn-hutchinson/id1504075237?uo=4'
	// 'https://podcasts.apple.com/us/podcast/unfictional/id393433206?uo=4'
	// 'https://podcasts.apple.com/us/podcast/real-narcos/id1504486636?uo=4'
	'https://podcasts.apple.com/us/podcast/the-trey-gowdy-podcast/id1509074854?uo=4'
	// "https://podcasts.apple.com/us/podcast/team-deakins/id1510638084?uo=4"
	// "https://podcasts.apple.com/us/podcast/annie-and-eddie-keep-talking/id1510645180?uo=4"
	// 'https://podcasts.apple.com/us/podcast/the-darkest-timeline-with-ken-jeong-joel-mchale/id1504921890?uo=4'
	// 'https://podcasts.apple.com/us/podcast/the-dan-bongino-show/id965293227?uo=4'
	// 'https://podcasts.apple.com/us/podcast/motive-for-murder/id1510365500?uo=4'
];

async function main(list) {
	for (let i = 0; i < list.length; i++) {
		// console.log(list[i]);

		const html = await request.get(`${list[i]}`);
		// console.log(html);
		const $ = await cheerio.load(html);
		let object = {};
		const titles = $('.product-header__title');
		const ratings = $('.we-customer-ratings__averages__display');
		const genre = $('.inline-list__item--bulleted');
		const numberOfRatings = $('p.we-customer-ratings__count');
		// const description = $('#ember381 > p');
		// const descriptions = $('[name="ember-cli-head-start"]');
		// console.log(descriptions);
		await sleep(200);
		titles.each((i, element) => {
			const title = $(element).text().trim();
			// console.log(title);
			object['title'] = title;
		});
		// description.each((i, element) => {
		// 	const description = $(element).text().trim();
		// 	console.log(description);
		// 	object['description'] = description;
		// });
		ratings.each((i, element) => {
			const rating = $(element).text().trim();
			// console.log(rating);
			object['rating'] = rating;
		});
		genre.each((i, element) => {
			const genre = $(element).text().trim();
			// console.log(rating);
			object['genre'] = genre;
		});
		numberOfRatings.each((i, element) => {
			let numberOfRatings = $(element, i).text().split(' ')[0];
			for (let i = 0; i < numberOfRatings.length; i++) {
				if (numberOfRatings[i] === 'K') {
					numberOfRatings = parseFloat(numberOfRatings) * 1000;
				} else {
					numberOfRatings;
				}
			}
			console.log(numberOfRatings);
			object['numberOfRatings'] = numberOfRatings;
		});
		console.log(list);
		console.log(list[i]);
		const podRating = new Rating({
			title: object.title,
			rating: object.rating,
			numberOfRatings: object.numberOfRatings,
			genre: object.genre,
			// description: object.description,
			url: list[i] || ''
		});
		const podFromDb = await Rating.findOne({ title: object.title });
		console.log(podFromDb);
		if (!podFromDb) {
			console.log("item doesn't exist, I'll add it");
			podRating.save();
		} else {
			console.log('item already exists');
		}
		// console.log(object);

		const allPods = await Rating.find();
		let result = JSON.stringify(allPods);
		// console.log(allPods);
		app.get('/api/podcasts', (req, res) => {
			res.send(result);
		});
	}
}

// let getAllPodcasts = async (req, res) => {
// 	try {
// 		const podcastsAll = await Rating.find();

// 		res.status(200).json({
// 			status: 'success',
// 			results: podcastsAll.length,
// 			data: {
// 				podcastsAll
// 			}
// 		});
// 	} catch (err) {
// 		res.status(404).json({
// 			status: 'fail',
// 			message: err
// 		});
// 	}
// };

// console.log(getAllPodcasts);

async function sleep(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// main();

// app.get('/podcast', (req, res) => {
// 	// res.sendFile(path.join(__dirname + '/index.html'));
// 	res.sendFile(path.join(__dirname + '../../../static/index.html'));
// });

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
	console.log(req.body);
	main(req.body.urls);
	res.send({ status: 'ok' });
});

app.listen(PORT, () => {
	console.log('Server is up on port ' + PORT);
});

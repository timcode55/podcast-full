// const mongoose = require('mongoose');
// const cheerio = require('cheerio');
// const request = require('request-promise');
// let express = require('express');
// const path = require('path');
// let mongodb = require('mongodb');
// const Rating = require('./Rating');

// let app = express();
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
// 	});
// // .then(function(err, client) {
// // 	db = client.db();

// // const ratingSchema = new mongoose.Schema({
// // 	name: String,
// // 	// description: String,
// // 	rating: Number
// // });

// // const Rating = mongoose.model('Rating', ratingSchema);
// var currentPath = process.cwd();
// console.log(currentPath);
// app.listen(5000);
// // });

// // const array = [
// // 	'https://podcasts.apple.com/us/podcast/business-addicts-podcast-for-people-who-are-addicted/id976998315?uo=4',
// // 	'https://podcasts.apple.com/us/podcast/brick-order/id1506078603?uo=4',
// // 	'https://podcasts.apple.com/us/podcast/all-in-with-chamath-palihapitiya-jason-calacanis/id1502871393?uo=4',
// // 	'https://podcasts.apple.com/us/podcast/glorious-professionals/id1506387898?uo=4',
// // 	'https://podcasts.apple.com/us/podcast/traffic-secrets-underground-playbook-for-filling-your/id1504721836?uo=4'
// // ];

// const array = [
// 	'https://podcasts.apple.com/us/podcast/killer-queens-a-true-crime-podcast/id1268919812?uo=4'
// 	// 'https://podcasts.apple.com/us/podcast/the-dating-game-killer/id1500035260?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/women-and-crime/id1485129718?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/hollywood-crime-scene/id1262899883?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/killer-knowledge-the-true-crime-game-show/id1495851780?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/crimes-of-passion/id1451771847?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/olive-hill/id1437859766?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/the-angel-of-vine/id1440183372?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/arden/id1435114916?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/mile-higher-podcast/id1332383970?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/the-catch-and-kill-podcast-with-ronan-farrow/id1487730212?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/unheard-the-fred-and-rose-west-tapes/id1477325492?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/criminal-perspective/id1471068303?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/10-41-with-todd-mccomas/id1498411118?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/pd-stories/id1388449809?uo=4',
// 	// 'https://podcasts.apple.com/us/podcast/obsessed-with-abducted-in-plain-sight/id1497637810?uo=4'
// ];

// async function main() {
// 	for (let i = 0; i < array.length; i++) {
// 		// console.log(array[i]);

// 		const html = await request.get(`${array[i]}`);
// 		// console.log(html);
// 		const $ = await cheerio.load(html);
// 		let object = {};
// 		const titles = $('.product-header__title');
// 		const ratings = $('.we-customer-ratings__averages__display');
// 		// const descriptions = $('.we-clamp > p:last-child');
// 		// console.log(descriptions);
// 		await sleep(1000);
// 		titles.each((i, element) => {
// 			const title = $(element).text().trim();
// 			// console.log(title);
// 			object['title'] = title;
// 		});
// 		// descriptions.each((i, element) => {
// 		// 	const description = $(element)[i].innerText;
// 		// 	// console.log(description);
// 		// 	object['description'] = description;
// 		// });
// 		ratings.each((i, element) => {
// 			const rating = $(element).text().trim();
// 			// console.log(rating);
// 			object['rating'] = Number(rating);
// 		});
// 		// console.log(object);

// 		const podRating = new Rating({
// 			title: object.title,
// 			rating: object.rating,
// 			url: array[i]
// 		});
// 		const podFromDb = await Rating.findOne({ title: object.title });
// 		if (!podFromDb) {
// 			console.log("item doesn't exist, I'll add it");
// 			podRating.save();
// 		} else {
// 			// console.log('item already exists');
// 		}

// 		const allPods = await Rating.find();
// 		let result = JSON.stringify(allPods);
// 		// console.log(allPods);
// 		app.get('/api/podcasts', (req, res) => {
// 			res.send(result);
// 		});
// 		// const starRating = new Rating({
// 		// 	title,
// 		// 	rating
// 		// });

// 		// starRating
// 		// 	.save()
// 		// 	.then((doc) => {
// 		// 		console.log(doc);
// 		// 	})
// 		// 	.catch((err) => {
// 		// 		console.log('ERROR:', err);
// 		// 	});
// 	}
// }

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

// async function sleep(milliseconds) {
// 	return new Promise((resolve) => setTimeout(resolve, milliseconds));
// }

// main();

// console.log(array[0]);

// app.get('/api/podcasts', (req, res) => {
// 	res.send(`${allPods}`);
// });

// app.post('/create-item', (req, res) => {
// 	console.log('in post function', object);
// 	db.collection('items').insertOne({ object }, () => {
// 		res.send('Thanks for submitting the form.');
// 	});
// });

// app.get('/podcast', (req, res) => {
// 	// res.sendFile(path.join(__dirname + '/index.html'));
// 	res.sendFile(path.join(__dirname + '/static/index.html'));
// });

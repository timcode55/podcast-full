const mongoose = require('mongoose');

const Rating = mongoose.model(
	'Rating',
	mongoose.Schema({
		title: { type: String, index: true, unique: true, dropDups: true, sparse: true },
		id: String,
		rating: Number,
		image: String,
		numberOfRatings: Number,
		genre: String,
		listenNotesGenre: String,
		description: String,
		website: String,
		itunes: String,
		itunesid: Number,
		listennotesurl: String
	})
);

module.exports = Rating;

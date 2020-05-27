const mongoose = require('mongoose');

const Rating = mongoose.model(
	'Rating',
	mongoose.Schema({
		title: String,
		rating: Number,
		numberOfRatings: Number,
		genre: String,
		// description: String,
		url: String
	})
);

module.exports = Rating;

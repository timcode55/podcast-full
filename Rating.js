const mongoose = require('mongoose');

const Rating = mongoose.model(
	'Rating',
	mongoose.Schema({
		title: String,
		// description: String,
		rating: Number,
		url: String
	})
);

module.exports = Rating;

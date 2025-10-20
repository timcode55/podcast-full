const mongoose = require("mongoose");

const Rating = mongoose.model(
  "Rating",
  mongoose.Schema({
    title: {
      type: String,
      index: true, // searchable, but not unique
      sparse: true,
    },
    id: {
      type: String,
      unique: true,
      index: true,
    },
    rating: Number,
    image: String,
    numberOfRatings: Number,
    genre: String,
    listenNotesGenre: String,
    description: String,
    website: String,
    itunes: String,
    itunesid: Number,
    listennotesurl: String,
  })
);

module.exports = Rating;

const mongoose = require("mongoose");
require("dotenv").config();

const DATABASE = process.env.DATABASE;

const RatingSchema = new mongoose.Schema({
  id: String,
  title: String,
  rating: Number,
  genre: String,
  listenNotesGenre: String,
  itunes: String,
  numberOfRatings: Number,
  image: String,
  description: String,
  website: String,
  itunesid: Number,
  listennotesurl: String,
  iTunesDesc: String,
});

const Rating = mongoose.model("Rating", RatingSchema);

async function reportDuplicates() {
  try {
    await mongoose.connect(DATABASE);
    console.log("Connected to MongoDB");

    // ---- Duplicate IDs ----
    const duplicatesById = await Rating.aggregate([
      { $match: { id: { $ne: null } } }, // ignore null IDs
      { $group: { _id: "$id", count: { $sum: 1 }, docs: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    console.log(`\nFound ${duplicatesById.length} duplicate IDs.`);
    duplicatesById.forEach((dup) => {
      console.log(`\nDuplicate ID: ${dup._id}`);
      console.log(`Total documents: ${dup.count}`);
      console.log(`Document _ids: ${dup.docs.join(", ")}`);
    });

    // ---- Duplicate Titles ----
    const duplicatesByTitle = await Rating.aggregate([
      { $match: { title: { $ne: null, $ne: "" } } }, // ignore null/empty titles
      {
        $group: {
          _id: { $trim: { input: "$title" } }, // trim whitespace
          count: { $sum: 1 },
          docs: { $push: "$_id" },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    console.log(`\nFound ${duplicatesByTitle.length} duplicate titles.`);
    duplicatesByTitle.forEach((dup) => {
      console.log(`\nDuplicate Title: "${dup._id}"`);
      console.log(`Total documents: ${dup.count}`);
      console.log(`Document _ids: ${dup.docs.join(", ")}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error reporting duplicates:", err);
    process.exit(1);
  }
}

reportDuplicates();

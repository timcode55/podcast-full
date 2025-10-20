const mongoose = require("mongoose");
require("dotenv").config();

const RatingSchema = new mongoose.Schema({
  title: { type: String, index: true, sparse: true }, // NOT unique
  id: { type: String, unique: true, index: true },
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

const DATABASE = process.env.DATABASE; // your .env URL

async function fixIndexes() {
  try {
    await mongoose.connect(DATABASE);
    console.log("Connected to MongoDB");

    // 1️⃣ Drop the old unique title index
    try {
      await Rating.collection.dropIndex("title_1");
      console.log("✅ Dropped unique index on title");
    } catch (err) {
      console.log("⚠️ No existing title index to drop:", err.message);
    }

    // 2️⃣ Make sure the unique index on id exists
    await Rating.collection.createIndex({ id: 1 }, { unique: true });
    console.log("✅ Ensured unique index on id");

    console.log("All done!");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing indexes:", err);
    process.exit(1);
  }
}

fixIndexes();

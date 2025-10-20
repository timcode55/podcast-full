// cleanDuplicates.js
const mongoose = require("mongoose");
require("dotenv").config();

const Rating = require("./db/Rating"); // your Mongoose model

const mongoURI = process.env.DATABASE || "your_mongo_url_here";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const cleanDuplicates = async () => {
  try {
    const allDocs = await Rating.find({}).lean();

    // Group by ID
    const idMap = {};
    for (const doc of allDocs) {
      if (!idMap[doc.id]) {
        idMap[doc.id] = [];
      }
      idMap[doc.id].push(doc);
    }

    for (const [id, docs] of Object.entries(idMap)) {
      if (docs.length > 1) {
        console.log(`Duplicate ID found: ${id}`);
        // Keep the last doc (most recent scrape)
        const [keepDoc, ...toRemove] = docs.reverse();
        for (const doc of toRemove) {
          await Rating.deleteOne({ _id: doc._id });
          console.log(`Deleted duplicate doc with _id: ${doc._id}`);
        }
        // Optional: update the kept doc with latest info if needed
        await Rating.updateOne({ _id: keepDoc._id }, { $set: keepDoc });
      }
    }

    console.log("Duplicate cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error cleaning duplicates:", error);
    process.exit(1);
  }
};

connectDB().then(cleanDuplicates);

const mongoose = require("mongoose");
require("./db/mongoose");
const dotenv = require("dotenv");
const cheerio = require("cheerio");
const express = require("express");
const path = require("path");
const Rating = require("./db/Rating");
const connectDB = require("./db/mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
let getCategories = require("./category-list");
const axios = require("axios");

require("dotenv").config({ path: ".env" });

let app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
const PORT = 8000;

connectDB();

app.use(express.static(path.join(__dirname, "static")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Sort by recent_added_first or listen_score
const getTopPodcastsByGenre = async (
  genreId,
  page,
  categoryTitle,
  arrayIndex
) => {
  const response = await axios.get(
    `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${genreId}&page=${page}&region=us&sort=recent_added_first&safe_mode=0`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-ListenAPI-Key": process.env.ListenAPI,
      },
      credentials: "same-origin",
    }
  );
  for (let pod of response.data.podcasts) {
    try {
      const result = await iTunesLink(pod.itunes_id, categoryTitle);
      console.log("API response:", result);
      console.log(result, "RESULT IN GETTOPPODCASTS");
      pod["itunes"] = result;
    } catch (error) {
      console.error("Failed to retrieve link:", error);
    }
  }
  // console.log(response.data.podcasts, "RESPONSE.DATA IN GETLISTENNOTESDATA");
  scrapeRatings(response.data.podcasts, categoryTitle, arrayIndex, page);
  return response.data.podcasts;
};

const iTunesLink = async (iTunesId, category) => {
  if (!iTunesId) {
    return "https://podcasts.apple.com";
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await axios.get(
        `https://itunes.apple.com/lookup?id=${iTunesId}`
      );

      if (response.data.results[0]?.collectionViewUrl) {
        return response.data.results[0].collectionViewUrl;
      } else {
        return "https://podcasts.apple.com";
      }
    } catch (error) {
      console.error("An error occurred:", error);
      retryCount++;
      console.log(`Retrying... (Attempt ${retryCount} of ${maxRetries})`);
    }
  }
  throw new Error("Failed to fetch data after multiple retries");
};

let displayArray = [];
let displayCategory = "";
let categoryIdx = null;

const scrapeRatings = async (array, category, arrayIndex, page) => {
  // console.log(array, "array in scraperatings");
  console.log(category, "CATEGORY IN SCRAPERATINGS");
  displayCategory = category;

  for (let i = 0; i < array.length; i++) {
    try {
      // console.log(array[i].itunes, "ARRAY[I].ITUNES");
      console.log(array[i].image, "ARRAY[I].ITUNES");
      // console.log(itunesLink.itunes, "IS ITUNESLINK WORKING");
      // const html = await axios.get(`${array[i].itunes}`);
      const response = await axios.get(`${array[i].itunes}`);
      const html = response.data; // ✅ Extract the HTML
      const $ = await cheerio.load(html);
      const ratings = $('div[data-testid="amp-rating__average-rating"]');
      // const genre = $(".inline-list__item--bulleted");
      const ratingsCountText = $(
        'div[data-testid="amp-rating__rating-count-text"]'
      ).text();
      // Check if the element exists and handle missing elements
      if (!ratingsCountText) {
        array[i]["numberOfRatings"] = 0;
      } else {
        const ratingsCount = ratingsCountText
          .replace(" Ratings", "")
          .replace(/,/g, "")
          .trim(); // Remove ' Ratings' and commas

        const numOfRatings = parseInt(ratingsCount, 10);
        array[i]["numberOfRatings"] = numOfRatings;

        console.log(
          numOfRatings,
          "numberOfRatings in scrape numberOfRatings.each"
        );
      }

      const rating = ratings.text().trim();
      console.log(rating, "rating in scrape ratings.each");
      array[i]["rating"] = parseFloat(rating) || 0;
      array[i]["genre"] = category;

      array[i]["itunes"] = array[i].itunes;
      array[i]["listenNotesGenre"] = category;
    } catch (error) {
      console.log("ERROR SCRAPING PODCAST");
    }
  }
  saveToDatabase(array, category, arrayIndex, page);
  displayArray = array;
};

const saveToDatabase = async (fullArray, category, arrayIndex, page) => {
  console.log("SAVE TO DATABASE CALLED");

  try {
    for (let i = 0; i < fullArray.length; i++) {
      const currentId = fullArray[i].id;

      const filter = { id: fullArray[i].id };
      const update = {
        $set: {
          rating: fullArray[i].rating,
          genre: fullArray[i].genre,
          listenNotesGenre: fullArray[i].listenNotesGenre,
          itunes: fullArray[i].itunes,
          numberOfRatings: fullArray[i].numberOfRatings,
          title: fullArray[i].title,
          id: fullArray[i].id,
          image: fullArray[i].image,
          description: fullArray[i].description,
          website: fullArray[i].website,
          itunesid: fullArray[i].itunes_id,
          listennotesurl: fullArray[i].listennotes_url,
          iTunesDesc: fullArray[i].iTunesDescription,
        },
      };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      try {
        const result = await Rating.findOneAndUpdate(
          filter,
          update,
          options
        ).lean();

        console.log(
          `${fullArray[i].title} added or updated to MONGODB with Rating ${
            fullArray[i].rating
          } and #Ratings ${Number(
            fullArray[i].numberOfRatings
          )} and page #${page} and genre - ${fullArray[i].genre}`
        );
      } catch (error) {
        if (error.code === 11000) {
          console.error("🚨 DUPLICATE ERROR DETECTED");

          console.error("Scraped Data Causing Error:", {
            title: fullArray[i].title,
            id: fullArray[i].id,
          });

          // 🔍 See what exists in the database with this title
          const existingByTitle = await Rating.findOne({
            title: fullArray[i].title,
          }).lean();
          console.error("Existing Document with SAME TITLE:", existingByTitle);

          // 🔍 Check if there's also a doc with the same scraped `id`
          const existingById = await Rating.findOne({
            id: fullArray[i].id,
          }).lean();
          console.error("Existing Document with SAME ID:", existingById);
        }

        console.log("ERROR UPDATING DB", error);
        continue;
      }
    }

    console.log(
      `${category} Category Updated and Added to DB, ArrayIndex is ${arrayIndex}, Page is ${page}`
    );
  } catch (error) {
    console.log(
      "ERROR UPDATING DB",
      `${category} Category was not updated properly, ArrayIndex is ${arrayIndex}`
    );
  }
};

app.get("/display", (req, res) => {
  res.status(200).json({
    data: displayArray,
    category: displayCategory,
    index: categoryIdx,
  });
});

// Scrape through categories 0 to 159 on a set page
// Scrape #
// on page 13 with most recent and page 7 on listen_score

// const scrapePodcasts = (array, i = 0) => {
//   if (!array[i]) {
//     console.log("Reached end of array or invalid index:", i);
//     return; // Stop execution if out of bounds
//   }
//   console.log("testing");
//   console.log("daily podcasts*****", array[i].name);
//   let genreId = array[i].id;
//   console.log(i, array[i].name, "scrape timeout");
//   let categoryIdx = i;
//   let categoryTitle = array[i].name;
//   let page = 1;
//   getTopPodcastsByGenre(genreId, page, categoryTitle, i);

//   setTimeout(() => {
//     if (i + 1 < array.length) scrapePodcasts(array, i + 1);
//   }, 60000); // multiple i by 1000
//   //}
// };
// scrapePodcasts(getCategories());

// Scrape the same category and iterate through the pages 1 to 30

// Popular Categories
// True Crime - 149
// Health & Fitness - 58
// Business - 17
// Podcasts - 110
// Technology - 145

const scrapePodcasts = (array, page = 35, i = 149) => {
  if (page > 100) return; // Stop when page exceeds 30

  console.log("testing");
  console.log("daily podcasts*****", array[i].name);
  let genreId = array[i].id;
  console.log(i, array[i].name, "scrape timeout");
  let categoryTitle = array[i].name;

  getTopPodcastsByGenre(genreId, page, categoryTitle, i);

  setTimeout(() => {
    scrapePodcasts(array, page + 1, i); // Increment page, keep category
  }, 60000); // Delay for 60 seconds
};
scrapePodcasts(getCategories());

// app.listen(PORT, () => {
//   console.log("Server is up on port " + PORT);
// });

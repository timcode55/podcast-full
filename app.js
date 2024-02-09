const mongoose = require("mongoose");
require("./db/mongoose");
const dotenv = require("dotenv");
const cheerio = require("cheerio");
const request = require("request-promise");
const express = require("express");
const path = require("path");
let mongodb = require("mongodb");
const Rating = require("./db/Rating");
const connectDB = require("./db/mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
// const fetch = require("node-fetch");
// var ObjectId = require("mongodb").ObjectID;
// var ObjectId = require("mongoose").Types.ObjectId;
var getCategories = require("./category-list");
const axios = require("axios");

// Load env vars
// dotenv.config({ path: "./env" });
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
// const PORT = process.env.PORT || 7000;
const PORT = 8000;

connectDB();

app.use(express.static(path.join(__dirname, "static")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const getTopPodcastsByGenre = async (
  genreId,
  page,
  categoryTitle,
  arrayIndex
) => {
  const response = await axios.get(
    `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${genreId}&page=${page}&region=us&sort=listen_score&safe_mode=0`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-ListenAPI-Key": process.env.ListenAPI,
      },
      credentials: "same-origin",
    }
  );
  // console.log(response.data.podcasts, "response.data.podcasts");
  for (let pod of response.data.podcasts) {
    // let result = await iTunesLink(pod.itunes_id, categoryTitle);

    try {
      const result = await iTunesLink(pod.itunes_id, categoryTitle);
      console.log("API response:", result);
      console.log(result, "RESULT IN GETTOPPODCASTS");
      pod["itunes"] = result;
    } catch (error) {
      console.error("Failed to retrieve link:", error);
    }

    // console.log(result, "result in iTunesLink call");
  }
  // console.log(response.data.podcasts, "RESPONSE.DATA IN GETLISTENNOTESDATA");
  scrapeRatings(response.data.podcasts, categoryTitle, arrayIndex);
  return response.data.podcasts;
};

// getTopPodcastsByGenre(67, 1, "Podcasts");

// const iTunesLink = async (iTunesId, category) => {
//   console.log(iTunesId, "ITUNESID");
//   if (!iTunesId) {
//     return "https://podcasts.apple.com";
//   }
//   const response = await axios.get(
//     `https://itunes.apple.com/lookup?id=${iTunesId}`
//   );
//   if (response.data.results[0]?.collectionViewUrl) {
//     return response.data.results[0].collectionViewUrl;
//   } else {
//     return "https://podcasts.apple.com";
//   }
// };

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

const scrapeRatings = async (array, category, arrayIndex) => {
  // console.log(array, "array in scraperatings");
  console.log(category, "CATEGORY IN SCRAPERATINGS");
  displayCategory = category;
  // console.log(array.length, "length of array");
  // console.log("a");

  // var i = 1; //  set your counter to 1
  for (let i = 0; i < array.length; i++) {
    try {
      console.log(array[i].itunes, "ARRAY[I].ITUNES");
      // console.log(itunesLink.itunes, "IS ITUNESLINK WORKING");
      const html = await request.get(`${array[i].itunes}`);
      // // console.log(html);
      const $ = await cheerio.load(html);
      // let object = {};
      // const titles = $(".product-header__title");
      const ratings = $(".we-customer-ratings__averages__display");
      const genre = $(".inline-list__item--bulleted");
      const numOfRatings = $("p.we-customer-ratings__count");
      const podDescription = $("product-hero-desc__section");

      // ratings.each((i, element) => {
      const rating = ratings.text().trim();
      console.log(rating, "rating in scrape ratings.each");
      array[i]["rating"] = parseFloat(rating) || 0;
      // });
      genre.each((i, element) => {
        const genre = $(element).text().trim();
        // console.log(rating);
        array[i]["genre"] = genre;
      });
      // numOfRatings.each((j, element) => {
      let numberOfRatings = numOfRatings.text().split(" ")[0];
      if (numberOfRatings === "") {
        array[i]["numberOfRatings"] = "";
      }
      console.log(
        numberOfRatings,
        "numberOfRatings in scrape numberOfRatings.each"
      );

      // for (let i = 0; i < numberOfRatings.length; i++) {
      if (numberOfRatings.includes("K")) {
        array[i]["numberOfRatings"] = parseInt(
          parseFloat(numberOfRatings) * 1000
        );
      } else {
        array[i]["numberOfRatings"] = parseInt(numberOfRatings, 10) || 0;
      }

      // }
      // console.log(numberOfRatings);

      array[i]["itunes"] = array[i].itunes;
      array[i]["listenNotesGenre"] = category;
    } catch (error) {
      console.log("ERROR SCRAPING PODCAST");
    }
  }
  // console.log(array, "ARRAY BEFORE DISPLAYARRAY*******");
  saveToDatabase(array, category, arrayIndex);
  displayArray = array;
};

// const saveToDatabase = (fullArray, category, arrayIndex) => {
//   console.log("SAVE TO DATABASE CALLED");
//   // console.log(fullArray[0].rating, "FULLARRAY TO SAVE TO DB");
//   for (let i = 0; i < fullArray.length; i++) {
//     // console.log(fullArray[i], "FULLARRAY[I] SAVING TO DB");
//     try {
//       Rating.findOneAndUpdate(
//         // $set: { rating: object.rating },

//         { id: fullArray[i].id },
//         {
//           $set: {
//             rating: fullArray[i].rating,
//             genre: fullArray[i].genre,
//             listenNotesGenre: fullArray[i].listenNotesGenre,
//             itunes: fullArray[i].itunes,
//             numberOfRatings: fullArray[i].numberOfRatings,
//             title: fullArray[i].title,
//             id: fullArray[i].id,
//             image: fullArray[i].image,
//             description: fullArray[i].description,
//             website: fullArray[i].website,
//             itunesid: fullArray[i].itunes_id,
//             listennotesurl: fullArray[i].listennotes_url,
//             iTunesDesc: fullArray[i].iTunesDescription,
//           },
//         },
//         { upsert: true, useFindAndModify: false },
//         (err, res) => {
//           if (err) throw err;
//           // console.log("1 document updated");
//         }
//       ).lean();
//       console.log(
//         `${fullArray[i].title} added or updated to MONGODB with Rating ${fullArray[i].rating} and #Ratings ${fullArray[i].numberOfRatings}`
//       );
//     } catch (error) {
//       console.log(
//         "ERROR UPDATING DB",
//         `${category} Category Updated and Added to DB, ArrayIndex is ${arrayIndex}`
//       );
//       continue;
//     }
//   }
//   console.log(
//     `${category} Category Updated and Added to DB, ArrayIndex is ${arrayIndex}`
//   );
// };

const saveToDatabase = async (fullArray, category, arrayIndex) => {
  console.log("SAVE TO DATABASE CALLED");

  try {
    for (let i = 0; i < fullArray.length; i++) {
      const currentId = fullArray[i].id;

      const filter = { id: currentId };
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
      const options = { upsert: true, useFindAndModify: false };

      try {
        const result = await Rating.findOneAndUpdate(
          filter,
          update,
          options
        ).lean();

        console.log(
          `${fullArray[i].title} added or updated to MONGODB with Rating ${fullArray[i].rating} and #Ratings ${fullArray[i].numberOfRatings}`
        );
      } catch (error) {
        console.log("ERROR UPDATING DB", error);
        continue;
      }
    }

    console.log(
      `${category} Category Updated and Added to DB, ArrayIndex is ${arrayIndex}`
    );
  } catch (error) {
    console.log(
      "ERROR UPDATING DB",
      `${category} Category Updated and Added to DB, ArrayIndex is ${arrayIndex}`
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
// Scrape #
const scrapePodcasts = (array, i = 57) => {
  console.log("testing");
  console.log("daily podcasts*****", array[i].name);
  //for (let i = 21; i < 22; i++) {
  let genreId = array[i].id;
  console.log(i, array[i].name, "scrape timeout");
  categoryIdx = i;
  let categoryTitle = array[i].name;
  // let titleDisplay = document.querySelector(".title");
  // titleDisplay.textContent = `CATEGORY - ${array[i].name.toUpperCase()}`;
  // START OF PAGE TO SCRAPE
  // let page = 18;
  let page = 1;
  getTopPodcastsByGenre(genreId, (page = 1), categoryTitle, i);

  setTimeout(() => {
    if (array.length > i && i !== array.length) scrapePodcasts(array, i + 1);
  }, 60000); // multiple i by 1000
  //}
};
scrapePodcasts(getCategories());

// process.on("uncaughtException", (error) => {
//   console.error("An uncaught exception occurred:", error);
//   // Handle the error and potentially exit gracefully
// });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("An unhandled promise rejection occurred:", reason);
//   // Handle the rejection and potentially exit gracefully
// });

app.listen(PORT, () => {
  console.log("Server is up on port " + PORT);
});

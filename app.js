const mongoose = require("mongoose");
require("./db/mongoose");
const dotenv = require("dotenv");
const cheerio = require("cheerio");
const request = require("request-promise");
let express = require("express");
const path = require("path");
let mongodb = require("mongodb");
const Rating = require("./db/Rating");
const connectDB = require("./db/mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
// const fetch = require("node-fetch");
var ObjectId = require("mongodb").ObjectID;
var ObjectId = require("mongoose").Types.ObjectId;
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
const PORT = 9500;

connectDB();

app.use(express.static(path.join(__dirname, "static")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const getTopPodcastsByGenre = async (genreId, page, categoryTitle) => {
  const response = await axios.get(
    `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${genreId}&page=${page}&region=us&safe_mode=0`,
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
    let result = await iTunesLink(pod.itunes_id, categoryTitle);
    pod["itunes"] = result;
    // console.log(result, "result in iTunesLink call");
  }
  // console.log(response.data.podcasts, "RESPONSE.DATA IN GETLISTENNOTESDATA");
  scrapeRatings(response.data.podcasts, categoryTitle);
  return response.data.podcasts;
};

// getTopPodcastsByGenre(67, 1, "Podcasts");

const iTunesLink = async (iTunesId, category) => {
  console.log(iTunesId, "ITUNESID");
  if (!iTunesId) {
    return "https://podcasts.apple.com";
  }
  const response = await axios.get(
    `https://itunes.apple.com/lookup?id=${iTunesId}`
  );
  // console.log(
  //   response.data.results[0].trackViewUrl,
  //   "RESPONSE FOR ITUNESLINK 70"
  // );
  // const scrape = await scrapeRatings(
  //   response.data.results[0].trackViewUrl,
  //   category
  // );
  // console.log(
  //   response.data.results[0].collectionViewUrl,
  //   // response.data.results[0].trackViewUrl,
  //   "RESPONSE.DATA ITUNESLINK"
  // );
  if (response.data.results[0]?.collectionViewUrl) {
    return response.data.results[0].collectionViewUrl;
  } else {
    return "https://podcasts.apple.com";
  }
  // return response.data.results[0].collectionViewUrl;
  // url = ``;
  // request({ url }, (error, response, body) => {
  //   if (error || response.statusCode !== 200) {
  //     return res.status(500).json({ type: "error", message: err.message });
  //   }

  //   res.json(JSON.parse(body));
  // });
};

const scrapeRatings = async (array, category) => {
  // console.log(array, "array in scraperatings");
  console.log(category, "CATEGORY IN SCRAPERATINGS");
  // console.log(array.length, "length of array");
  // console.log("a");
  for (let i = 0; i < array.length; i++) {
    // console.log("b");
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
    // const podDescription = $(
    //   ".we-truncate.we-truncate--multi-line.we-truncate--interactive.we-truncate--full p"
    // );
    // titles.each((i, element) => {
    // title = productTitle.text().trim();
    // array[i]["title"] = title;
    // });
    // titles.each((i, element) => {
    //   const title = $(element).text().trim();
    //   object["title"] = title;
    // });

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
      // numberOfRatings = parseFloat(numberOfRatings) * 1000;
      array[i]["numberOfRatings"] = parseFloat(numberOfRatings) * 1000;
    } else {
      // numberOfRatings;
      array[i]["numberOfRatings"] = parseFloat(numberOfRatings) || 0;
    }
    // }
    // console.log(numberOfRatings);

    array[i]["itunes"] = array[i].itunes;
    array[i]["listenNotesGenre"] = category;
  }

  // try {
  // console.log(array, 'array at loop 122');
  // let findTitle = array[index].title;
  console.log("c");
  console.log(array, "223");
  saveToDatabase(array, category);
  // return array;
};

const saveToDatabase = (fullArray, category) => {
  // console.log(fullArray[0].rating, "FULLARRAY TO SAVE TO DB");
  for (let i = 0; i < fullArray.length; i++) {
    // console.log(fullArray[i], "FULLARRAY[I] SAVING TO DB");
    try {
      Rating.findOneAndUpdate(
        // $set: { rating: object.rating },

        { id: fullArray[i].id },
        {
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
        },
        { upsert: true },
        (err, res) => {
          if (err) throw err;
          // console.log("1 document updated");
        }
      ).lean();
      console.log(
        `${fullArray[i].title} added or updated to MONGODB with Rating ${fullArray[i].rating} and #Ratings ${fullArray[i].numberOfRatings}`
      );
    } catch (error) {
      console.log(error, "ERROR UPDATING DB");
    }
  }
  console.log(`${category} Category Updated and Added to DB`);
};

// if (list.length > 20) {
//   list = list.slice(list.length - 20);
// }
// let index = 0;
// for (let i = 0; i < list.length; i++) {
// console.log('157', list[i]);
// console.log('158', list.length);
// try {

// Rating.findOneAndUpdate(
//   // $set: { rating: object.rating },

//   { title: findTitle },
//   {
//     $set: {
//       rating: object.rating,
//       genre: object.genre,
//       listenNotesGenre: category,
//       itunes: list[i],
//       numberOfRatings: object.numberOfRatings,
//     },
//   },
//   { new: true },
//   (err, res) => {
//     if (err) throw err;
//     console.log("1 document updated");
//   }
// ).lean();

// console.log("in DB after update", object);
//     index++;
//     console.log(index, "index");
//   } catch (e) {
//     console.log("PROBLEM LATER", e);
//   }
// } catch (e) {
//   console.log("AND EVEN MORE LATER", e);
//   continue;
// }
// }

// console.log("ALL DONE SCANNING");
// };

// // Rating.aggregate([
// //   {
// //     $group: {
// //       _id: { title: "$title", id: "$id" },
// //       uniqueIds: { $addToSet: "$_id" },
// //       count: { $sum: 1 },
// //       //   rating: { $ifNull: [""]}
// //       //   rating: { $addToSet: "$rating" },
// //     },
// //   },
// //   {
// //     $match: {
// //       count: { $gt: 1 },
// //       //   rating: {},
// //       //   $rating: {
// //       //     $exists: true,
// //       //     $ne: null,
// //       //   },
// //       //   rating: { $gt: 0 },
// //     },
// //   },
// // ]).then((data) => {
// //   for (let item of data) {
// //     console.log(item, "ITEM");
// //     let array = item.uniqueIds.slice(1);
// //     for (let element of array) {
// //       console.log(typeof element, JSON.stringify(element));

// //       //Remove duplicate items from the database

// //       Rating.deleteOne(
// //         { _id: new mongodb.ObjectID(`${element}`) },
// //         function (err, results) {
// //           if (err) {
// //             console.log("failed");
// //             throw err;
// //           }
// //           console.log("success");
// //         }
// //       );

// //       //   Rating.createIndexes({ title: 1 }, { unique: true, sparse: true });
// //     }
// //   }
// // });

// const listenNotesData = async (array, category) => {
//   // console.log(array, "ARRAY TO SEE");
//   for (let i = 0; i < array.length; i++) {
//     if (
//       !(await Rating.findOne({
//         id: array[i].id,
//       }).countDocuments()) > 0
//     ) {
//       try {
//         const newRating = new Rating({
//           title: array[i].title,
//           id: array[i].id,
//           rating: "",
//           image: array[i].image,
//           numberOfRatings: "",
//           genre: "",
//           listenNotesGenre: category,
//           description: array[i].description,
//           website: array[i].website,
//           itunes: "",
//           itunesid: array[i].itunes_id,
//           listennotesurl: array[i].listennotes_url,
//         });
//         newRating.save();
//       } catch (error) {
//         console.log(error, "ERROR SAVING TO DB");
//       }
//     }
//     // try {
//     // const newRating = new Rating({
//     //   title: array[i].title,
//     //   id: array[i].id,
//     //   rating: "",
//     //   image: array[i].image,
//     //   numberOfRatings: "",
//     //   genre: "",
//     //   listenNotesGenre: category,
//     //   description: array[i].description,
//     //   website: array[i].website,
//     //   itunes: "",
//     //   itunesid: array[i].itunes_id,
//     //   listennotesurl: array[i].listennotes_url,
//     // });
//     // const result =
//     //   (await Rating.findOne({
//     //     id: array[i].id,
//     //   }).count()) > 0;
//     // console.log(result, "RESULT WORK?");
//     // if (
//     //   (await Rating.findOne({
//     //     id: array[i].id,
//     //   }).count()) > 0
//     // ) {
//     //   console.log("this item exists!!");
//     // } else {
//     //   ("this item doesnt exist");
//     // }
//     // console.log(
//     // Rating.find({ title: array[i].title })._conditions,
//     // const result = Rating.find({ title: array[i].title }).count();
//     // const result =
//     //   (await Rating.find({
//     //     id: { $in: ["664a86ade5bf497d93ca7e27f13729d3"] },
//     //   }).count()) > 0;
//     // console.log(array[i].title, "array title", typeof array[i].title);
//     // console.log(result, "RESULT WORK?");
//     // if (Rating.find({ title: { $in: [array[i].title] } }).count() > 0) {
//     // console.log("object found DB");
//     // } else {
//     //   console.log("item not found");
//     // }
//     // Rating.find({ title: array[i].title }).limit(1).size(),

//     // "RATING.FIND TITLE"
//     // );
//     // console.log("a");

//     // console.log("b");
//     // if (!Rating.find({ title: array[i].title })) {
//     //   console.log(`${array[i].title} ******not found!*********`);
//     //   newRating.save();
//     //   console.log("Item Added");
//     // }
//     // try {
//     // } catch (error) {
//     //   console.log("PROBLEM", error);
//     // }

//     // console.log('in DB after update', array, 'is this it?');
//     // } catch (e) {
//     //   console.log("PROBLEM LATER", e);
//     // }
//   }
//   // update();
// };
// ////////////////

// const getTopPodcastsByGenre = async (genreId, page, categoryTitle) => {
//   // console.log(page);
//   // if (page === 1) {
//   //   document.getElementById("left-arrow").style.visibility = "hidden";
//   // }
//   // await axios
//   // .then((response) => {
//   // console.log(genreId);

//   const getListenNotesData = async (genreId, page) => {
//     // const genreId = req.query.genreId;
//     // const page = req.query.page;
//     const response = await axios.get(
//       `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${genreId}&page=${page}&region=us&safe_mode=0`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-ListenAPI-Key": process.env.ListenAPI,
//         },
//         credentials: "same-origin",
//       }
//     );
//     console.log(response.data, "RESPONSE.DATA IN GETLISTENNOTESDATA");
//     return response.data;
//   };

//   const data = getListenNotesData(genreId, page);

//   // console.log(data, 'DATA IN AXIOS /SEARCHPODS/ 239');
//   // displayData(data);
//   console.log(data.podcasts, "data");

//   let newerArray = [];
//   const getItunesLink = async (data) => {
//     // DISPLAY ITUNES LINKS ON DEFAULT MAIN PAGE
//     // document.querySelectorAll('.div-style a.img-link').forEach((el, i) => {
//     // 	el.href = newerArray[i];
//     // });
//     let array = data.podcasts;
//     console.log(array, "ARRAY IN GETITUNESLINK FUNCTION 268");
//     for (let i = 0; i < array.length; i++) {
//       let iTunesId = array[i].itunes_id;
//       // console.log(iTunesId);
//       if (iTunesId) {
//         try {
//           newerArray.push(iTunesLink(iTunesId));
//         } catch (error) {
//           newerArray.push("https://podcasts.apple.com");
//         }

//         // await axios
//         //   .get("/podcast_data?id=" + iTunesId)
//         //   .then((response) => {
//         //     // console.log(response);
//         //     newerArray.push(response.data.results[0].trackViewUrl);
//         //     // document.querySelectorAll('.rating-container button.button.red.info a')[i].href = 'www.google.com';
//         //   })
//         // .catch((error) => {

//         // });
//       } else {
//         continue;
//       }
//     }
//     console.log(newerArray, "NEWERARRAY ITUNES");
//     return newerArray;
//   };

//   // SCRAPE DATA AND ADD TO DATABASE
//   // console.log('data going into scraping', data.name);
//   const scrape = async (categoryTitle) => {
//     let list = await getItunesLink(data);
//     listenNotesData(data.podcasts, categoryTitle);
//     // axios
//     //   .post("/podcasts", { pods: data.podcasts, category: categoryTitle })
//     //   .then((response) => {
//     //     console.log(response);
//     //   })
//     //   .catch((error) => {
//     //     console.log(error, "ERROR");
//     //   });
//     main(list, data.podcasts, categoryTitle);
//     // axios
//     //   .post("/update", {
//     //     urls: list,
//     //     pods: data.podcasts,
//     //     category: categoryTitle,
//     //   })
//     //   .then((response) => {
//     //     // console.log(response);
//     //   })
//     //   .catch((error) => {
//     //     console.log(error, "ERROR");
//     //   });
//   };
//   scrape(categoryTitle);
// };

const scrapePodcasts = (array, i = 111) => {
  console.log("testing");
  console.log("daily podcasts*****", array[i].name);
  //for (let i = 21; i < 22; i++) {
  let genreId = array[i].id;
  console.log(i, array[i].name, "scrape timeout");
  let categoryTitle = array[i].name;
  // let titleDisplay = document.querySelector(".title");
  // titleDisplay.textContent = `CATEGORY - ${array[i].name.toUpperCase()}`;
  // START OF PAGE TO SCRAPE
  let page = 1;
  getTopPodcastsByGenre(genreId, (page = 1), categoryTitle);

  setTimeout(() => {
    if (array.length > i && i !== array.length) scrapePodcasts(array, i + 1);
  }, 90000); // multiple i by 1000
  //}
};
scrapePodcasts(getCategories());
// console.log(getCategories(), "getcategories");

// // GET ITUNES LINK DATA

// /////////

// const main = async (list, array, category) => {
//   if (list.length > 20) {
//     list = list.slice(list.length - 20);
//   }
//   let index = 0;
//   for (let i = 0; i < list.length; i++) {
//     // console.log('157', list[i]);
//     // console.log('158', list.length);
//     try {
//       const html = await request.get(`${list[i]}`);
//       // // console.log(html);
//       const $ = await cheerio.load(html);
//       let object = {};
//       const titles = $(".product-header__title");
//       const ratings = $(".we-customer-ratings__averages__display");
//       const genre = $(".inline-list__item--bulleted");
//       const numberOfRatings = $("p.we-customer-ratings__count");
//       titles.each((i, element) => {
//         const title = $(element).text().trim();
//         object["title"] = title;
//       });

//       ratings.each((i, element) => {
//         const rating = $(element).text().trim();
//         // console.log(rating);
//         object["rating"] = parseFloat(rating);
//       });
//       genre.each((i, element) => {
//         const genre = $(element).text().trim();
//         // console.log(rating);
//         object["genre"] = genre;
//       });
//       numberOfRatings.each((j, element) => {
//         let numberOfRatings = $(element, j).text().split(" ")[0];
//         for (let i = 0; i < numberOfRatings.length; i++) {
//           if (numberOfRatings[i] === "K") {
//             numberOfRatings = parseFloat(numberOfRatings) * 1000;
//           } else {
//             numberOfRatings;
//           }
//         }
//         // console.log(numberOfRatings);
//         object["numberOfRatings"] = numberOfRatings;
//         object["itunes"] = list[i];
//         object["listenNotesGenre"] = category;
//       });

//       try {
//         // console.log(array, 'array at loop 122');
//         let findTitle = array[index].title;
//         console.log("223", object);
//         Rating.findOneAndUpdate(
//           // $set: { rating: object.rating },

//           { title: findTitle },
//           {
//             $set: {
//               rating: object.rating,
//               genre: object.genre,
//               listenNotesGenre: category,
//               itunes: list[i],
//               numberOfRatings: object.numberOfRatings,
//             },
//           },
//           { new: true },
//           (err, res) => {
//             if (err) throw err;
//             console.log("1 document updated");
//           }
//         ).lean();

//         // console.log("in DB after update", object);
//         index++;
//         console.log(index, "index");
//       } catch (e) {
//         console.log("PROBLEM LATER", e);
//       }
//     } catch (e) {
//       console.log("AND EVEN MORE LATER", e);
//       continue;
//     }
//   }

//   console.log("ALL DONE SCANNING");
// };

// app.get("/podcasts", async (req, res) => {
//   try {
//     const podcast = await Rating.find({});
//     res.send(podcast);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// // app.post("/podcasts", (req, res) => {

// //   res.send({ status: "ok" });
// // });

// // app.post("/update", (req, res) => {
// //   main(req.body.urls, req.body.pods, req.body.category);

// //   res.send({ status: "working" });
// // });

// app.listen(PORT, () => {
//   console.log("Server is up on port " + PORT);
// });

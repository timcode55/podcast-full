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
const fetch = require("node-fetch");
var ObjectId = require("mongodb").ObjectID;
var ObjectId = require("mongoose").Types.ObjectId;

// Load env vars
dotenv.config({ path: "./config.env" });

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
app.get("/podcast_data", (req, res) => {
  url = `https://itunes.apple.com/lookup?id=${req.query.id}`;
  request({ url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: err.message });
    }

    res.json(JSON.parse(body));
  });
});

Rating.aggregate([
  {
    $group: {
      _id: { title: "$title", id: "$id" },
      uniqueIds: { $addToSet: "$_id" },
      count: { $sum: 1 },
      //   rating: { $ifNull: [""]}
      //   rating: { $addToSet: "$rating" },
    },
  },
  {
    $match: {
      count: { $gt: 1 },
      //   rating: {},
      //   $rating: {
      //     $exists: true,
      //     $ne: null,
      //   },
      //   rating: { $gt: 0 },
    },
  },
]).then((data) => {
  for (let item of data) {
    console.log(item, "ITEM");
    let array = item.uniqueIds.slice(1);
    for (let element of array) {
      console.log(typeof element, JSON.stringify(element));

      //Remove duplicate items from the database

      Rating.deleteOne(
        { _id: new mongodb.ObjectID(`${element}`) },
        function (err, results) {
          if (err) {
            console.log("failed");
            throw err;
          }
          console.log("success");
        }
      );

      //   Rating.createIndexes({ title: 1 }, { unique: true, sparse: true });
    }
  }
});

const listenNotesData = (array, category) => {
  for (let i = 0; i < array.length; i++) {
    try {
      const newRating = new Rating({
        title: array[i].title,
        id: array[i].id,
        rating: "",
        image: array[i].image,
        numberOfRatings: "",
        genre: "",
        listenNotesGenre: category,
        description: array[i].description,
        website: array[i].website,
        itunes: "",
        itunesid: array[i].itunes_id,
        listennotesurl: array[i].listennotes_url,
      });
      console.log(
        Rating.find({ title: array[i].title })._conditions,
        "RATING.FIND TITLE"
      );
      newRating.save();
      // if (!Rating.find({ title: array[i].title })) {
      //   console.log(`${array[i].title} ******not found!*********`);
      //   newRating.save();
      //   console.log("Item Added");
      // }
      try {
      } catch (error) {
        console.log("PROBLEM", error);
      }

      // console.log('in DB after update', array, 'is this it?');
    } catch (e) {
      console.log("PROBLEM LATER", e);
    }
  }
  update();
};
const main = async (list, array, category) => {
  if (list.length > 20) {
    list = list.slice(list.length - 20);
  }
  let index = 0;
  for (let i = 0; i < list.length; i++) {
    // console.log('157', list[i]);
    // console.log('158', list.length);
    try {
      const html = await request.get(`${list[i]}`);
      // // console.log(html);
      const $ = await cheerio.load(html);
      let object = {};
      const titles = $(".product-header__title");
      const ratings = $(".we-customer-ratings__averages__display");
      const genre = $(".inline-list__item--bulleted");
      const numberOfRatings = $("p.we-customer-ratings__count");
      titles.each((i, element) => {
        const title = $(element).text().trim();
        object["title"] = title;
      });

      ratings.each((i, element) => {
        const rating = $(element).text().trim();
        // console.log(rating);
        object["rating"] = parseFloat(rating);
      });
      genre.each((i, element) => {
        const genre = $(element).text().trim();
        // console.log(rating);
        object["genre"] = genre;
      });
      numberOfRatings.each((j, element) => {
        let numberOfRatings = $(element, j).text().split(" ")[0];
        for (let i = 0; i < numberOfRatings.length; i++) {
          if (numberOfRatings[i] === "K") {
            numberOfRatings = parseFloat(numberOfRatings) * 1000;
          } else {
            numberOfRatings;
          }
        }
        // console.log(numberOfRatings);
        object["numberOfRatings"] = numberOfRatings;
        object["itunes"] = list[i];
        object["listenNotesGenre"] = category;
      });

      try {
        // console.log(array, 'array at loop 122');
        let findTitle = array[index].title;
        console.log("223", object);
        Rating.findOneAndUpdate(
          // $set: { rating: object.rating },

          { title: findTitle },
          {
            $set: {
              rating: object.rating,
              genre: object.genre,
              listenNotesGenre: category,
              itunes: list[i],
              numberOfRatings: object.numberOfRatings,
            },
          },
          { new: true },
          (err, res) => {
            if (err) throw err;
            console.log("1 document updated");
          }
        ).lean();

        // console.log("in DB after update", object);
        index++;
        console.log(index, "index");
      } catch (e) {
        console.log("PROBLEM LATER", e);
      }
    } catch (e) {
      console.log("AND EVEN MORE LATER", e);
      continue;
    }
  }

  console.log("ALL DONE SCANNING");
};

app.get("/podcasts", async (req, res) => {
  try {
    const podcast = await Rating.find({});
    res.send(podcast);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/searchPods/", async (req, res) => {
  const genreId = req.query.genreId;
  const page = req.query.page;
  url = `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${genreId}&page=${page}&region=us&safe_mode=0`;
  await request(
    {
      url,
      headers: {
        "Content-Type": "application/json",
        "X-ListenAPI-Key": process.env.ListenAPI,
      },
      credentials: "same-origin",
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: err.message });
      }
      res.json(JSON.parse(body));
    }
  );
});

app.post("/podcasts", (req, res) => {
  listenNotesData(req.body.pods, req.body.category);
  res.send({ status: "ok" });
});

const update = () => {
  app.post("/update", (req, res) => {
    main(req.body.urls, req.body.pods, req.body.category);

    res.send({ status: "working" });
  });
};

app.listen(PORT, () => {
  console.log("Server is up on port " + PORT);
});

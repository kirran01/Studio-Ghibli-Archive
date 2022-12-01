const router = require("express").Router();
const axios = require("axios");
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const User = require("../models/User.model");
const WatchList = require("../models/Watchlist.model");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/auth.middleware");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

//GET HOME
router.get("/", (req, res) => {
  //localhost is NOT SECURE, so when fetching from localhost, never include "s" in 'http'
  fetch("http://localhost:3001/films")
    .then((apiRes) => apiRes.json())
    .then((json) => {
      res.render("home.hbs", { movieArr: json });
    })
    .catch((err) => res.send(err));
});


//GET WATCHLIST
router.get("/watchlist", isLoggedIn, (req, res) => {
  WatchList.find({ owner: req.session.user._id })
    .then((watchlistArr) => {
      res.render("watchlist.hbs", { watchlistArr });
    })
    .catch((err) => {
      res.send(err);
    });
});

//GET SHOW
router.get("/show/:id", (req, res) => {
  fetch(`http://localhost:3001/films/${req.params.id}`)
    .then((apiRes) => apiRes.json())
    .then((json) => {
      res.render("show.hbs", json);
    })
    .catch((err) => {
      res.send(err);
    });
});

//POST SHOW (ADD TO WATCHLIST)
//Can not duplicate the owner instead to avoid adding duplicates across accounts
//cant have same owner and title, but can duplicate title?
router.post("/show/:id", isLoggedIn, (req, res) => {
  WatchList.findOne({ showId: req.params.id, owner: req.session.user._id })
    .then((foundShow) => {
      console.log(
        req.session.user._id,
        "<---- current user / req.session.user._id"
      );
      if (foundShow) {
        console.log(foundShow, "<---foundshow");
        return Promise.reject("no");
      }
      return WatchList.create({
        showId: req.body.showId,
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        originalTitle: req.body.originalTitle,
        rating: req.body.rating,
        owner: req.session.user._id,
      });
    })
    .then((addedShow) => {
      console.log(addedShow);
      res.redirect("/watchlist");
    })
    .catch((err) => {
      console.log(err, "<---err");
      res.redirect("/watchlist");
    });
});

//POST RATING (UPDATE)
router.post("/watchlist/:id", (req, res) => {
  WatchList.findByIdAndUpdate(req.params.id, { rating: req.body.rating })
    .then(() => {
      res.redirect("/watchlist");
    })
    .catch((err) => {
      console.log(err);
    });
});

//DELETE SHOW
router.post("/watchlist/:id/delete", (req, res) => {
  WatchList.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/watchlist");
    })
    .catch((err) => {
      res.send(err);
    });
});

//LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

//GET SIGNUP
router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("signup.hbs");
});

//POST SIGNUP
router.post("/signup", (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.userName) {
    res.render("signup.hbs", { errorMessage: "Fields can not be blank..." });
    return;
  }
  User.create({
    email: req.body.email,
    userName: req.body.userName,
    password: bcryptjs.hashSync(req.body.password),
  })
    .then((newUser) => {
      res.redirect("/login");
    })
    .catch((err) => {
      res.send(err);
    });
});

//GET LOGIN
router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login.hbs");
});

//POST LOGIN
router.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.render("login.hbs", { errorMessage: "Fields can not be blank..." });
    return;
  }
  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (!foundUser) {
        res.render("login.hbs", {
          errorMessage: "That user does not exist...",
        });
        return;
      }
      const isValidPassword = bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      if (!isValidPassword) {
        res.render("login.hbs", { errorMessage: "Incorrect password..." });
        return;
      }
      // console.log(req.session.user._id, "reqsessuserid");
      req.session.user = foundUser;
      res.redirect("/");
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;

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
  fetch("https://ghibliapi.herokuapp.com/films")
    .then((apiRes) => apiRes.json())
    .then((json) => {
      // console.log(json[0]);
      res.render("home.hbs", { movieArr: json });
    })
    .catch((err) => res.send(err));
});

//GET WATCHLIST
router.get("/watchlist", isLoggedIn, (req, res) => {
  WatchList.find()
    .then((watchlistArr) => {
      res.render("watchlist.hbs", { watchlistArr });
    })
    .catch((err) => {
      res.send(err);
    });
});

//GET SHOW
router.get("/show/:id", (req, res) => {
  fetch(`https://ghibliapi.herokuapp.com/films/${req.params.id}`)
    .then((apiRes) => apiRes.json())
    .then((json) => {
      res.render("show.hbs", json);
    })
    .catch((err) => {
      res.send(err);
    });
});

//POST SHOW (ADD TO WATCHLIST)
router.post("/show/:id", isLoggedIn, (req, res) => {
  WatchList.create({
    showId: req.body.showId,
    imageUrl: req.body.imageUrl,
    title: req.body.title,
    originalTitle: req.body.originalTitle,
    rating: req.body.rating,
  })
    .then((addedShow) => {
      console.log(addedShow);
      res.redirect("/watchlist");
    })
    .catch((err) => {
      res.send(err);
    });
});

//POST RATING
router.post("/watchlist/:id", (req, res) => {
  WatchList.findByIdAndUpdate(req.params.id, { rating: req.body.rating })
    .then((x) => {
      console.log(x, "<--WL W RATING");
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
      res.redirect("/");
    })
    .catch((err) => {
      res.send(err);
    });
});

//GET EDIT SHOW
router.get("/watchlist/:id/edit", (req, res) => {
  res.render("edit-rating.hbs");
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
  if (!req.body.email || !req.body.password) {
    res.send("field(s) are blank");
    return;
  }
  User.create({
    email: req.body.email,
    userName: req.body.userName,
    password: bcryptjs.hashSync(req.body.password),
  })
    .then((newUser) => {
      console.log(newUser, "<-- new user");
      res.redirect("/");
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
    res.send("field(s) are blank");
    return;
  }
  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (!foundUser) {
        res.send("user does not exist");
        return;
      }
      const isValidPassword = bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      if (!isValidPassword) {
        res.send("password incorrect");
        return;
      }
      //   session is for cookies
      console.log(foundUser, "<--foundUser");
      req.session.user = foundUser;
      // res.render("home.hbs", foundUser);
      res.redirect("/");
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;

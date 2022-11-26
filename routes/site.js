const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");

//GET HOME
router.get("/", (req, res) => {
  axios
    .get("https://favqs.com/api/qotd")
    .then((filmArr) => {
      console.log(filmArr.data, "<---");
      res.render("home.hbs");
    })
    .catch((err) => {
      res.send(err);
    });
});

//GET WATCHLIST
router.get("/watchlist", (req, res) => {
  res.render("watchlist.hbs");
});

//GET SIGNUP
router.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

//POST SIGNUP
router.post("/signup", (req, res) => {
  User.create({
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
  })
    .then((newUser) => {
      console.log(newUser);
      res.redirect("/")
    })
    .catch((err) => {
      res.send(err);
    });
});

//GET LOGIN
router.get("/login", (req, res) => {
  res.render("login.hbs");
});

module.exports = router;

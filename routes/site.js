const router = require("express").Router();
const axios = require("axios");
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const User = require("../models/User.model");

//GET HOME
router.get("/", (req, res) => {
  axios
    .get("https://favqs.com/api/qotd")
    .then((filmArr) => {
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
router.get("/login", (req, res) => {
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
      res.render("home.hbs", foundUser);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;

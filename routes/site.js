const router = require("express").Router();
const axios = require("axios");

//GET HOME
router.get("/", (req, res) => {
  axios
    .get("https://ghibliapi.herokuapp.com/films/58611129-2dbc-4a81-a72f-77ddfc1b1b49")
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
  res.redirect("/");
});

//GET LOGIN
router.get("/login", (req, res) => {
  res.render("login.hbs");
});

module.exports = router;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
let d = new Date();

require("./config/session.config")(app);
require("dotenv/config");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/public"));

//this method checks if there is a current sessinon and user, if true, send it to locals which
//can be accessed by handlebars
app.use((req, res, next) => {
  if(req.session.user){
    res.locals.user = req.session.user;
  }
  next()
})

const site = require("./routes/site");
app.use("/", site);




mongoose
  .connect(process.env.MONGO_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on 3000`);
});

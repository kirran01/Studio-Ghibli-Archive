const  express=require("express");
const app=express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");


require("./config/session.config")(app);
require("dotenv/config");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const site = require("./routes/site");
app.use("/", site);

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(express.static(__dirname + '/public'));



mongoose
  .connect(process.env.MONGO_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));


app.listen(3000, () => {
    console.log(`Server listening on 3000`);
  });
  
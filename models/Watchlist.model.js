const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchListSchema = new Schema({
  imageUrl: String,
  title: String,
  originalTitle: String,
  rating: Number,
});

const WatchList = mongoose.model("WatchList", watchListSchema);
module.exports = WatchList;

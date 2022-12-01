const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchListSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  imageUrl: String,
  title: String,
  originalTitle: String,
  showId: {
    type: String,
  },
  rating: Number,
});

const WatchList = mongoose.model("WatchList", watchListSchema);
module.exports = WatchList;

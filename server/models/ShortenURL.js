var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ShortenURL = new Schema({
  originalURL: { type: String, required: true },
  alias: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("shortenURL", ShortenURL);

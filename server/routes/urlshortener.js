var express = require("express");
const ShortenURL = require("../models/ShortenURL");
var crypto = require("crypto");
var router = express.Router();

router.get("/:alias", async (req, res, next) => {
  var alias = req.params.alias;
  var shortenURL = await ShortenURL.findOne({ alias: alias });
  if (!shortenURL) {
    res.status(400).json({
      message: "URL alias is not linked with another url",
    });
  }
  var originalURL = shortenURL.originalURL;
  res.redirect(originalURL);
});

router.post("/", async (req, res, next) => {
  var requestBody = req.body;
  if (!requestBody) {
    res.json({ message: "No json attached to request" });
  }
  var originalURL = requestBody.originalURL;
  var alias = requestBody.alias;
  if (!alias) {
    alias = crypto.randomBytes(4).toString("hex");
  }
  var newShortenURL = new ShortenURL({
    originalURL,
    alias,
  });
  try {
    await newShortenURL.save();
  } catch (e) {
    return next(e);
  }
  res.json({
    message: "Successfully created a shortened URL for " + originalURL,
    shortenURL: "/" + alias,
  });
});

module.exports = router;

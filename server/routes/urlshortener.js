var express = require("express");
const ShortenURL = require("../models/ShortenURL");
var crypto = require("crypto");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.json({
    message: "Successfully called the api in localhost:8080",
  });
});

router.get("/:alias", async (req, res, next) => {
  var alias = req.params.alias;
  try {
    var shortenURL = await ShortenURL.findOne({ alias: alias });
    if (!shortenURL) {
      return res.status(400).json({
        message: "URL alias is not linked with another url",
      });
    }
    var originalURL = shortenURL.originalURL;
    res.redirect(originalURL);
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  var requestBody = req.body;
  if (!requestBody.originalURL) {
    return res
      .status(400)
      .json({ message: 'Attached JSON has no "originalURL" property' });
  }
  var originalURL = requestBody.originalURL;
  if (!validURL(originalURL)) {
    return res.status(400).json({ message: "Invalid URL provided" });
  }
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
    if (e.code === 11000) {
      return res.status(400).json({ message: "Alias already taken" });
    }
    return next(e);
  }
  res.json({
    message: `http://localhost:8080/${alias} now links to ${originalURL}`,
    alias: alias,
  });
});

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

module.exports = router;

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
    return res.json({ message: "No json attached to request" });
  }
  var originalURL = requestBody.originalURL;
  if (!validURL(originalURL)) {
    return res.json({ message: "Invalid url provided" });
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
    message: "Successfully created a shortened URL for " + originalURL,
    shortenURL: "/" + alias,
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

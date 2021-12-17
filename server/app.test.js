const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const ShortenURL = require("./models/ShortenURL");
const app = express();

const urlShortenerRouter = require("./routes/urlshortener");

const initializeMongoServer = require("./config/mongoConfigTesting");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", urlShortenerRouter);

beforeAll(async () => {
  await initializeMongoServer();
});

describe("POST / database operations and request body validation", () => {
  test("POST / with just url returns successful json message and adds to database", async () => {
    const res = await request(app)
      .post("/")
      .expect("Content-Type", /json/)
      .expect(200)
      .send({ originalURL: "http://www.youtube.com/" });
    const regex =
      /http:\/\/localhost:8080\/........ now links to http:\/\/www.youtube.com\//;
    expect(res.body.message).toMatch(regex);

    var databaseEntry = await ShortenURL.find({
      originalURL: "http://www.youtube.com/",
      alias: res.body.alias,
    });

    expect(databaseEntry).not.toEqual([]);
  });

  test("POST / to new url and alias returns successful json message and adds to database", async () => {
    const res = await request(app)
      .post("/")
      .expect("Content-Type", /json/)
      .expect(200)
      .send({ originalURL: "http://www.google.com/", alias: "test1" });
    expect(res.body.message).toEqual(
      "http://localhost:8080/test1 now links to http://www.google.com/"
    );
    expect(res.body.alias).toEqual("test1");
    var databaseEntry = await ShortenURL.find({
      originalURL: "http://www.google.com/",
      alias: "test1",
    });

    expect(databaseEntry).not.toEqual([]);
  });

  test("POST / with existing alias returns a failure json", async () => {
    await request(app)
      .post("/")
      .expect("Content-Type", /json/)
      .expect(200)
      .send({ originalURL: "http://www.bing.com/", alias: "test2" });

    const res = await request(app)
      .post("/")
      .expect("Content-Type", /json/)
      .expect(400)
      .send({ originalURL: "http://www.yahoo.com/", alias: "test2" });

    expect(res.body.message).toEqual("Alias already taken");

    var databaseEntry = await ShortenURL.find({
      originalURL: "http://www.yahoo.com/",
      alias: "test2",
    });

    expect(databaseEntry).toEqual([]);
  });

  test("POST / with invalid url returns a failure json", async () => {
    const res = await request(app)
      .post("/")
      .expect("Content-Type", /json/)
      .expect(400)
      .send({ originalURL: "134" });

    expect(res.body.message).toEqual("Invalid URL provided");

    var databaseEntry = await ShortenURL.find({
      originalURL: "134",
    });

    expect(databaseEntry).toEqual([]);
  });

  test("POST / with empty body returns a failure json", async () => {
    const res = await request(app)
      .post("/")
      .expect("Content-Type", /json/)
      .expect(400)
      .send({});

    expect(res.body.message).toEqual(
      'Attached JSON has no "originalURL" property'
    );

    var databaseEntry = await ShortenURL.find({
      originalURL: "134",
    });

    expect(databaseEntry).toEqual([]);
  });
});

describe("GET / redirects", () => {
  test("GET / with random alias successfully redirect to associated url", async () => {
    const post = await request(app)
      .post("/")
      .expect("Content-Type", /json/)
      .expect(200)
      .send({ originalURL: "http://www.w3schools.com/" });

    const alias = post.body.alias;
    const res = await request(app)
      .get(`/${alias}`)
      .expect(302)
      .expect("Location", "http://www.w3schools.com/");
  });

  test("GET / with custom alias successfully redirect to associated url", async () => {
    const post = await request(app)
      .post("/")
      .expect("Content-Type", /json/)
      .expect(200)
      .send({ originalURL: "http://www.facebook.com/", alias: "facebook" });

    const res = await request(app)
      .get(`/facebook`)
      .expect(302)
      .expect("Location", "http://www.facebook.com/");
  });

  test("GET / with unknown alias sends an error JSON", async () => {
    const res = await request(app).get(`/adsfnw`).expect(400);

    expect(res.body.message).toEqual(
      "URL alias is not linked with another url"
    );
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

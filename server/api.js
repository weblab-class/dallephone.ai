/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Prompt = require("./models/prompt");
const Image = require("./models/image");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/prompt", (req, res) => {
  const prompt = new Prompt({
    original: req.body.original,
    creator: req.user._id,
    content: req.body.content,
  });
  prompt.save().then((prompt) => res.send(prompt));

  socketManager.getIo().emit("promptEntered", prompt);
});

router.post("/image", (req, res) => {
  const image = new Image({
    original: req.body.original,
    creator: req.user._id,
    content: req.body.content,
  });
  image.save().then((image) => res.send(image));
});

router.get("/prompt", (req, res) => {
  Prompt.find({original: req.query.original}).then((prompts) => {res.send(prompts)});
});

router.get("/image", (req, res) => {
  Image.find({original: req.query.original}).then((images) => res.send(images));
});


router.get("/openaikey", (req, res) => {
  res.send({ key: process.env.REACT_APP_OPENAI_API_KEY });
});

router.get("/activeUsers", (req, res) => {
  res.send({ activeUsers: socketManager.getAllConnectedUsers() });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

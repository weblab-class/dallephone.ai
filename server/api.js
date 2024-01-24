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
const GameId = require("./models/gameid");

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
    game_id: req.body.game_id,
  });
  prompt.save().then((prompt) => res.send(prompt));
});

router.post("/prompt/original", (req, res) => {
  const prompt = new Prompt({
    original: req.user._id,
    creator: req.user._id,
    content: req.body.content,
    game_id: req.body.game_id,
  });
  prompt.save().then((prompt) => res.send(prompt));
});

router.post("/image", (req, res) => {
  const image = new Image({
    original: req.body.original,
    creator: req.user._id,
    content: req.body.content,
    game_id: req.body.game_id,
  });
  image.save().then((image) => res.send(image));
});

router.get("/prompt/original", (req, res) => {
  Prompt.find({
    $and: [{ original: req.query.original }, { game_id: req.query.game_id }],
  }).then((prompts) => {
    res.send(prompts.sort((a, b) => a.time - b.time));
  });
});

router.get("/prompt/game", (req, res) => {
  // fetches all prompts with a given game_id
  Prompt.find({ game_id: req.query.game_id }).then((prompts) => {
    console.log("this log occurs at get(/prompt/game) api endpoint");
    res.send(prompts.sort((a, b) => a.time - b.time));
  });
});

router.get("/prompt/originalprompts", (req, res) => {
  // fetches all prompts that are original prompts in the game
  Prompt.find({
    $and: [{ game_id: req.query.game_id }, { $expr: { $eq: ["$original", "$creator"] } }],
  }).then((prompts) => {
    res.send(prompts.sort((a, b) => a.time - b.time));
  });
});

router.get("/image", (req, res) => {
  Image.find({ original: req.query.original }).then((images) =>
    res.send(images.sort((a, b) => a.time - b.time))
  );
});

router.get("/image/game", (req, res) => {
  Image.find({ game_id: req.query.game_id }).then((images) =>
    res.send(images.sort((a, b) => a.time - b.time))
  );
});

router.get("/openaikey", (req, res) => {
  res.send({ key: process.env.REACT_APP_OPENAI_API_KEY });
});

router.get("/activeUsers", (req, res) => {
  res.send(socketManager.getAllConnectedUsers());
});

//Update GameID of user
router.post("/updateGameId", (req, res) => {
  const userId = req.user._id; // Assuming you're getting the user's ID from the session
  const newGameId = req.body.game_id;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).send({ error: "Error finding user" });
    } else if (!user) {
      res.status(404).send({ error: "User not found" });
    } else {
      user.gameid = newGameId;
      user.save((err, updatedUser) => {
        if (err) {
          res.status(500).send({ error: "Error updating user" });
        } else {
          res.send(updatedUser);
        }
      });
    }
  });
});

//Generate new game code
const generateGameCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

//Create new game schematics
router.post("/createNewGame", async (req, res) => {
  try {
    let gameCode;
    let isUnique = false;
    while (!isUnique) {
      gameCode = generateGameCode();
      // Check if the gameCode is unique in your gameids collection
      const exists = await GameId.findOne({ code: gameCode });
      if (!exists) {
        isUnique = true;
      }
    }

    // Add the gameCode to the gameids collection and update the user's gameid
    // Assuming GameId is your model for the gameids collection
    const newGameId = new GameId({ code: gameCode, creator: req.user._id });
    await newGameId.save();

    // Update the user's gameid
    await User.findByIdAndUpdate(req.user._id, { gameid: gameCode });

    res.send({ gameCode });
  } catch (error) {
    console.error("Error creating new game:", error);
    res.status(500).send({ error: "Error creating new game" });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

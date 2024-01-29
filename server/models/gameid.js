/*
Defines Schema for GameID inputs
*/

const mongoose = require("mongoose");

const GameIdSchema = new mongoose.Schema({
  code: String, // 4-letter game code
  creator: String, // User id of creator
  gameStarted: Boolean // Whether or not the game has started
});

// compile model from schema
module.exports = mongoose.model("GameId", GameIdSchema);

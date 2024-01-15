/*
Defines Schema for prompt inputs

*/

const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema({
  original: String, // Original prompt id
  creator: String, // User id of creator
  content: String,
  image: String, // Refers to id of image corresponding to prompt
});

// compile model from schema
module.exports = mongoose.model("prompt", PromptSchema);
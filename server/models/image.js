/*
Defines Schema for image inputs
*/

const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  original: String, // Original prompt id
  creator: String, // User id of creator
  content: String,
});

// compile model from schema
module.exports = mongoose.model("image", ImageSchema);

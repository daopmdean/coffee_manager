const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: Number
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;

const mongoose = require("mongoose");
const Menu = require("../models/Menu");

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  description: String,
  order: String,
  delivered: {type: Boolean, default: false}
});

module.exports = mongoose.model("Order", orderSchema);

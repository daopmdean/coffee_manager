const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  description: String,
  order: String
});

module.exports = mongoose.model("Order", orderSchema);

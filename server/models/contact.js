const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  description: String
});

module.exports = mongoose.model("Contact", contactSchema);

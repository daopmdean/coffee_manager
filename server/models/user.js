const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalmongoose);

module.exports = mongoose.model("User", UserSchema);
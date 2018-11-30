const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const middleware = require("../middleware");

router.get("/contact", middleware.isLoggedInContact, (req, res) => {
  res.render("contact");
});

router.post("/contact", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var des = req.body.description;

  var item = {
    fullName: name,
    email: email,
    description: des
  };

  Contact.create(item, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("contactSuccess", "Your contact information has been submitted successfully");
      res.redirect("/menu");
    }
  });
});

module.exports = router;
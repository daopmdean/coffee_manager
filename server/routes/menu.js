const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const middleware = require("../middleware");

router.get("/menu", (req, res) => {
  Menu.find({}, (err, menuList) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { menu: menuList });
    }
  });
});

router.post("/menu", middleware.isLoggedIn, (req, res) => {
  var coffee = req.body.newcoffee;
  var url = req.body.image;
  var des = req.body.description;
  var price = req.body.price;

  var item = {
    name: coffee,
    image: url,
    description: des,
    price: price
  };

  Menu.create(item, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/menu");
    }
  });
});

router.get("/menu/new", middleware.isAdmin, (req, res) => {
  res.render("new");
});

router.get("/menu/:id", (req, res) => {
  Menu.findById(req.params.id, (err, foundItem) => {
    if (err) {
      res.redirect("/menu");
    } else {
      res.render("show", { item: foundItem });
    }
  });
});

module.exports = router;
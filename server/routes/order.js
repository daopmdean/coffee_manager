const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const Order = require("../models/order");
const middleware = require("../middleware");


router.get("/order", middleware.isLoggedInOrder, (req, res) => {
  Menu.find({}, (err, menuList) => {
    if (err) {
      console.log(err);
    } else {
      res.render("order", { menu: menuList });
    }
  });
});

router.post("/order", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var address = req.body.address;
  var phone = req.body.phone;
  var des = req.body.description;
  var orderP = req.body.order;

  var order = {
    name: name,
    address: address,
    phone: phone,
    description: des,
    order: orderP
  };

  Order.create(order, (err, item) => {
    if (err) {
      console.log(err); 
    } else {
      req.flash("orderSuccess", "Your order has been submitted, check it in your profile.");
      res.redirect("/menu");
    }
  });
});

module.exports = router;
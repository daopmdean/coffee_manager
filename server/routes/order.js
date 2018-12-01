const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const Order = require("../models/order");
const User = require("../models/user");
const middleware = require("../middleware");

router.get("/order", middleware.isLoggedInOrder, (req, res) => {
  // User.findById(req.params.id, (err, user) => {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     Menu.find({}, (err, menuList) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         res.render("order", { menu: menuList });
  //       }
  //     });
  //   }
  // });
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
  
  User.findById(req.params.id, (err, user) => {
    if(err) {
      console.log(err);
      res.redirect("/index");
    } else {
      Order.create(order, (err, item) => {
        if (err) {
          console.log(err); 
        } else {
          user.orders.push(item);
          user.save();
          req.flash("orderSuccess", "Your order has been submitted, check it in your profile.");
          res.redirect("/menu");
        }
      });
    }
  });
});

router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect("/menu");
    } else {
      res.redirect("/admin");
    }
  });
});

module.exports = router;
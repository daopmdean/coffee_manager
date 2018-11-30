const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Order = require("../models/order");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    // console.log(req.user);
  res.render("home");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
       if (err) {
           console.log(err);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, () => {
           res.redirect("/menu");
       });
    });
    
});

router.get("/login", (req, res) => {
   res.render("login"); 
});

router.get("/loginOrder", (req, res) => {
   res.render("loginOrder"); 
});

router.get("/loginContact", (req, res) => {
   res.render("loginContact"); 
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/menu",
    failureRedirect: "/login"
}), (req, res) => {
});

router.post("/loginOrder", passport.authenticate("local", {
    successRedirect: "/order",
    failureRedirect: "/login"
}), (req, res) => {
});

router.post("/loginContact", passport.authenticate("local", {
    successRedirect: "/contact",
    failureRedirect: "/login"
}), (req, res) => {
});

router.get("/logout", (req, res) => {
   req.logout();
   req.flash("logoutSuccess", "Log out successfully");
   res.redirect("/menu"); 
});

router.get("/user/:id", (req, res) => {
  User.findById(req.params.id).populate("orders").exec((err, foundUser) => {
    if(err) {
      res.redirect("/menu");
    }
    res.render("userInfo", { user: foundUser });
  });
});

router.post("/user/:id/order", middleware.isLoggedIn, (req, res) => {
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

router.get("/admin", middleware.isAdmin, (req, res) => {
    Order.find({}, (err, orderList) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin", { orders: orderList });
    }
  });
});

module.exports = router;
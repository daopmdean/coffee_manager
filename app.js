const express    = require("express");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
var app = express();
// mongodb://localhost:27017/coffee
const MONGODB_URL = "mongodb+srv://daopham:test123@learning-ublv7.mongodb.net/CoffeeManager?retryWrites=true";

mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

var menuSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: Number
});

var Menu = mongoose.model("Menu", menuSchema);

// Menu.create({
//     name: "Mocha",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqPRzZ6B7cd5lFBB6fv0_i0VCVTFchVgF2yqSWziNo00Eg49Bs0Q",
//     description: "Mix between Coffee and Chocolate",
//     price: 3.99
// }, (err, coffee) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(coffee);
//   }
// });


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/menu", (req, res) => {
  Menu.find({}, (err, menuList) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { menu: menuList });
    }
  });
  
});

app.get("/menu/new", (req, res) => {
  res.render("new");
});

app.get("/menu/:id", (req, res) => {
  Menu.findById(req.params.id, (err, foundItem) => {
    if (err) {
      res.redirect("/menu");
    } else {
      res.render("show", {item: foundItem});
    }
  });
});

app.post("/menu", (req, res) => {
  var coffee = req.body.newcoffee;
  var url = req.body.image;
  var item = { name: coffee, image: url };

  Menu.create(item, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/menu");
    }
  });
  
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log("Server running");
});

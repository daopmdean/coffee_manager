const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Menu = require("./models/Menu");

const app = express();
const port = process.env.PORT || 3000;

const MONGODB_URL =
  "mongodb+srv://daopham:test123@learning-ublv7.mongodb.net/CoffeeManager?retryWrites=true";
mongoose.connect(
  MONGODB_URL,
  { useNewUrlParser: true }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

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
      res.render("show", { item: foundItem });
    }
  });
});

app.post("/menu", (req, res) => {
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

if (process.env.IP) {
  app.listen(port, process.env.IP, () => {
    console.log("Server running on c9");
  });
} else {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

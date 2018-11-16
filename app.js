const express    = require("express");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
var app = express();

mongoose.connect('mongodb://localhost:27017/coffee', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

var menuSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Menu = mongoose.model("Menu", menuSchema);

// Menu.create({
//     name: "Brown coffee",
//     image: "https://farm2.staticflickr.com/1919/45595636631_d872389edc.jpg"
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
      res.render("menu", { menu: menuList });
    }
  });
  
});

app.get("/menu/new", (req, res) => {
  res.render("new");
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

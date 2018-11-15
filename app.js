var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var menuList = [
    { name: "Black coffee", image: "https://farm9.staticflickr.com/8452/7933826484_1f729289c8.jpg"},
    { name: "White coffee", image: "https://farm6.staticflickr.com/5260/5482639993_37b0d56c3e.jpg"},
    { name: "Brown coffee", image: "https://farm2.staticflickr.com/1919/45595636631_d872389edc.jpg"},
    { name: "Black coffee", image: "https://farm9.staticflickr.com/8452/7933826484_1f729289c8.jpg"},
    { name: "White coffee", image: "https://farm6.staticflickr.com/5260/5482639993_37b0d56c3e.jpg"},
    { name: "Brown coffee", image: "https://farm2.staticflickr.com/1919/45595636631_d872389edc.jpg"},
    { name: "Black coffee", image: "https://farm9.staticflickr.com/8452/7933826484_1f729289c8.jpg"},
    { name: "White coffee", image: "https://farm6.staticflickr.com/5260/5482639993_37b0d56c3e.jpg"},
    { name: "Brown coffee", image: "https://farm2.staticflickr.com/1919/45595636631_d872389edc.jpg"},
];

app.get("/", (req, res) => {
    // res.json({message: "Hello"})
    res.render("home");
});

app.get("/menu", (req, res) => {
   res.render("menu", {menu: menuList}); 
});

app.get("/menu/new", (req, res) => {
   res.render("new"); 
});

app.post("/menu", (req, res) => {
    var coffee = req.body.newcoffee;
    var url = req.body.image;
    var item = { name: coffee, image: url};
    
    menuList.push(item);
//   res.send("Post request");
    res.redirect("/menu"); 
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server running");
});
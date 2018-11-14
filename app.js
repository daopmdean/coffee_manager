var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var menuList = ["Black Coffee", "White Coffee", "Brown Coffee"];

app.get("/api/greeting", (req, res) => {
    const { name } = req.query;
    res.json({message: `Hi ${name}`})
})

app.get("/", (req, res) => {
    // res.json({message: "Hello"})
    res.render("home");
});

app.post("/addmenu", (req, res) => {
    var coffee = req.body.newcoffee;
    menuList.push(coffee);
//   res.send("Post request");
    res.redirect("/menu"); 
});

app.get("/menu", (req, res) => {
   res.render("menu", {menu: menuList}); 
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server running");
});
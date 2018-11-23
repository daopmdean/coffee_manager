const path = require("path"),
      express = require("express"),
      passport = require("passport"),
      User       = require("./models/user"),
      LocalStrategy = require("passport-local"),
      passportLocalmongoose = require("passport-local-mongoose"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Menu = require("./models/Menu");

const app = express();
const port = process.env.PORT || 3000;

const MONGODB_URL =
  "mongodb+srv://daopham:test123@learning-ublv7.mongodb.net/CoffeeManager?retryWrites=true";
mongoose.connect(
  MONGODB_URL,
  { useNewUrlParser: true }
);

app.use(require("express-session")({
    secret: "Which coffee is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

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

app.post("/menu", isLoggedIn, (req, res) => {
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

app.get("/menu/new", isLoggedIn, (req, res) => {
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

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
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

app.get("/login", (req, res) => {
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/menu",
    failureRedirect: "/login"
}), (req, res) => {
    
});

app.get("/logout", (req, res) => {
   req.logout();
   res.redirect("/menu"); 
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

if (process.env.IP) {
  app.listen(port, process.env.IP, () => {
    console.log("Server running on c9");
  });
} else {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

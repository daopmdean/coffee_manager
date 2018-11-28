const path = require("path"),
      express = require("express"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      passportLocalmongoose = require("passport-local-mongoose"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      User = require("./models/user"),
      Menu = require("./models/Menu"),
      Order = require("./models/order"),
      Contact = require("./models/contact");
      

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

app.get("/order", isLoggedInOrder, (req, res) => {
  Menu.find({}, (err, menuList) => {
    if (err) {
      console.log(err);
    } else {
      res.render("order", { menu: menuList });
    }
  });
});

app.post("/order", isLoggedIn, (req, res) => {
  var name = req.body.name;
  var address = req.body.address;
  var phone = req.body.phone;
  var des = req.body.description;
  var order = req.body.order;

  var order = {
    name: name,
    address: address,
    phone: phone,
    description: des,
    order: order
  };

  Order.create(order, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/menu");
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

app.get("/loginOrder", (req, res) => {
   res.render("loginOrder"); 
});

app.get("/loginContact", (req, res) => {
   res.render("loginContact"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/menu",
    failureRedirect: "/login"
}), (req, res) => {
});

app.post("/loginOrder", passport.authenticate("local", {
    successRedirect: "/order",
    failureRedirect: "/login"
}), (req, res) => {
});

app.post("/loginContact", passport.authenticate("local", {
    successRedirect: "/contact",
    failureRedirect: "/login"
}), (req, res) => {
});

app.get("/logout", (req, res) => {
   req.logout();
   res.redirect("/menu"); 
});

app.get("/contact", isLoggedInContact, (req, res) => {
  res.render("contact");
});

app.post("/contact", isLoggedIn, (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var des = req.body.description;

  var item = {
    fullName: name,
    email: email,
    description: des
  };

  Contact.create(item, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/menu");
    }
  });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function isLoggedInOrder(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/loginOrder");
}

function isLoggedInContact(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/loginContact");
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

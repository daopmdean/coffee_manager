const path                  = require("path"),
      express               = require("express"),
      passport              = require("passport"),
      flash                 = require("connect-flash"),
      LocalStrategy         = require("passport-local"),
      passportLocalmongoose = require("passport-local-mongoose"),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      User                  = require("./models/user"),
      Menu                  = require("./models/Menu"),
      Order                 = require("./models/order"),
      Contact               = require("./models/contact");
      
const menuRoutes    = require("./routes/menu");
const indexRoutes   = require("./routes/index");
const orderRoutes   = require("./routes/order");
const contactRoutes = require("./routes/contact");

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
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.logoutSuccess = req.flash("logoutSuccess");
  res.locals.orderSuccess = req.flash("orderSuccess");
  res.locals.contactSuccess = req.flash("contactSuccess");
  next();
});

app.use(menuRoutes);
app.use(indexRoutes);
app.use(orderRoutes);
app.use(contactRoutes);

// Order.create({
//   name: "How the rain fall",
//   address:"112d3sa",
//   phone:"12d3as12",
//   description:"d12sa1d3as",
//   order:"White coffee 2.99"  
// }, (err, post) => {
//     if (err) {
//     }
//     User.findOne({username: "alex"}, (err, foundUser) => {
//       if(err) {
//           console.log(err);
//       } 
//       foundUser.orders.push(post);
//       foundUser.save((err, data) => {
//           if (err) {
               
//           }
//           console.log(data);
//       });
//     });
// });

if (process.env.IP) {
  app.listen(port, process.env.IP, () => {
    console.log("Server running on c9");
  });
} else {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

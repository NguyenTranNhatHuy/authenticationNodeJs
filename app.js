var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);

var passport = require("passport");
var authenticate = require("./middleware/authenticate");
// const uploadRouter = require('./routes/uploadRouter');
// var dishRouter = require("./routes/dishRouter");
// var promotionRouter = require("./routes/promotionRoute");
// var leaderRouter = require("./routes/leaderRoute");
// var toppingRouter = require("./routes/toppingRouter");
// var youtubeRouter = require("./routes/youtubeRouter");
// var cakeRouter = require("./routes/cakeRouter");
var userRouter = require("./routes/userRouter");
var config = require('./models/config');
var app = express();
const mongoose = require("mongoose");
const quizRouter = require("./routes/quizRouter");
const questionRouter = require("./routes/questionRouter");
// const url = "mongodb://127.0.0.1:27017/ConFusion";
const url = config.mongoUrl;
const connect = mongoose.connect(url);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser("18102002"));

app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);


// app.use('/imageUpload', uploadRouter);
app.use(passport.initialize());
app.use(passport.session());

// function auth(req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error("You are not authenticated!");
//     err.status = 403;
//     next(err);
//   } else {
//     next();
//   }
// }

app.use("/users", userRouter);
// app.use(auth);

app.use("/quizzes", quizRouter);
app.use("/question", questionRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

connect.then(
  (db) => {
    console.log("Connected correctly to the server");
  },
  (err) => {
    console.log(err);
  }
);

module.exports = app;

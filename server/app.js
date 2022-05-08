/* eslint-disable no-undef */
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require( "express-session" );
const passport = require("passport");
const flash = require( "connect-flash" );
const MongoStore = require("connect-mongo")(session);
const Category = require("./models/category");

const app = express();
require("./config/passport");

const uri = process.env.MONGODB_URI || "mongodb://localhost/typicall-ecommerce";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MONGODB CONNECTED SUCCESSFULLY!");
});
//app configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use( cookieParser() );
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: connection,
    }),
    //session expires after 3 hours
    cookie: { maxAge: 60 * 1000 * 60 * 3 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//routes config
const indexRouter = require("./routes/index");
const productsRouter = require( "./routes/products" );
const usersRouter = require("./routes/user");

app.use( "/products", productsRouter );
app.use("/user", usersRouter);
app.use("/", indexRouter);

// global variables across routes
// some sort of cashing categories on browser locals
app.use(async (req, res, next) => {
  try {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    const categories = await Category.find({}).sort({ title: 1 }).exec();
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.log( `error: ${ error.message }` )
    res.redirect("/");
  }
} );

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
  res.json({ error: "error" });
});

var port = process.env.PORT || 5000;
app.set("port", port);
app.listen(port, () => {
  console.log("Server online...");
});

module.exports = app;

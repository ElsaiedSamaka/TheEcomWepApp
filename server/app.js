require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

// mongodb configuration
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
app.use(cookieParser());
//routes config
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
app.use("/", indexRouter);
app.use("/products", productsRouter);

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

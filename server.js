const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });
const morgan = require("morgan");
// const services=require('./services/controlcategory')
const dbconnection = require("./config/database");

const ApiError = require("./utils/ApiError");
const globalError = require("./middleware/globalerror");
const confirmrout = require("./Routes/index");

dbconnection();

// middleware

const app = express();

app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(compression());

// connect to DB
const PORT = process.env.PORT || 8000;
const listen = app.listen(PORT, () => {
  console.log(`server is runing at ${PORT}`);
});

confirmrout(app);

app.all("*", (req, res, next) => {
  // const err=new Error(`the url not found : ${req.originalUrl}`);
  // console.log(req.url);
  // console.log(req.originalUrl);
  // next(err.message);
  next(new ApiError(`the url not found : ${req.originalUrl}`, 400));
});

// global error to handle middle ware in the express
app.use(globalError);

// to handle the unhandled errors (out of the express)
process.on("unhandledRejection", () => {
  listen.close(() => {
    console.log("shutting down");
    process.exit(1);
  });
});
// console.log(Math.floor(100 + Math.random() * 900));
// console.log(Math.random());
// const num = 900000 * 0.23546547156807573;
// console.log(Math.floor(num + 100000));

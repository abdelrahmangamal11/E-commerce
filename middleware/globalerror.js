const ApiError = require("../utils/ApiError");

const error_At_development = (err, res) => {
  res.status(err.statuscode).json({
    error: err,
    status: err.status,
    message1234: err.message,
    stack: err.stack /*where the error occured*/,
  });
};

const error_At_production = (err, res) => {
  res.status(err.statuscode).json({
    status: err.status,
    message: err.message,
  });
};
const handlingTheinvalidJWT = () =>
  new ApiError("invalid token plz login again", 401);
const handlingTheExpiredJWT = () =>
  new ApiError("this token is expired plz login again", 401);
const globalError = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.status = err.status || "error1";

  if (process.env.NODE_ENV === "development") {
    error_At_development(err, res);
  } else {
    if (err.name === "TokenExpiredError") err = handlingTheinvalidJWT();
    if (err.name === "JsonWebTokenError") err = handlingTheExpiredJWT();
    error_At_production(err, res);
  }
};
module.exports = globalError;

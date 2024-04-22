const jwt = require("jsonwebtoken");

const creatToken = (UserId) =>
  jwt.sign({ UserId }, process.env.secure_JWTPrivatekey, {
    expiresIn: process.env.Expire_duration,
  });
module.exports = creatToken;

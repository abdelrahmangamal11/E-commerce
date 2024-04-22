const { validationResult } = require("express-validator");

const validationOfGetCategory =
  // 2-middleware to catch the error from the rules if exist
  (req, res, next) => {
    // find the validation error in the request and send it as a json
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    next();
  };
module.exports = { validationOfGetCategory };

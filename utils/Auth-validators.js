const { check, param, body } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  validationOfGetCategory,
} = require("../middleware/validatorMiddleware");
const usermodel = require("../model/UserModel");

const CreateUsersvalidation = [
  check("name")
    .notEmpty()
    .withMessage("plz insert the name")
    .isLength({ min: 3 })
    .withMessage("the name is too short")
    .isLength({ max: 32 })
    .withMessage("the name is too long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("the email is required")
    .isEmail()
    .withMessage("the email is not valid")
    .custom((val) =>
      usermodel.findOne({ email: val }).then((resault) => {
        if (resault) {
          return Promise.reject(new Error("the email is already exist"));
        }
      })
    ),

  check("role").optional(),

  check("profileImage").optional(),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("the password is to short"),

  check("confirmpassword")
    .notEmpty()
    .withMessage("the confirming required")
    .custom((password, { req }) => {
      if (req.body.password !== password) {
        throw new Error("the passwordConfirmation incorrect");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("the number should be eguption or saudian"),
  validationOfGetCategory,
];

const logInValidation = [
  check("email")
    .notEmpty()
    .withMessage("the email is required")
    .isEmail()
    .withMessage("the email is not valid"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("the password is to short"),
];
module.exports = {
  CreateUsersvalidation,
  logInValidation,
};

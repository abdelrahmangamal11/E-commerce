const { check, param, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcrypt");
const {
  validationOfGetCategory,
} = require("../middleware/validatorMiddleware");
const usermodel = require("../model/UserModel");
const ApiError = require("./ApiError");

const GetSpecificUserValidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

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

const changPasswordvalidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
  body("currentpassword")
    .notEmpty()
    .withMessage("the currentpassword is required"),
  body("password")
    .notEmpty()
    .withMessage("the password is required")
    .custom(async (value, { req }) => {
      const user = await usermodel.findById(req.params.id);

      const iscurrentPassword = await bcrypt.compare(
        req.body.currentpassword,
        user.password
      ); /*return a boolian*/
      if (!iscurrentPassword) {
        throw new Error("the current password is incorrect");
      }
      return true;
    }),
  body("passwordconfirmation")
    .notEmpty()
    .withMessage("the passwordconfirmation is required")
    .custom((val, { req }) => {
      if (req.body.password !== val) {
        throw new ApiError("the passwordconfirmation is incorrect");
      }
      return true;
    }),
  validationOfGetCategory,
];

const DeleteUsersvalidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const UpdateUsersvalidation = [
  param("id").isMongoId().withMessage("empty"),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validationOfGetCategory,
];

const updateMyData = [
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

  check("profileImage").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("the number should be eguption or saudian"),
  validationOfGetCategory,
];
module.exports = {
  GetSpecificUserValidation,
  CreateUsersvalidation,
  DeleteUsersvalidation,
  UpdateUsersvalidation,
  changPasswordvalidation,
  updateMyData,
};

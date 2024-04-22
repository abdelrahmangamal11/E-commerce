const { param, check } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  validationOfGetCategory,
} = require("../middleware/validatorMiddleware");

const GetCategoryValidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const CreateCategoryvalidation = [
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
  validationOfGetCategory,
];

const DeleteCategoryvalidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const UpdateCategoryvalidation = [
  param("id").isMongoId().withMessage("empty"),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(req.body.name);
    return true;
  }),
  validationOfGetCategory,
];

module.exports = {
  GetCategoryValidation,
  CreateCategoryvalidation,
  DeleteCategoryvalidation,
  UpdateCategoryvalidation,
};

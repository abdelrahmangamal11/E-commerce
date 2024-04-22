const { check, param } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  validationOfGetCategory,
} = require("../middleware/validatorMiddleware");

const GetSubCategoryValidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const CreateSubCategoryvalidation = [
  check("name")
    .notEmpty()
    .withMessage("plz insert the name")
    .isLength({ min: 2 })
    .withMessage("the name is too short")
    .isLength({ max: 32 })
    .withMessage("the name is too long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("Category")
    .notEmpty()
    .withMessage("u must insert category")
    .isMongoId()
    .withMessage("invalid category ID"),
  validationOfGetCategory,
];

const DeleteSubCategoryvalidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const UpdateSubCategoryvalidation = [
  param("id").isMongoId().withMessage("empty"),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validationOfGetCategory,
];

module.exports = {
  CreateSubCategoryvalidation,
  GetSubCategoryValidation,
  DeleteSubCategoryvalidation,
  UpdateSubCategoryvalidation,
};

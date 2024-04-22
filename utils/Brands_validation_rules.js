const { check, param, body } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  validationOfGetCategory,
} = require("../middleware/validatorMiddleware");

const GetSpecificBrandValidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const CreateBrandsvalidation = [
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

const DeleteBrandsvalidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const UpdateBrandsvalidation = [
  param("id").isMongoId().withMessage("empty"),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validationOfGetCategory,
];

module.exports = {
  GetSpecificBrandValidation,
  CreateBrandsvalidation,
  DeleteBrandsvalidation,
  UpdateBrandsvalidation,
};

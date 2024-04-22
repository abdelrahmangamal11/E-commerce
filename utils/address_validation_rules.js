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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("phone is not right"),
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

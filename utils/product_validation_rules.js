const { check, param } = require("express-validator");
const { default: slugify } = require("slugify");
const {
  validationOfGetCategory,
} = require("../middleware/validatorMiddleware");
const categorymodel = require("../model/categorymodel");
const subcategorymodel = require("../model/subCategorymodel");

const GetProductValidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const createproductsValidation = [
  check("title")
    .notEmpty()
    .withMessage("You should put a title")
    .isLength({ min: 3 })
    .withMessage("the title should be longer than 3 litters")
    .isLength({ max: 100 })
    .withMessage("the title should be shorter than 32 litters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isLength({ min: 3 })
    .withMessage("the description is too short")
    .isLength({ max: 1000 })
    .withMessage("the description is too long"),
  check("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("the quantity must be a number "),
  check("soldquantity")
    .optional()
    .isNumeric()
    .withMessage("the soldquantity is must be number"),
  check("imageCover").notEmpty().withMessage("coverimage is required"),
  check("images").optional().isArray().withMessage("images must be in array"),
  check("color").optional().isArray().withMessage("colors must be in array"),
  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("the price must be a number")
    .isLength({ max: 32 })
    .withMessage("the price is too large"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("must be a number")
    .toFloat()
    .custom((value, { req }) => {
      /*value is the priceAfter*/
      if (req.body.price <= value) {
        throw new Error("the priceAfter must be lower than the price ");
      }
      return true;
    }),
  // check("category").custom((value) =>
  //   categorymodel.findById(value).then((category) => {
  //     if (!category) {
  //       throw new Error(`the id (${value}) does not`);
  //     }
  //   })
  // ),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("must be mongo id")
    .custom((subcategoryid) =>
      subcategorymodel
        // $exists to find any id at the (subcategorymodel) and $in to find the (subcategoryid) اللى احنا مدخلينه
        .find({ _id: { $exists: true, $in: subcategoryid } })
        .then((result) => {
          // console.log(subcategoryid);
          // console.log(result);
          const repeated = new Set(subcategoryid);
          const newrepeated = [...repeated];
          console.log(newrepeated);
          if (result.length < 1 || result.length !== newrepeated.length) {
            throw new Error("this Sub categories doesnot exist");
          }
        })
    )
    .custom((value, { req }) =>
      subcategorymodel.find({ Category: req.body.category }).then((result) => {
        // console.log(result, "gghg");
        const subcategoryid = [];
        result.forEach((val) => {
          // console.log(e._id);
          // console.log(e._id.toString());
          subcategoryid.push(val._id.toString());
        });
        // if (!subcategoryid.includes(value)) {
        //   throw new Error("the category does not contain this subcategory Id");
        // }
        const checker = value.every((v) => subcategoryid.includes(v));
        // console.log(checker);
        if (!checker) {
          throw new Error("the category does not contain this subcategory Id");
        }
      })
    )
    .custom((val) => {
      const subcategoryid = new Set(val);
      if (subcategoryid.size !== val.length) {
        throw new Error("Subcategories contain duplicate elements.");
      }
      return true;
    }),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validationOfGetCategory,
];

const DeleteProductValidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const UpdateproductValidation = [
  param("id").isMongoId().withMessage("empty"),
  check("title").custom((value, { req }) => {
    req.body.slug = slugify(req.body.title);
    return true;
  }),
  validationOfGetCategory,
];
module.exports = {
  GetProductValidation,
  createproductsValidation,
  DeleteProductValidation,
  UpdateproductValidation,
};

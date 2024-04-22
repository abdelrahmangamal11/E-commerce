const { check, param, body } = require("express-validator");
const {
  validationOfGetCategory,
} = require("../middleware/validatorMiddleware");
const reviewsmodel = require("../model/reviewsmodel");

const GetSpecificReviewValidation = [
  param("id").isMongoId().withMessage("empty"),
  validationOfGetCategory,
];

const CreateReviewsvalidation = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("the rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("the rating should be between 1 and 5"),
  check("User").notEmpty().withMessage("the user is required"),
  check("Product")
    .notEmpty()
    .withMessage("the product is required")
    .custom((value, { req }) =>
      reviewsmodel
        .findOne({ User: req.user._id, Product: req.body.Product })
        .then((review) => {
          console.log(review, "theReview");
          if (review) {
            throw new Error("you already created a review");
          }
        })
    ),
  validationOfGetCategory,
];

const DeleteReviewsvalidation = [
  check("id")
    .isMongoId()
    .withMessage("empty")
    .custom((value, { req }) => {
      if (req.user.role === "user") {
        return reviewsmodel.findById(value).then((review) => {
          if (!review) {
            throw new Error("there is no a review");
          }
          if (review.User._id.toString() !== req.user._id.toString()) {
            throw new Error("you are not allowed to delete this review");
          }
        });
      }
      return true;
    }),
  validationOfGetCategory,
];

const UpdateReviewsvalidation = [
  param("id")
    .isMongoId()
    .withMessage("empty")
    .custom((value, { req }) =>
      reviewsmodel.findById(value).then((review) => {
        if (!review) {
          throw new Error("there is no a review");
        }
        if (review.User._id.toString() !== req.user._id.toString()) {
          // console.log(review.User === req.user._id);
          throw new Error("you are not allowed to change this review");
        }
      })
    ),
  validationOfGetCategory,
];

module.exports = {
  GetSpecificReviewValidation,
  CreateReviewsvalidation,
  DeleteReviewsvalidation,
  UpdateReviewsvalidation,
};

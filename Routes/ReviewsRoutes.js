const express = require("express");

const reviews = require("../services/control-Reviews");
const RULES = require("../utils/Reviews_validation_rules");
const Auth = require("../services/control_Auth");

const router = express.Router({ mergeParams: true });

//Nasted route

router
  .route("/")
  .get(reviews.reviewForOneProduct, reviews.getReviews)
  .post(
    Auth.protect,
    reviews.setReviewForSpecificproduct,
    RULES.CreateReviewsvalidation,
    Auth.onlyAllowed("user"),
    reviews.postReviews
  );
router
  .route("/:id")
  .get(reviews.getSpecificReview)
  .put(
    Auth.protect,
    RULES.UpdateReviewsvalidation,
    Auth.onlyAllowed("user"),
    reviews.updateReviews
  )
  .delete(
    Auth.protect,
    RULES.DeleteReviewsvalidation,
    Auth.onlyAllowed("admin", "manager", "user"),
    reviews.deletReviews
  );
module.exports = router;

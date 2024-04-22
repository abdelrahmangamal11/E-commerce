const reviewsmodel = require("../model/reviewsmodel");
const Handler = require("./Handlerfactories");

// nasted Rout to get reviews on specific product
const reviewForOneProduct = (req, res, next) => {
  let filter = {};
  if (req.params.productId) {
    filter = { Product: req.params.productId };
    req.filterobj = filter;
  }
  next();
};

// nasted Rout to Set review on specific product
const setReviewForSpecificproduct = (req, res, next) => {
  if (!req.body.Product) {
    req.body.Product = req.params.productId;
  }
  if (!req.body.User) {
    req.body.User = req.user._id;
  }
  next();
};

// to get reviews
// method get-request(/api/v1/Reviews)
// public
const getReviews = Handler.getAll(reviewsmodel);

// to get specific_review
// method get-request(/api/v1/Reviews/:id)
// public
const getSpecificReview = Handler.getOne(reviewsmodel);

// to add review
// method post-request(/api/v1/Reviews)
// privat/protect/user
const postReviews = Handler.createOne(reviewsmodel);

// to update specific_review
// method put-request(/api/v1/Reviews/:id)
// privat/protect/user
const updateReviews = Handler.updateOne(reviewsmodel);

// to delete specific_review
// method Delete-request(/api/v1/Reviews/:id)
// privat/protect/user,manager,admin
const deletReviews = Handler.deleteOne(reviewsmodel);

module.exports = {
  postReviews,
  getReviews,
  getSpecificReview,
  updateReviews,
  deletReviews,
  reviewForOneProduct,
  setReviewForSpecificproduct,
};

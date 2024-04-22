const express = require("express");
const wishlist = require("../services/control_Wishlist");
const RULES = require("../utils/Brands_validation_rules");
const Auth = require("../services/control_Auth");
const { route } = require("./BrandsRoutes");

const router = express.Router();

router
  .route("/")
  .get(Auth.protect, wishlist.getloggeduserwishlist)
  .post(Auth.protect, Auth.onlyAllowed("user"), wishlist.addProductToWishList);

router
  .route("/:id")
  .delete(
    Auth.protect,
    Auth.onlyAllowed("user"),
    wishlist.removeProductfromWishList
  );

module.exports = router;

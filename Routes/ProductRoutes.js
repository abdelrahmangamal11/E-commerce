const express = require("express");
const RULES = require("../utils/product_validation_rules");
const Productscontrolr = require("../services/productControll");
const Auth = require("../services/control_Auth");

const reviewroutes = require("./ReviewsRoutes");

const router = express.Router();
router.use("/:productId/reviews", reviewroutes);

router
  .route("/")
  .get(Productscontrolr.getproduct)
  .post(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    Productscontrolr.uploadsImage,
    Productscontrolr.resizeimage,
    RULES.createproductsValidation,
    Productscontrolr.postproduct
  );

router
  .route("/:id")
  .get(RULES.GetProductValidation, Productscontrolr.getSpecificproduct)
  .put(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    Productscontrolr.uploadsImage,
    Productscontrolr.resizeimage,
    RULES.UpdateproductValidation,
    Productscontrolr.updateproduct
  )
  .delete(
    Auth.protect,
    Auth.onlyAllowed("admin"),
    RULES.DeleteProductValidation,
    Productscontrolr.deletproduct
  );
module.exports = router;

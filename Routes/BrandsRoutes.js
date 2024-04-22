const express = require("express");
const Brands = require("../services/controlBrands");
const RULES = require("../utils/Brands_validation_rules");
const Auth = require("../services/control_Auth");

const router = express.Router();

router
  .route("/")
  .get(Brands.getBrands)
  .post(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    Brands.uploadbrandsimage,
    Brands.resizeImage,
    RULES.CreateBrandsvalidation,
    Brands.postBrands
  );
router
  .route("/:id")
  .get(RULES.GetSpecificBrandValidation, Brands.getSpecificBrand)
  .put(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    Brands.uploadbrandsimage,
    Brands.resizeImage,
    RULES.UpdateBrandsvalidation,
    Brands.updateBrands
  )
  .delete(
    Auth.protect,
    Auth.onlyAllowed("admin"),
    RULES.UpdateBrandsvalidation,
    Brands.deletBrands
  );
module.exports = router;

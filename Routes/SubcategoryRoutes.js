const express = require("express");
// mergparams: to access parameters from another routes
// we need to access the categoryid from category route
const router = express.Router({ mergeParams: true });
const RULES = require("../utils/Subcategory_validation_rules");
const Subcategorycontrol = require("../services/controlsubcategory");
const Auth = require("../services/control_Auth");

router
  .route("/")
  .get(
    Subcategorycontrol.getsubcategoriesforcategoryID,
    Subcategorycontrol.getSubcategory
  )
  .post(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    Subcategorycontrol.setsubcategorytocategoryID,
    RULES.CreateSubCategoryvalidation,
    Subcategorycontrol.postSubcategory
  );
router
  .route("/:id")
  .get(
    RULES.GetSubCategoryValidation,
    Subcategorycontrol.getSpecificSubcategory
  )
  .delete(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    RULES.DeleteSubCategoryvalidation,
    Subcategorycontrol.deletCategory
  )
  .put(
    Auth.protect,
    Auth.onlyAllowed("admin"),
    RULES.UpdateSubCategoryvalidation,
    Subcategorycontrol.updateCategory
  );
module.exports = router;

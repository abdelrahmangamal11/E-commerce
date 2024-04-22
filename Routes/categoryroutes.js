const express = require("express");

const router = express.Router();
const RULES = require("../utils/category_validation_rules");
// Routes
const categorycontrol = require("../services/controlcategory");
const subcategoryroutes = require("./SubcategoryRoutes");
const Auth = require("../services/control_Auth");

router.use(
  "/:Categoryid/subcategories",
  subcategoryroutes
); /*(subcategoryroutes)اول ما يكتب الراوت دا(/:categoryid/subcategories) بيروح للفايل دا*/
router
  .route("/")
  .get(Auth.protect, categorycontrol.getcategory)

  .post(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    categorycontrol.uploadcategoryimage,
    categorycontrol.resizeImage,
    RULES.CreateCategoryvalidation,
    categorycontrol.postcategory
  );

router
  .route("/:id")
  // 1- the rules
  .get(RULES.GetCategoryValidation, categorycontrol.getSpecificcategory)
  .put(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    categorycontrol.uploadcategoryimage,
    categorycontrol.resizeImage,
    RULES.UpdateCategoryvalidation,
    categorycontrol.updateCategory
  )
  .delete(
    Auth.protect,
    Auth.onlyAllowed("admin"),
    RULES.DeleteCategoryvalidation,
    categorycontrol.deletCategory
  );
// router.post('/',categorycontrol.postcategory)
// // app.get('/',)
// router.get('/',categorycontrol.getcategory)
module.exports = router;

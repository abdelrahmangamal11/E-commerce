const express = require("express");
const cart = require("../services/control_Cart");
const Auth = require("../services/control_Auth");

const router = express.Router();
router.use(Auth.protect, Auth.onlyAllowed("user"));
router.route("/").post(cart.AddproductTocart).get(cart.getloggedusercart);
router.put("/applyCoupon", cart.applycoupon);
router
  .route("/:id")
  .delete(cart.removeproductfromcart)
  .put(cart.updatycartitemquantity);

router.delete("/", cart.removeallproductfromcart);

module.exports = router;

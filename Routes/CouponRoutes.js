const express = require("express");
const coupons = require("../services/controlCoupons");
const Auth = require("../services/control_Auth");

const router = express.Router();

router
  .route("/")
  .get(Auth.protect, Auth.onlyAllowed("manager", "admin"), coupons.getcoupons)
  .post(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    coupons.postcoupons
  );
router
  .route("/:id")
  .get(coupons.getSpecificcoupon)
  .put(
    Auth.protect,
    Auth.onlyAllowed("manager", "admin"),
    coupons.updatecoupons
  )
  .delete(
    Auth.protect,
    Auth.onlyAllowed("admin", "manager"),
    coupons.deletcoupons
  );
module.exports = router;

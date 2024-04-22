const express = require("express");
const order = require("../services/control_order");
const Auth = require("../services/control_Auth");

const router = express.Router();
router.use(Auth.protect);
router
  .route("/")
  .get(
    Auth.onlyAllowed("user", "manager", "admine"),
    order.filterforuser,
    order.getorders
  );
router
  .route("/:cartId")
  .post(Auth.onlyAllowed("user", "manager"), order.creatcashorder);

router.put(
  "/:orderId/paid",
  Auth.onlyAllowed("admin", "manager"),
  order.updateispaid
);
router.put(
  "/:orderId/delivered",
  Auth.onlyAllowed("admin", "manager"),
  order.updatedelivered
);
router.get(
  "/checkout-session/:cartId",
  Auth.onlyAllowed("user"),
  order.checksession
);
module.exports = router;

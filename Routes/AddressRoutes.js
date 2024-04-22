const express = require("express");
const address = require("../services/control_Adress");
const RULES = require("../utils/address_validation_rules");
const Auth = require("../services/control_Auth");

const router = express.Router();

router
  .route("/")
  .get(Auth.protect, address.getAddress)
  .post(
    Auth.protect,
    Auth.onlyAllowed("user"),
    RULES.CreateBrandsvalidation,
    address.addAdress
  );

router
  .route("/:id")
  .delete(Auth.protect, Auth.onlyAllowed("user"), address.removeAddress);

module.exports = router;

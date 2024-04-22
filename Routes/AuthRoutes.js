const express = require("express");
const Auth = require("../services/control_Auth");
const RULES = require("../utils/Auth-validators");

const router = express.Router();
router.route("/signUp").post(RULES.CreateUsersvalidation, Auth.signUp);
router.route("/login").post(RULES.logInValidation, Auth.signIn);
router.route("/forgetpassword").post(Auth.forgetPassword);
router.route("/codevalidation").post(Auth.resetCodeValidation);
router.route("/resetpassword").put(Auth.resetpassword);
module.exports = router;

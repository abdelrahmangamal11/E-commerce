const express = require("express");
const Users = require("../services/controlUser");
const RULES = require("../utils/Users-valedationRules");
const Auth = require("../services/control_Auth");

const router = express.Router();

router.use(Auth.protect);

router.get("/getme", Users.getloggeduserdata, Users.getSpecificUsers);
router.put("/changepassword", Users.changemypassword);
router.put("/updatemydata", RULES.updateMyData, Users.updateMyData);
router.delete("/deactivateMyuser", Users.deletUsers);

// admin
router.use(Auth.onlyAllowed("admin"));
router.put(
  "/changepassword/:id",
  RULES.changPasswordvalidation,
  Users.changpassword
);

router
  .route("/")
  .get(Users.getUsers)
  .post(
    Users.uploadUsersimage,
    Users.resizeImage,
    RULES.CreateUsersvalidation,
    Users.postUsers
  );

router
  .route("/:id")
  .get(RULES.GetSpecificUserValidation, Users.getSpecificUsers)

  .put(
    Users.uploadUsersimage,
    Users.resizeImage,
    RULES.UpdateUsersvalidation,
    Users.updateUsers
  );

module.exports = router;

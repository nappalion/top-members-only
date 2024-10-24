const express = require("express");
const userController = require("../controllers/user-controller");
const passport = require("passport");

const router = express.Router();

router.get("/", userController.signupGet);
router.get("/signup", userController.signupGet);
router.post("/signup", userController.signupPost);
router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);
router.get("/login-failed", userController.loginFailedGet);
router.get("/logout", userController.logoutGet);

router.get("/confirm-member", userController.confirmMemberGet);
router.post("/confirm-member", userController.confirmMemberPost);
router.get("/confirm-admin", userController.confirmAdminGet);
router.post("/confirm-admin", userController.confirmAdminPost);

module.exports = router;

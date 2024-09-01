const express = require("express");
const router = express.Router();
const authController = require("../controller/register");
const loginController = require("../controller/login");
const logoutUser = require("../controller/logout");
const verifyJWT = require("../middleware/verifyJWT");
const { resetPassword } = require("../controller/resetPassword");

router.post("/reset-password", resetPassword);
router.post("/register", authController.registerUser);
router.post("/login", loginController.loginUser);
router.post("/logout", verifyJWT, logoutUser);

module.exports = router;

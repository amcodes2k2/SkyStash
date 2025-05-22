const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/verifyJWT.js");

const signup = require("../controllers/signup.js");
router.post("/signup", signup);

const login = require("../controllers/login.js");
router.post("/login", login);

const logout = require("../controllers/logout.js");
router.get("/logout", verifyJWT, logout);

const refreshAccessToken = require("../controllers/refreshAccessToken.js");
router.get("/refresh-access-token", refreshAccessToken);

const resetPassword = require("../controllers/resetPassword.js");
router.post("/reset-password", resetPassword);

const sendOTP = require("../controllers/sendOTP.js");
router.post("/send-OTP", sendOTP);

const verifyOTP = require("../controllers/verifyOTP.js");
router.post("/verify-OTP", verifyOTP);

module.exports = router;
const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  allUser,
  updatePassword,
  sendOTP,
  verifyOTP,
} = require("../controllers/userControlers");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", validateToken, verifyOTP);
router.post("/update-password", validateToken, updatePassword);

router.get("/alluser", allUser);

router.get("/current", validateToken, currentUser);

module.exports = router;

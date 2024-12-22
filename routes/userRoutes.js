const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  allUser,
} = require("../controllers/userControlers");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/alluser", allUser);

router.get("/current", validateToken, currentUser);

module.exports = router;

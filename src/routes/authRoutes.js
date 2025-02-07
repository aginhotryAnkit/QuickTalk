const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController.js");

router.get("/register", registerUser);
router.get("/login", loginUser);

module.exports = router;
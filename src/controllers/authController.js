const User = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

//register request user schema for validation
const userValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

//login request user schema for validation
const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function registerUser(req, res) {
  try {
    const { error } = userValidation.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    // Create a new user
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ success: false, error: "Password does not match" });
    }

    //encrypt_password using brypt
    let salt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(password, salt);

    let userResponse = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
    });

    // res.render("/login");
    // res.redirect('http://localhost:3002/login');
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    // Validate input
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res
        .status(402)
        .json({ success: false, error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if user exists
    const searchUser = await User.findOne({ email: email });
    if (!searchUser) {
      // ❗ Fixed: Used `!searchUser` instead of `searchUser`
      return res.status(400).json({ success: false, error: "User not exists" });
    }

    // Compare password
    const valid = bcrypt.compareSync(password, searchUser.password);
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid password" });
    }

    // Generate JWT token
    let jwtToken = await jwt.sign(
      {
        id: searchUser._id,
        email: searchUser.email,
        firstName: searchUser.firstName,
        lastName: searchUser.lastName,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );

    // Send success response
    return res.status(201).json({
      success: true,
      message: "User logged in successfully",
      token: jwtToken,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

module.exports = { registerUser, loginUser };

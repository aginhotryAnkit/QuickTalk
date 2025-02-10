const User = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require('joi');


const userValidation = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(), 
    email: Joi.string().email().required(),
    password:Joi.string().min(8).max(20).required(),
    confirmPassword:Joi.string().valid(Joi.ref('password')).required()
});

async function registerUser(req, res) {
  try {
    const { error } = userValidation.validate(req.body);

    if (error) {
        return res.status(400).json({ success:false, error: error.details[0].message });
    }

      // Create a new user
    const {firstName, lastName, email, password, confirmPassword} = req.body;

    if(password!==confirmPassword){
        res.status(400).json({success:false, error: "Password does not match"});
    }

    //encrypt_password using brypt
    let salt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(password, salt);

    let userResponse = await User.create({
        firstName: firstName,
        lastName: lastName, 
        email : email,
        password: hashPassword
    });

    res.status(201).json({ success: true, message: "User registered successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: "Server error", error: error.message });
  }
}

function loginUser(req, res) {
  // Implement login logic here
}

module.exports = { registerUser, loginUser };

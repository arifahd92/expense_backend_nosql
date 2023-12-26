const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const secretKey = process.env.JWT_TOKEN;

const generateToken = (data) => {
  try {
    console.log("data for generating token", data._id);
    const id = data._id;
    const email = data.email;
    const token = jwt.sign({ id, email, premium: false }, secretKey, {
      expiresIn: "112h",
    });
    return token;
  } catch (error) {
    console.log(error.message);
  }
};

const signup = async (req, res) => {
  try {
    console.log("signup user");
    console.log(req.body);
    const { name, email, password } = req.body;
    if (password.trim().length < 6) {
      return res
        .status(422)
        .json({ error: "Password must be at least 6 characters long" });
    }
    // Create the user with the hashed password
    const user = new User({
      name,
      email,
      password,
    });

    // Hash the password
    user.password = await bcrypt.hash(password, saltRounds);

    await user.save();

    const token = generateToken(user);
    res.json({
      message: "Success",
      token,
      id: user._id,
      premium: user.premium,
    });
  } catch (error) {
    console.error(error.name);

    if (error.name === "ValidationError") {
      // Handle validation errors
      return res.status(422).json({ error: error.message });
    }

    if (error.name === "MongoServerError") {
      // Handle unique constraint violation (duplicate key)
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { signup };

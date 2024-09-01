const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();

const secretKey = process.env.JWT_TOKEN;

exports.loginUser = async (req, res) => {
  try {
    console.log("JWT Secret Key:", secretKey);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });

    res.status(200).json({
      auth: true,
      token: token,
      message: "User logged in",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

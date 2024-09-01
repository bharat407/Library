const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!validator.isEmail(email) || !email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({
      message: "User Registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Do Not Match",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Email is Invalid",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { email },
      {
        password: encryptedPassword,
        confirmPassword: encryptedPassword,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error in Updating the Password",
      error: error.message,
    });
  }
};

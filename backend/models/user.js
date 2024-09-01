const mongoose = require("mongoose");

const Login = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  confirmPassword: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Login", Login);

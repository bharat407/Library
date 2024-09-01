const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.JWT_TOKEN;

const verifyJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid or expired" });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyJWT;

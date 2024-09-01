const logoutUser = (req, res) => {
  const token = req.header("Authorization");
  if (token) {
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
};

module.exports = logoutUser;

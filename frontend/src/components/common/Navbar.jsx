import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleLogo = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogo}>
          Library Management
        </div>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            Home
          </Link>
          <Link to="/displaysubject" className="nav-link">
            Subjects
          </Link>
          <Link to="/displaybooks" className="nav-link">
            Books
          </Link>
          <Link to="/displayauthors" className="nav-link">
            Authors
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

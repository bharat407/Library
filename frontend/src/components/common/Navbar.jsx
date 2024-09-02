import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleLogo = () => {
    navigate("/dashboard");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogo}>
          Library Management
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </div>
        <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
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

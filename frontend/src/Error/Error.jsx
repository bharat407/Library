import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="error-container">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <a href="/" className="home-link">
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;

/* eslint-disable no-undef */
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Reset.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [cnfPassword, setPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTimeout(() => {
            navigate("/");
            toast.success("Pls Login", {
              duration: 3000,
            });
          }, 2000);
          toast.success("Password Reset Successful");
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Email is not Registered");
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("An error occurred during Password Reset.");
    }
  };

  return (
    <div className="reset-container">
      <div className="heading">Reset Password</div>
      <div className="formreset-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Change Password</label>
            <div className="password-input-container">
              <input
                type={cnfPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setPassword(!cnfPassword)}
              >
                {cnfPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <a href="/" className="login">
            <span>
              <FaArrowLeft size={15} />
            </span>{" "}
            <span className="login-text">Login</span>
          </a>
          <div className="button">
            <button type="submit" className="button button-primary">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

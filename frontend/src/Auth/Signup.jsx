import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [cnfPassword, setPassword] = useState(false);
  const navigate = useNavigate();
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
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();
      console.log(response.status, data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          navigate("/");
          toast.success("Pls Login", {
            duration: 3000,
          });
        }, 2000);
        toast.success("Registration Success");
      } else {
        toast.error(
          data.message || "Registration failed. Please check your input."
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/");
    toast.success("Please Login");
  };

  return (
    <div className="login-container">
      <div className="heading">Registration Page</div>
      <div className="form-container">
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
            <label htmlFor="password">Password</label>
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
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className="btn btn-secondary"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;

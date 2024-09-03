import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
          toast.success("Login Success");
        } else {
          toast.error("Failed to retrieve token.");
        }
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Authentication failed. Check your credentials."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/register");
    toast.success("Please Register");
  };

  return (
    <div className="loginPageContainer">
      <div className="loginHeading">Login Page</div>
      <div className="loginFormContainer">
        <form onSubmit={handleSubmit}>
          <div className="loginFormGroup">
            <label htmlFor="email" className="loginLabel">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="loginEmailInput"
              required
            />
          </div>
          <div className="loginFormGroup">
            <label htmlFor="password" className="loginLabel">
              Password
            </label>
            <div className="passwordInputContainer">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="loginPasswordInput"
                required
              />
              <button
                type="button"
                className="passwordToggleButton"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <a href="/reset-password" className="forgotPasswordLink">
            Forgot your password?
          </a>
          <div className="buttonGroup">
            <button type="submit" className="loginButton loginButtonPrimary">
              LOG IN
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="loginButton loginButtonSecondary"
            >
              REGISTER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

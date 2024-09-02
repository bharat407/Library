import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Login.module.css";

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
    <div className={styles.loginPageContainer}>
      <div className={styles.loginHeading}>Login Page</div>
      <div className={styles.loginFormContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.loginFormGroup}>
            <label htmlFor="email" className={styles.loginLabel}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.loginEmailInput}
              required
            />
          </div>
          <div className={styles.loginFormGroup}>
            <label htmlFor="password" className={styles.loginLabel}>
              Password
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.loginPasswordInput}
                required
              />
              <button
                type="button"
                className={styles.passwordToggleButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <a href="/reset-password" className={styles.forgotPasswordLink}>
            Forgot your password?
          </a>
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.loginButton} ${styles.loginButtonPrimary}`}
            >
              LOG IN
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className={`${styles.loginButton} ${styles.loginButtonSecondary}`}
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

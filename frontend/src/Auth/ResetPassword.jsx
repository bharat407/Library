import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Reset.module.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [cnfPassword, setCnfPassword] = useState(false);
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
            toast.success("Please Login", {
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
    <div className={styles.resetContainer}>
      <div className={styles.heading}>Reset Password</div>
      <div className={styles.formResetContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">New Password</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={cnfPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setCnfPassword(!cnfPassword)}
              >
                {cnfPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <a href="/" className={styles.login}>
            <span>
              <FaArrowLeft size={15} />
            </span>{" "}
            <span className={styles.loginText}>Login</span>
          </a>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

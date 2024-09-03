import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [cnfPassword, setCnfPassword] = useState(false);
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
    <div className="registrationSection">
      <div className="registrationHeading">Registration Page</div>
      <div className="registrationFormContainer">
        <form onSubmit={handleSubmit}>
          <div className="registrationFormGroup">
            <label htmlFor="email" className="registrationFormLabel">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="registrationFormInput"
              required
            />
          </div>
          <div className="registrationFormGroup">
            <label htmlFor="password" className="registrationFormLabel">
              Password
            </label>
            <div className="registrationPasswordInputContainer">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="registrationFormInput"
                required
              />
              <button
                type="button"
                className="registrationPasswordToggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="registrationFormGroup">
            <label htmlFor="confirmPassword" className="registrationFormLabel">
              Confirm Password
            </label>
            <div className="registrationPasswordInputContainer">
              <input
                type={cnfPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="registrationFormInput"
                required
              />
              <button
                type="button"
                className="registrationPasswordToggle"
                onClick={() => setCnfPassword(!cnfPassword)}
              >
                {cnfPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="registrationButtonContainer">
            <button
              type="submit"
              className="registrationButton registrationButtonPrimary"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className="registrationButton registrationButtonSecondary"
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

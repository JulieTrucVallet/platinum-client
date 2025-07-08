// Import libraries and assets
import axios from "axios";
import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/platinum-logo.png";
import { API_URL } from "../config";
import "../styles/Register.scss";

function Register() {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/auth/register`,
        formData
      );
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-page">
      {/* Logo */}
      <img src={logo} alt="Platinum Logo" className="logo" />

      {/* Register form */}
      <form className="register-form" onSubmit={handleSubmit}>
        {/* Username field */}
        <div className="input-group">
          <label htmlFor="username">
            <FaUser />
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </div>

        {/* Email field */}
        <div className="input-group">
          <label htmlFor="email">
            <FaEnvelope />
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@mail.com"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password field */}
        <div className="input-group">
          <label htmlFor="password">
            <FaLock />
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="register-btn">
          REGISTER
        </button>

        {/* Redirect to login */}
        <div className="login-link">
          <span>Already have an account? </span>
          <Link to="/login">LOG IN</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
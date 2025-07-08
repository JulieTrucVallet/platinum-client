import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/platinum-logo.png";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.scss";

function Login() {
  const { login } = useAuth(); // context function to set user
  const [formData, setFormData] = useState({ email: "", password: "" }); // login form state
  const [message, setMessage] = useState(""); // success or error message
  const navigate = useNavigate();

  // update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        formData
      );
      const { token, user } = res.data;
      login(user, token); // set user in context
      localStorage.setItem("token", token); // store token
      setMessage("Connexion réussie ! 🎉");
      setTimeout(() => navigate("/"), 1500); // redirect after success
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="login-page">
      <img src={logo} alt="Logo Platinum" className="logo" />

      <form className="login-form" onSubmit={handleSubmit}>
        {/* Email field */}
        <div className="input-group">
          <label htmlFor="email">
            <i className="fa fa-envelope" />
          </label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="prenom.nom@mail.com"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password field */}
        <div className="input-group">
          <label htmlFor="password">
            <i className="fa fa-lock" />
          </label>
          <input
            name="password"
            type="password"
            id="password"
            placeholder="••••••••"
            onChange={handleChange}
            required
          />
        </div>

        {/* Forgot password (static for now) */}
        <p className="forgot">Mot de passe oublié ?</p>

        {/* Submit button */}
        <button type="submit" className="login-btn">
          SE CONNECTER
        </button>

        {/* Display message */}
        {message && <p className="message">{message}</p>}

        {/* Link to register */}
        <p className="signup">
          Pas encore de compte ? <Link to="/register">S’INSCRIRE</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
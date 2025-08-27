import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/platinum-logo.png";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/AuthService";
import "../styles/Login.scss";

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const { token, user } = await loginService(formData.email, formData.password);
      login(user, token);
      localStorage.setItem("token", token);
      setMessage("Connexion réussie ! 🎉");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <main className="login-page">
      <header>
        <img src={logo} alt="Logo Platinum" className="logo" />
      </header>

      <section>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label htmlFor="email" className="sr-only">
              Adresse email
            </label>
            <FaEnvelope className="icon" aria-hidden="true" />
            <input
              name="email"
              type="email"
              id="email"
              placeholder="prenom.nom@mail.com"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <FaLock className="icon" aria-hidden="true" />
            <input
              name="password"
              type="password"
              id="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <p className="forgot">Mot de passe oublié ?</p>

          <button type="submit" className="login-btn">
            SE CONNECTER
          </button>

          {message && <p className="message">{message}</p>}

          <p className="signup">
            Pas encore de compte ? <Link to="/register">S’INSCRIRE</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
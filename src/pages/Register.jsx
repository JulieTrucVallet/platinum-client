// Import libraries and assets
import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/platinum-logo.png";
import { register as registerService } from "../services/AuthService";
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
      await registerService(formData);
      alert("Inscription réussie !");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l’inscription");
    }
  };

  return (
    <main className="register-page">
      <header>
        <img src={logo} alt="Platinum Logo" className="logo" />
      </header>

      <section>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">
              <FaUser /> Nom d’utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Votre nom"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">
              <FaEnvelope /> Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="votre.email@mail.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <FaLock /> Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Inscription
          </button>

          <p className="login-link">
            Déjà un compte ? <Link to="/login">Connexion</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
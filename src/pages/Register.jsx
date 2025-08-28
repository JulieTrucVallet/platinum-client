import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/platinum-logo.png";
import { register as registerService } from "../services/AuthService";
import "../styles/Register.scss";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        <img src={logo} alt="Logo Platinum" className="logo" />
      </header>

      <section aria-labelledby="register-title">
        <h1 id="register-title" className="sr-only">Créer un compte</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label htmlFor="username" className="sr-only">Nom</label>
            <span className="icon" aria-hidden="true"><FaUser /></span>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Nom"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email" className="sr-only">Adresse email</label>
            <span className="icon" aria-hidden="true"><FaEnvelope /></span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="prenom.nom@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password" className="sr-only">Mot de passe</label>
            <span className="icon" aria-hidden="true"><FaLock /></span>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">S’INSCRIRE</button>

          <p className="login-link">
            Déjà inscrit ? <Link to="/login">SE CONNECTER</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
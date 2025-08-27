import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/platinum-logo.png";
import { register as registerService } from "../services/AuthService";
import "../styles/Register.scss";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        <h1 id="register-title" className="sr-only">
          Créer un compte
        </h1>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group">
            <label htmlFor="username" className="sr-only">
              Nom d’utilisateur
            </label>
            <FaUser className="icon" aria-hidden="true" />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nom"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email" className="sr-only">
              Adresse email
            </label>
            <FaEnvelope className="icon" aria-hidden="true" />
            <input
              type="email"
              id="email"
              name="email"
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
              type="password"
              id="password"
              name="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            S’INSCRIRE
          </button>

          <p className="login-link">
            Déjà inscrit ? <Link to="/login">SE CONNECTER</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/platinum-logo-slogan.png";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.scss";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Logo Platinum" className="logo-navbar" />
        </Link>
      </div>

      {/* Burger */}
      <button
        className="burger"
        aria-label="Ouvrir le menu"
        aria-expanded={menuOpen}
        aria-controls="navbar-links"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className={`bar ${menuOpen ? "open" : ""}`} />
        <div className={`bar ${menuOpen ? "open" : ""}`} />
        <div className={`bar ${menuOpen ? "open" : ""}`} />
      </button>

      {/* Liens (affichés dans le burger en mobile) */}
      <ul id="navbar-links" className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/add-recipe" onClick={() => setMenuOpen(false)}>Ajouter une recette</Link>
            </li>
            <li>
              <Link to="/favorites" onClick={() => setMenuOpen(false)}>Favoris</Link>
            </li>
            <li>
              <Link to="/courses" onClick={() => setMenuOpen(false)}>Liste de courses</Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profil</Link>
            </li>
            {/* 🔸 Déconnexion visible UNIQUEMENT en mobile */}
            <li className="mobile-only">
              <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
            </li>
          </>
        ) : (
          <>
            {/* 🔸 Connexion / Inscription visibles UNIQUEMENT en mobile */}
            <li className="mobile-only">
              <Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link>
            </li>
            <li className="mobile-only">
              <Link to="/register" onClick={() => setMenuOpen(false)}>Inscription</Link>
            </li>
          </>
        )}
      </ul>

      {/* Boutons verts (DESKTOP seulement) */}
      <div className="navbar-right desktop-only">
        {user ? (
          <>
            <span className="welcome-text">Bienvenue {user.username}</span>
            <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Connexion</Link>
            <Link to="/register" className="btn-login">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}
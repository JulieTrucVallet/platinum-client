import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/platinum-logo-slogan.png";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.scss";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Logo Platinum" className="logo-navbar" />
        </Link>
      </div>

      {/* Burger icon */}
      <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>

      {/* Links */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
        {user && (
          <>
            <li><Link to="/add-recipe" onClick={() => setMenuOpen(false)}>Ajouter une recette</Link></li>
            <li><Link to="/favorites" onClick={() => setMenuOpen(false)}>Favoris</Link></li>
            <li><Link to="/courses" onClick={() => setMenuOpen(false)}>Liste de courses</Link></li>
            <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profil</Link></li>
          </>
        )}
      </ul>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="welcome-text">Bienvenue {user.username}</span>
            <button onClick={logout} className="btn-logout">Déconnexion</button>
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
import { Link } from "react-router-dom";
import logo from "../assets/platinum-logo.png";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.scss";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Logo Platinum" className="logo-navbar" />
        </Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Accueil</Link></li>
        {user && (
          <>
            <li><Link to="/add-recipe">Ajouter une recette</Link></li>
            <li><Link to="/favorites">Favoris</Link></li>
            <li><Link to="/courses">Liste de courses</Link></li>
            <li><Link to="/profile">Profil</Link></li>
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
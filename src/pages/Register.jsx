import axios from 'axios';
import { useState } from 'react';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/platinum-logo.png';
import '../styles/Register.scss';


function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      alert('Inscription réussie !');
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Erreur lors de l’inscription');
    }
  };

  return (
    <div className="register-page">
      <img src={logo} alt="Logo Platinum" className="logo" />

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username"><FaUser /></label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Nom"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email"><FaEnvelope /></label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="prenom.nom@mail.com"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password"><FaLock /></label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="register-btn">S’INSCRIRE</button>

        <div className="login-link">
          <span>Déjà inscrit ? </span>
          <Link to="/login">SE CONNECTER</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
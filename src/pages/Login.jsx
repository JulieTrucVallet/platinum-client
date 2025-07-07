import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/platinum-logo.png';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.scss';

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
      const { token, user } = res.data;
      login(user, token);
      localStorage.setItem('token', token);
      setMessage('Connexion réussie ! 🎉');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="login-page">
      <img src={logo} alt="Logo Platinum" className="logo" />

      <form className="login-form" onSubmit={handleSubmit}>
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

        <p className="forgot">Mot de passe oublié ?</p>

        <button type="submit" className="login-btn">SE CONNECTER</button>

        {message && <p className="message">{message}</p>}

        <p className="signup">
          Pas encore de compte ? <Link to="/register">S’INSCRIRE</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
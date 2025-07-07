import axios from 'axios';
import { useEffect, useState } from 'react';
import '../styles/Profile.scss';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8010/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setEmail(res.data.email);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement du profil');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (image) formData.append('image', image);

    const res = await axios.put('http://localhost:8010/api/users/profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    setMessage('Profil mis à jour');
    setPassword('');
    setProfile((prev) => ({ ...prev, image: res.data.image, email: res.data.email }));
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur');
  }
};

  const handleUpload = async (e) => {
  e.preventDefault();
  if (!image) return;

  const formData = new FormData();
  formData.append('image', image);

  try {
    const token = localStorage.getItem('token');
    const res = await axios.put('http://localhost:8010/api/users/profile/image', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    setProfile({ ...profile, image: res.data.image });
    setMessage('Photo de profil mise à jour');
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur lors de l’upload');
  }
};


  if (error) return <p>{error}</p>;
  if (!profile) return <p>Chargement...</p>;

  return (
    <div className="profile-page">
    <h2 className="profile-title">🍃 MON PROFIL</h2>

    <div className="profile-card">
        <div className="profile-picture">
        <label htmlFor="profileImageInput" className="profile-avatar">
            {preview ? (
            <img src={preview} alt="Preview" />
            ) : profile.image ? (
            <img src={`http://localhost:8010${profile.image}`} alt="Profil" />
            ) : (
            <div className="avatar-placeholder">{profile.username.charAt(0).toUpperCase()}</div>
            )}
            <span className="edit-icon">✏️</span>
        </label>
        <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                setPreview(file ? URL.createObjectURL(file) : null);
                if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
                };
            }}
        />
        </div>

        <form className="profile-form" onSubmit={handleUpdate}>
        <div className="form-group">
            <label>Nom :</label>
            <input type="text" value={profile.username} disabled />
        </div>
        <div className="form-group">
            <label>Mail :</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
            <label>Mot de passe :</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
            />
        </div>
        <button type="submit" className="btn-submit">✅ Mettre à jour</button>
        </form>

        <div className="profile-stats">
        <p>📌 Recettes créées : <strong>{profile.recipeCount}</strong></p>
        <p>⭐ Favoris : <strong>{profile.favoriteCount}</strong></p>
        </div>

        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
    </div>
    </div>
  );
}

export default Profile;
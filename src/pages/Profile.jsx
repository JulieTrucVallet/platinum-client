import axios from 'axios';
import { useEffect, useState } from 'react';

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
      await axios.put('http://localhost:8010/api/users/profile', 
        { email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Profil mis à jour');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur');
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
  <div style={{ padding: '2rem' }}>
    <h2>Mon Profil</h2>
    <p><strong>Nom d'utilisateur :</strong> {profile.username}</p>
    <p><strong>Email :</strong> {profile.email}</p>
    <p><strong>Recettes créées :</strong> {profile.recipeCount}</p>
    <p><strong>Recettes en favoris :</strong> {profile.favoriteCount}</p>

    <h3 style={{ marginTop: '2rem' }}>Modifier mon profil</h3>
    <h3 style={{ marginTop: '2rem' }}>Photo de profil</h3>
    {preview ? (
        <img
            src={preview}
            alt="Preview"
            style={{ width: '120px', borderRadius: '50%', marginBottom: '1rem' }}
        />
        ) : profile.image && (
        <img
            src={`http://localhost:8010${profile.image}`}
            alt="Profil"
            style={{ width: '120px', borderRadius: '50%', marginBottom: '1rem' }}
        />
        )}
    <form onSubmit={handleUpload} encType="multipart/form-data">
    <input type="file" accept="image/*" onChange={(e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
        }} />
    <button type="submit">Changer la photo</button>
    </form>
    <form onSubmit={handleUpdate}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Nouvel email : </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Nouveau mot de passe : </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Laisser vide pour ne pas changer"
        />
      </div>
      <button type="submit">Mettre à jour</button>
    </form>

    {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
  </div>
  );
}

export default Profile;
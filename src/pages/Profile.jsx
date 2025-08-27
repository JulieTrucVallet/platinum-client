import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import "../styles/Profile.scss";

function Profile() {
  // States
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setEmail(res.data.email);
      } catch (err) {
        setError(err.response?.data?.message || "Error while loading profile");
      }
    };
    fetchProfile();
  }, []);

  // Update profile (email, password, image)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (image) formData.append("image", image);

      const res = await axios.put(
        `${API_URL}/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Profile updated");
      setPassword("");
      setProfile((prev) => ({
        ...prev,
        image: res.data.image,
        email: res.data.email,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  // Unused upload function (in case you want to upload image separately)
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/users/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile({ ...profile, image: res.data.image });
      setMessage("Profile picture updated");
    } catch (err) {
      setError(err.response?.data?.message || "Upload error");
    }
  };

  // If loading or error
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <main className="profile-page">
      <header>
        <h2 className="profile-title">🍃 Mon Profil</h2>
      </header>

      <article className="profile-card">
        {/* Profile image preview */}
        <section className="profile-picture">
          <label htmlFor="profileImageInput" className="profile-avatar">
            {preview ? (
              <img src={preview} alt="Aperçu du profil" />
            ) : profile.image ? (
              <img
                src={`${import.meta.env.VITE_UPLOADS_URL}${profile.image}`}
                alt="Image de profil"
              />
            ) : (
              <div className="avatar-placeholder">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="edit-icon">✏️</span>
          </label>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
        </section>

        {/* Profile form */}
        <section>
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="username">Nom :</label>
              <input
                type="text"
                id="username"
                value={profile.username}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe :</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Laissez vide pour conserver le même"
              />
            </div>
            <button type="submit" className="btn-submit">
              Mettre à jour
            </button>
          </form>
        </section>

        {/* Stats */}
        <section className="profile-stats">
          <p>
            📌 Recettes créées : <strong>{profile.recipeCount}</strong>
          </p>
          <p>
            ⭐ Favoris : <strong>{profile.favoriteCount}</strong>
          </p>
        </section>

        {/* Messages */}
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </article>
    </main>
  );
}

export default Profile;
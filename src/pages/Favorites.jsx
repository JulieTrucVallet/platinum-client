import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import "../styles/Favorites.scss";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/recipes/user/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement");
      }
    };

    fetchFavorites();
  }, []);

  if (error) return <p role="alert">{error}</p>;

  return (
    <main className="favorites-page">
      <header>
        <h2>
          Mes <span>favoris</span>
        </h2>
      </header>

      <section>
        {favorites.length === 0 ? (
          <p role="status" style={{ textAlign: "center" }}>
            Pas encore de favoris...
          </p>
        ) : (
          <div className="recipe-grid">
            {favorites.map((r) => (
              <article className="recipe-card" key={r._id}>
                {r.image ? (
                  <img
                    src={`${import.meta.env.VITE_UPLOADS_URL}${r.image}`}
                    alt={r.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="no-image">
                    <span aria-hidden="true">📷</span>
                  </div>
                )}

                <div className="card-content">
                  <h3 className="recipe-title">{r.title}</h3>
                  <p className="prep-time">
                    Préparation : {r.duration || "–"} min
                  </p>
                  <p className="author">
                    Auteur : {r.user?.username || "Inconnu"}
                  </p>
                  <Link to={`/recipes/${r._id}`} className="see-recipe">
                    Voir la recette →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Favorites;
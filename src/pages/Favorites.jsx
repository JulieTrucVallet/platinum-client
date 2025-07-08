import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Favorites.scss";

function Favorites() {
  const [favorites, setFavorites] = useState([]); // store user's favorite recipes
  const [error, setError] = useState(""); // handle potential error messages

  useEffect(() => {
    // fetch user's favorite recipes from the server
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8010/api/recipes/user/favorites",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavorites(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement");
      }
    };

    fetchFavorites();
  }, []);

  if (error) return <p>{error}</p>; // display error if any

  return (
    <div className="favorites-page">
      <h2>
        Mes <span>favoris</span>
      </h2>
      {favorites.length === 0 ? (
        <p style={{ textAlign: "center" }}>Pas encore de favoris...</p> // message when list is empty
      ) : (
        <div className="recipe-grid">
          {favorites.map((r) => (
            <div className="recipe-card" key={r._id}>
              {r.image ? (
                <img src={`http://localhost:8010${r.image}`} alt={r.title} />
              ) : (
                <div className="no-image">
                  <span>📷</span>
                </div>
              )}
              <div className="card-content">
                <p className="recipe-title">{r.title}</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
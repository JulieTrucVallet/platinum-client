// Import libraries and hooks
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";
import "../styles/RecipeDetails.scss";

// Enable relative time (e.g., "2 days ago")
dayjs.extend(relativeTime);

function RecipeDetails() {
  // Get recipe ID from URL
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Extract userId from token
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  // Toggle favorite
  const handleToggleFavorite = async () => {
    try {
      await axios.post(
        `${API_URL}/recipes/${id}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err.response?.data?.message || "Error");
    }
  };

  // Delete recipe
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error(err.response?.data?.message || "Error deleting recipe");
    }
  };

  // Add an ingredient to shopping list
  const handleAddToList = async (name, quantity) => {
    try {
      await axios.post(
        `${API_URL}/shopping-list`,
        {
          name,
          quantity: quantity || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`${name} added to shopping list`);
    } catch (err) {
      console.error(err.response?.data?.message || "Error adding to list");
    }
  };

  // Fetch all comments for the recipe
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_URL}/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error loading comments:", err.message);
    }
  };

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `${API_URL}/comments/${id}`,
        {
          content: newComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewComment("");
      fetchComments(); // reload comments
    } catch (err) {
      console.error("Error adding comment:", err.message);
    }
  };

  // Fetch recipe and comments on load
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_URL}/recipes/${id}`);
        setRecipe(res.data);

        if (token && res.data.favorites) {
          setIsFavorite(res.data.favorites.includes(userId));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error loading recipe");
      }
    };

    fetchRecipe();
    fetchComments();
  }, [id, token, userId]);

  // Loading and error handling
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Loading...</p>;

  return (
    <main className="recipe-page-wrapper">
      <article className="recipe-details-grid">
        {/* Partie gauche */}
        <section className="left-section">
          <header>
            <h2>{recipe.title}</h2>
          </header>

          {/* Image */}
          {recipe.image && (
            <img
              src={
                recipe.image.startsWith("http")
                  ? recipe.image
                  : `${import.meta.env.VITE_UPLOADS_URL}${recipe.image}`
              }
              alt={`Image de la recette ${recipe.title}`}
              className="recipe-image"
              loading="lazy"
            />
          )}

          {/* Infos principales */}
          <div className="infos">
            <p>
              <strong>⏱️ Temps :</strong> {recipe.duration} min
            </p>
            <p>
              <strong>Auteur :</strong> {recipe.user?.username}
            </p>
          </div>

          {/* Ingrédients */}
          <section className="ingredients">
            <h3>🧾 Ingrédients</h3>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  {ing?.name} {ing?.quantity && `(${ing.quantity})`}
                  <button
                    aria-label={`Ajouter ${ing?.name} à la liste de courses`}
                    onClick={() => handleAddToList(ing.name, ing.quantity)}
                  >
                    ➕ Ajouter
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Étapes */}
          <section className="steps">
            <h3>📋 Étapes</h3>
            {recipe.steps.map((step, i) => (
              <p key={i}>{step}</p>
            ))}
          </section>

          {/* Actions */}
          <footer className="actions">
            <button onClick={handleToggleFavorite}>
              {isFavorite ? "💔 Supprimer des Favoris" : "❤️ Ajouter aux Favoris"}
            </button>

            {recipe.user?._id === userId && (
              <>
                <button
                  aria-label="Modifier la recette"
                  onClick={() => navigate(`/recipes/${id}/edit`)}
                >
                  ✏️ Modifier
                </button>
                <button aria-label="Supprimer la recette" onClick={handleDelete}>
                  🗑️ Supprimer
                </button>
              </>
            )}
          </footer>
        </section>

        {/* Partie droite */}
        <aside className="right-section">
          {/* Vidéo ou lien */}
          <section className="video-section">
            <h3>🔗 Lien</h3>
            {recipe.link ? (
              recipe.link.includes("youtube") ? (
                <iframe
                  title={`Vidéo de la recette ${recipe.title}`}
                  width="100%"
                  height="250"
                  src={recipe.link.replace("watch?v=", "embed/")}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <a
                  href={recipe.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Lien associé à la recette ${recipe.title}`}
                >
                  {recipe.link}
                </a>
              )
            ) : (
              <p>Pas de lien</p>
            )}
          </section>

          {/* Commentaires */}
          <section className="comment-section">
            <h3>💬 Commentaires</h3>

            {/* Formulaire commentaire */}
            {token && (
              <form style={{ marginBottom: "1rem" }}>
                <label htmlFor="commentTextarea" className="sr-only">
                  Laisser un commentaire
                </label>
                <textarea
                  id="commentTextarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="Laisser un commentaire..."
                  style={{ width: "100%", padding: "0.5rem" }}
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  style={{ marginTop: "0.5rem" }}
                >
                  Poster
                </button>
              </form>
            )}

            {/* Liste des commentaires */}
            {comments.length === 0 ? (
              <p>Pas encore de commentaires</p>
            ) : (
              comments.map((c) => (
                <article
                  key={c._id}
                  style={{
                    marginBottom: "1rem",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <strong>{c.user?.username || "Utilisateur"}</strong>
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      color: "gray",
                      fontSize: "0.9em",
                    }}
                  >
                    {dayjs(c.createdAt).fromNow()}
                  </span>
                  <p>{c.content}</p>
                </article>
              ))
            )}
          </section>
        </aside>
      </article>
    </main>
  );
}

export default RecipeDetails;
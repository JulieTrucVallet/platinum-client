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
    <div className="recipe-page-wrapper">
      <div className="recipe-details-grid">
        {/* Left side */}
        <div className="left-section">
          <h2>{recipe.title}</h2>

          {/* Image */}
          {recipe.image && (
            <img
              src={
                recipe.image.startsWith("http")
                  ? recipe.image
                  : `${import.meta.env.VITE_UPLOADS_URL}${recipe.image}`
              }
              alt={recipe.title}
              className="recipe-image"
            />
          )}

          <p>
            <strong>⏱️ Time:</strong> {recipe.duration} min
          </p>
          <p>
            <strong>Author:</strong> {recipe.user?.username}
          </p>

          {/* Ingredients */}
          <h4>🧾 Ingredients</h4>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                {ing?.name} {ing?.quantity && `(${ing.quantity})`}
                <button onClick={() => handleAddToList(ing.name, ing.quantity)}>
                  ➕ Ajouter à la liste de courses
                </button>
              </li>
            ))}
          </ul>

          {/* Steps */}
          <h4>📋 Steps</h4>
          <div className="steps">
            {recipe.steps.map((step, i) => (
              <p key={i}>{step}</p>
            ))}
          </div>

          {/* Actions */}
          <div className="actions">
            <button onClick={handleToggleFavorite}>
              {isFavorite ? "💔 Supprimer des Favoris" : "❤️ Ajouter au Favoris"}
            </button>

            {recipe.user?._id === userId && (
              <>
                <button onClick={() => navigate(`/recipes/${id}/edit`)}>
                  ✏️ Modifier
                </button>
                <button onClick={handleDelete}>🗑️ Supprimer</button>
              </>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="right-section">
          {/* Video or link */}
          <div className="video-section">
            <h4>Lien</h4>
            {recipe.link ? (
              recipe.link.includes("youtube") ? (
                <iframe
                  width="100%"
                  height="250"
                  src={recipe.link.replace("watch?v=", "embed/")}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <a href={recipe.link} target="_blank" rel="noopener noreferrer">
                  {recipe.link}
                </a>
              )
            ) : (
              <p>Pas de liens</p>
            )}
          </div>

          {/* Comments */}
          <div className="comment-section" style={{ marginTop: "2rem" }}>
            <h4>💬 Commentaires</h4>

            {/* Add comment */}
            {token && (
              <div style={{ marginBottom: "1rem" }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="Laisser un commentaire..."
                  style={{ width: "100%", padding: "0.5rem" }}
                />
                <button
                  onClick={handleAddComment}
                  style={{ marginTop: "0.5rem" }}
                >
                  Poster
                </button>
              </div>
            )}

            {/* Show comments */}
            {comments.length === 0 ? (
              <p>Pas encore de Commentaires</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  style={{
                    marginBottom: "1rem",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <strong>{c.user?.username || "User"}</strong>
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
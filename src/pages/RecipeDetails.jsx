import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/RecipeDetails.scss';

dayjs.extend(relativeTime);

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');


  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  const handleToggleFavorite = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/recipes/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Es-tu sûr de vouloir supprimer cette recette ?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8010/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      console.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleAddToList = async (name, quantity) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/shopping-list`, {
        name,
        quantity: quantity || '',
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert(`${name} ajouté à la liste de courses !`);
    } catch (err) {
      console.error(err.response?.data?.message || 'Erreur lors de l’ajout');
    }
  };

  const fetchComments = async () => {
    try {
        const res = await axios.get(`http://localhost:8010/api/comments/${id}`);
        setComments(res.data);
    } catch (err) {
        console.error("Erreur récupération commentaires :", err.message);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/comments/${id}`, {
        content: newComment
        }, {
        headers: { Authorization: `Bearer ${token}` }
        });

        setNewComment('');
        fetchComments(); // recharge la liste
    } catch (err) {
        console.error("Erreur ajout commentaire :", err.message);
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8010/api/recipes/${id}`);
        setRecipe(res.data);

        if (token && res.data.favorites) {
          setIsFavorite(res.data.favorites.includes(userId));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      }
    };
    fetchRecipe();
    fetchComments();
  }, [id, token, userId]);

  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Chargement...</p>;

  return (
    <div className="recipe-page-wrapper">
    <div className="recipe-details-grid">
      <div className="left-section">
        <h2>{recipe.title}</h2>

        {recipe.image && (
          <img
            src={`http://localhost:8010${recipe.image}`}
            alt={recipe.title}
            className="recipe-image"
          />
        )}

        <p><strong>⏱️ Durée :</strong> {recipe.duration} min</p>
        <p><strong>Auteur :</strong> {recipe.user?.username}</p>

        <h4>🧾 Ingrédients</h4>
        <ul>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>
              {ing?.name} {ing?.quantity && `(${ing.quantity})`}{' '}
              <button onClick={() => handleAddToList(ing.name, ing.quantity)}>➕ Ajouter à la liste</button>
            </li>
          ))}
        </ul>

        <h4>📋 Étapes</h4>
        <div className="steps">
            {recipe.steps.map((step, i) => (
                <p key={i}>{step}</p>
            ))}
        </div>
        <div className="actions">
          <button onClick={handleToggleFavorite}>
            {isFavorite ? '💔 Retirer des favoris' : '❤️ Ajouter aux favoris'}
          </button>

          {recipe.user?._id === userId && (
            <>
              <button onClick={() => navigate(`/recipes/${id}/edit`)}>✏️ Modifier</button>
              <button onClick={handleDelete}>🗑️ Supprimer</button>
            </>
          )}
        </div>
      </div>

      <div className="right-section">
        <div className="video-section">
          <h4>Lien de la recette</h4>
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
              <a href={recipe.link} target="_blank" rel="noopener noreferrer">{recipe.link}</a>
            )
          ) : (
            <p>Aucun lien fourni.</p>
          )}
        </div>

        <div className="comment-section" style={{ marginTop: '2rem' }}>
            <h4>💬 Commentaires</h4>

            {token && (
                <div style={{ marginBottom: '1rem' }}>
                <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    rows={3}
                    placeholder="Laisser un commentaire..."
                    style={{ width: '100%', padding: '0.5rem' }}
                />
                <button onClick={handleAddComment} style={{ marginTop: '0.5rem' }}>Commenter</button>
                </div>
            )}

            {comments.length === 0 ? (
                <p>Aucun commentaire pour le moment.</p>
            ) : (
                comments.map((c) => (
                <div key={c._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                    <strong>{c.user?.username || 'Utilisateur'}</strong>
                    <span style={{ marginLeft: '0.5rem', color: 'gray', fontSize: '0.9em' }}>
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
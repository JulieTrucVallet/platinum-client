import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Récupération du userId à partir du token JWT
  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  const handleToggleFavorite = async () => {
    try {
      await axios.post(`http://localhost:8010/api/recipes/${id}/favorite`, {}, {
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
    console.log('Tentative d’ajout :', name, quantity);

    try {
        await axios.post('http://localhost:8010/api/shopping-list', {
        name,
        quantity: quantity || '', // quantité vide autorisée
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
  }, [id, token, userId]);

  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Chargement...</p>;

  return (
    <div className="recipe-details">
      <h2>{recipe.title}</h2>
      {recipe.image && (
        <img
          src={`http://localhost:8010${recipe.image}`}
          alt={recipe.title}
          style={{ maxWidth: '400px' }}
        />
      )}
      <p><strong>Description :</strong> {recipe.description}</p>
      <p><strong>Auteur :</strong> {recipe.user?.username}</p>
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div>
            <h4>🧾 Ingrédients</h4>
            <ul>
                {recipe.ingredients.map((ing, i) => (
                    <li key={i}>
                    {ing?.name} {ing?.quantity && `(${ing.quantity})`}{' '}
                    <button
                        style={{ marginLeft: '0.5rem' }}
                        onClick={() => handleAddToList(ing.name, ing.quantity)}
                        >
                        ➕ Ajouter à la liste
                    </button>
                    </li>
                ))}
            </ul>
        </div>
        )}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
            <Link to={`/courses/${recipe._id}`}>🛒 Voir la liste de courses</Link>
        </div>
        )}
      <button onClick={handleToggleFavorite}>
        {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      </button>

      {recipe.user?._id === userId && (
        <>
          <button onClick={() => navigate(`/recipes/${id}/edit`)}>Modifier</button>
          <button onClick={handleDelete} style={{ marginLeft: '1rem' }}>Supprimer</button>
        </>
      )}
    </div>
  );
}

export default RecipeDetails;
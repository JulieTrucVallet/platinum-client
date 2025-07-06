import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeService from '../services/RecipeService';

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const data = await RecipeService.getAll();
      setRecipes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes admin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette recette ?')) {
      try {
        await RecipeService.deleteRecipe(id);
        fetchRecipes();
      } catch (error) {
        console.error('Erreur suppression :', error);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Interface Admin – Recettes</h1>
      <button onClick={() => navigate('/admin/add-recipe')}>Ajouter une recette</button>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Ingrédients</th>
              <th>Durée</th>
              <th>Difficulté</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe._id}>
                <td>{recipe.title}</td>
                <td>
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i}>{ing.name} – {ing.quantity}</div>
                  ))}
                </td>
                <td>{recipe.duration} min</td>
                <td>{recipe.difficulty}</td>
                <td>
                  <button onClick={() => navigate(`/admin/edit-recipe/${recipe._id}`)}>✏️</button>
                  <button onClick={() => handleDelete(recipe._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
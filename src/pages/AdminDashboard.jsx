import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRecipe, getRecipes } from "../services/RecipeService"; // ✅

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes(); // ✅ correspond à RecipeService.js
      setRecipes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des recettes admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette recette ?")) {
      try {
        await deleteRecipe(id);
        fetchRecipes();
      } catch (error) {
        console.error("Erreur suppression :", error);
      }
    }
  };

  return (
    <main className="admin-dashboard">
      <header>
        <h1>Interface Admin – Recettes</h1>
        <button onClick={() => navigate("/admin/add-recipe")}>
          ➕ Ajouter une recette
        </button>
      </header>

      <section>
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
                      <span key={i}>
                        {ing.name} – {ing.quantity}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td>{recipe.duration} min</td>
                  <td>{recipe.difficulty}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/edit-recipe/${recipe._id}`)}>
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(recipe._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
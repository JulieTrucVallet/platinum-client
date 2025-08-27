import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../components/admin/RecipeForm";
import { getRecipeById, updateRecipe } from "../services/RecipeService"; // ✅ exports nommés

export default function AdminEditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recipe by ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipeById(id); // ✅ appel direct par ID
        setInitialData(recipe);
      } catch (err) {
        console.error("Erreur lors du chargement de la recette :", err);
        alert("Recette introuvable ou erreur serveur");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await updateRecipe(id, formData); // ✅ export nommé
      alert("Recette mise à jour !");
      navigate("/admin");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la modification");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <main className="edit-recipe-page">
      <header>
        <h2>✏️ Modifier une recette</h2>
      </header>

      <section>
        <RecipeForm onSubmit={handleSubmit} initialData={initialData} />
      </section>
    </main>
  );
}
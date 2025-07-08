import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../components/admin/RecipeForm";
import RecipeService from "../services/RecipeService";

const AdminEditRecipe = () => {
  const { id } = useParams(); // get recipe ID from URL
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null); // store recipe data
  const [loading, setLoading] = useState(true); // loading state

  // Fetch recipe by ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipes = await RecipeService.getAll(); // you can use getById if available
        const found = recipes.find((r) => r._id === id);
        if (found) {
          setInitialData(found);
        } else {
          alert("Recette introuvable");
          navigate("/admin");
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la recette :", err);
        alert("Erreur serveur");
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
      await RecipeService.updateRecipe(id, formData);
      alert("Recette mise à jour !");
      navigate("/admin"); // redirect after update
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la modification");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Modifier une recette</h2>
      {/* Reuse RecipeForm with initialData */}
      <RecipeForm onSubmit={handleSubmit} initialData={initialData} />
    </div>
  );
};

export default AdminEditRecipe;
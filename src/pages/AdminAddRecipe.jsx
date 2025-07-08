import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/admin/RecipeForm";
import RecipeService from "../services/RecipeService";

const AdminAddRecipe = () => {
  const navigate = useNavigate(); // navigation after success

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await RecipeService.createRecipe(formData); // call API to create recipe
      alert("Recette ajoutée avec succès !");
      navigate("/admin"); // redirect to admin dashboard
    } catch (error) {
      console.error("Erreur lors de la création de la recette :", error);
      alert("Erreur lors de la création");
    }
  };

  return (
    <div>
      <h2>Ajouter une recette</h2>
      <RecipeForm onSubmit={handleSubmit} /> {/* reuse form component */}
    </div>
  );
};

export default AdminAddRecipe;
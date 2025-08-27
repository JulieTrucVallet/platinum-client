import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/admin/RecipeForm";
import { createRecipe } from "../services/RecipeService"; // ✅ utilise l’export nommé

export default function AdminAddRecipe() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createRecipe(formData); // ✅ fonction nommée
      alert("Recette ajoutée avec succès !");
      navigate("/admin");
    } catch (error) {
      console.error("Erreur lors de la création de la recette :", error);
      alert("Erreur lors de la création");
    }
  };

  return (
    <main className="admin-add-recipe-page">
      <header>
        <h2>➕ Ajouter une recette</h2>
      </header>

      <section>
        <RecipeForm onSubmit={handleSubmit} />
      </section>
    </main>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/admin/RecipeForm";
import { createRecipe, getCategories } from "../services/RecipeService";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // Load categories when page mounts
  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Handle form submit
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await createRecipe(formData);
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="add-recipe-page">
      <header>
        <h1 id="addRecipeTitle">🫐 Nouvelle recette</h1>
      </header>

      <section aria-labelledby="addRecipeTitle">
        <RecipeForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          categories={categories}
        />
        {isSubmitting && <p role="status">Enregistrement en cours…</p>}
      </section>
    </main>
  );
}
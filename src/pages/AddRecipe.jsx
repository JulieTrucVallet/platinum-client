import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/admin/RecipeForm";
import { createRecipe, getCategories } from "../services/RecipeService";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

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
        <h2>🫐 Nouvelle recette</h2>
      </header>
      <section>
        <RecipeForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          categories={categories}
        />
      </section>
    </main>
  );
}
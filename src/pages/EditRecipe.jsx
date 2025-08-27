import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../components/admin/RecipeForm";
import { getCategories, getRecipeById, updateRecipe } from "../services/RecipeService";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getRecipeById(id).then(setInitialValues);
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await updateRecipe(id, formData);
      navigate(`/recipes/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) return <p>Chargement...</p>;

  return (
    <main className="edit-recipe-page">
      <header>
        <h2>✏️ Modifier la recette</h2>
      </header>
      <section>
        <RecipeForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Mettre à jour"
          categories={categories}
        />
      </section>
    </main>
  );
}
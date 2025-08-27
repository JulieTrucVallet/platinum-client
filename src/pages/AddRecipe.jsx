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
    <div className="add-recipe-page">
      <h2>🫐 Nouvelle recette</h2>
      <RecipeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} categories={categories} />
    </div>
  );
}
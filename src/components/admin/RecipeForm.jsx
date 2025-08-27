import { useEffect, useState } from "react";
import "../../styles/RecipeForm.scss";

const empty = {
  title: "",
  duration: "",
  link: "",
  ingredients: [{ name: "", quantity: "" }],
  steps: "",
  image: null,
  category: "",
};

export default function RecipeForm({
  initialValues,
  isSubmitting,
  onSubmit,
  submitLabel = "Enregistrer",
  categories = [],
  message = "",
}) {
  const [values, setValues] = useState(empty);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!initialValues) return;
    setValues({
      title: initialValues.title || "",
      duration: initialValues.duration || "",
      link: initialValues.link || "",
      ingredients: initialValues.ingredients?.length
        ? initialValues.ingredients
        : [{ name: "", quantity: "" }],
      steps: (initialValues.steps || []).join("\n"),
      image: null,
      category: initialValues.category?._id || "",
    });
    setPreview(initialValues.image || null);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleIngredientChange = (i, field, val) => {
    const copy = [...values.ingredients];
    copy[i][field] = val;
    setValues((v) => ({ ...v, ingredients: copy }));
  };

  const addIngredient = () =>
    setValues((v) => ({
      ...v,
      ingredients: [...v.ingredients, { name: "", quantity: "" }],
    }));

  const removeIngredient = (i) =>
    setValues((v) => ({
      ...v,
      ingredients: v.ingredients.filter((_, idx) => idx !== i),
    }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setValues((v) => ({ ...v, image: file || null }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("duration", values.duration);
    fd.append("link", values.link);
    fd.append("category", values.category);
    fd.append("steps", values.steps);
    fd.append("ingredients", JSON.stringify(values.ingredients));
    if (values.image) fd.append("image", values.image);
    onSubmit?.(fd);
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      {/* Image input and preview */}
      <div
        className="image-preview"
        onClick={() => document.getElementById("imageInput").click()}
      >
        {preview ? (
          <img src={preview} alt="Aperçu" />
        ) : (
          <div className="placeholder">
            <i className="icon-image" />
          </div>
        )}
        <div className="edit-icon">✏️</div>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImage}
        />
      </div>

      {/* Title */}
      <input
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Nom de la recette"
        required
      />

      {/* Duration */}
      <input
        name="duration"
        value={values.duration}
        onChange={handleChange}
        placeholder="Temps (min)"
      />

      {/* Category */}
      {!!categories.length && (
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner une catégorie --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Ingredients */}
      <div className="ingredients-section">
        <h4>🧾 Ingrédients</h4>
        {values.ingredients.map((ing, i) => (
          <div key={i} className="ingredient-line">
            <input
              value={ing.name}
              onChange={(e) =>
                handleIngredientChange(i, "name", e.target.value)
              }
              placeholder="Nom"
              required
            />
            <input
              value={ing.quantity}
              onChange={(e) =>
                handleIngredientChange(i, "quantity", e.target.value)
              }
              placeholder="Quantité"
            />
            {values.ingredients.length > 1 && (
              <button type="button" onClick={() => removeIngredient(i)}>
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-ingredient" onClick={addIngredient}>
          + Ajouter un ingrédient
        </button>
      </div>

      {/* Steps */}
      <textarea
        name="steps"
        value={values.steps}
        onChange={handleChange}
        placeholder="Description des étapes (une par ligne)"
        required
      />

      {/* Optional link */}
      <input
        name="link"
        value={values.link}
        onChange={handleChange}
        placeholder="Lien vidéo, Instagram... (facultatif)"
      />

      {/* Submit */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : submitLabel}
      </button>

      {/* Feedback message */}
      {message && <p className="message-info">{message}</p>}
    </form>
  );
}
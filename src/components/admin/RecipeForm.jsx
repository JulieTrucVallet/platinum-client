import { useEffect, useRef, useState } from "react";
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
  const fileInputRef = useRef(null);

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
    // Si une image est sélectionnée → FormData
    if (values.image) {
      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("duration", values.duration);
      fd.append("link", values.link);
      fd.append("category", values.category);
      fd.append("steps", values.steps);
      fd.append("ingredients", JSON.stringify(values.ingredients));
      fd.append("image", values.image);
      onSubmit?.(fd);
    } else {
      // Sinon JSON classique
      onSubmit?.({
        title: values.title,
        duration: values.duration,
        link: values.link,
        category: values.category,
        steps: values.steps,
        ingredients: values.ingredients,
      });
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      {/* Image input and preview */}
      <div
        className="image-preview"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Aperçu" />
        ) : (
          <div className="placeholder">
            <i className="icon-image" aria-hidden="true" />
          </div>
        )}
        <div className="edit-icon">✏️</div>
        <input
          ref={fileInputRef}
          id="imageInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImage}
        />
      </div>

      {/* Title */}
      <label htmlFor="title" className="sr-only">Nom de la recette</label>
      <input
        id="title"
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Nom de la recette"
        required
      />

      {/* Duration */}
      <label htmlFor="duration" className="sr-only">Temps (minutes)</label>
      <input
        id="duration"
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
            <label htmlFor={`ingredient-name-${i}`} className="sr-only">Nom ingrédient</label>
            <input
              id={`ingredient-name-${i}`}
              value={ing.name}
              onChange={(e) =>
                handleIngredientChange(i, "name", e.target.value)
              }
              placeholder="Nom"
              required
            />
            <label htmlFor={`ingredient-qty-${i}`} className="sr-only">Quantité</label>
            <input
              id={`ingredient-qty-${i}`}
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
      <label htmlFor="steps" className="sr-only">Description des étapes</label>
      <textarea
        id="steps"
        name="steps"
        value={values.steps}
        onChange={handleChange}
        placeholder="Description des étapes (une par ligne)"
        required
      />

      {/* Optional link */}
      <label htmlFor="link" className="sr-only">Lien optionnel</label>
      <input
        id="link"
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
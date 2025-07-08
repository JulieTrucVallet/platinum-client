import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/RecipeService";
import "../styles/AddRecipe.scss";

function AddRecipe() {
  // Form state
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  // Preview selected image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("duration", duration);
      formData.append("steps", instructions);
      formData.append("link", link);
      formData.append("image", image);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("category", selectedCategory);

      await axios.post(`${API_URL}/recipes`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Recette ajoutée ! ✅");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l’ajout");
    }
  };

  // Update ingredients fields
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Add new empty ingredient field
  const addIngredientField = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories", err);
      }
    };

    fetchCategories();
  }, []);

  // If not logged in, show message
  if (!user) return <p>Veuillez vous connecter pour ajouter une recette.</p>;

  return (
    <div className="add-recipe-page">
      <h2 className="title">🫐 Nouvelle Recette</h2>

      <form className="recipe-form" onSubmit={handleSubmit}>
        {/* Image input and preview */}
        <div
          className="image-preview"
          onClick={() => document.getElementById("imageInput").click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <div className="placeholder">
              <i className="icon-image" />
            </div>
          )}
          <div className="edit-icon">✏️</div>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        {/* Title input */}
        <input
          type="text"
          placeholder="Nom de la recette"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Duration input */}
        <input
          type="text"
          placeholder="Temps (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        {/* Category select */}
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">-- Sélectionner une catégorie --</option>
            <option value="plat">Plat</option>
            <option value="dessert">Dessert</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ingredients input */}
        <div className="ingredients-section">
          <h4>🧾 Ingrédients</h4>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-line">
              <input
                type="text"
                placeholder="Nom"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Quantité"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="add-ingredient"
            onClick={addIngredientField}
          >
            + Ajouter
          </button>
        </div>

        {/* Instructions */}
        <textarea
          placeholder="Description des étapes..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />

        {/* Optional video or link */}
        <input
          type="text"
          placeholder="Lien vidéo, Instagram... (facultatif)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <button type="submit">✅ Ajouter la recette</button>
      </form>

      {/* Success or error message */}
      {message && <p className="message-info">{message}</p>}
    </div>
  );
}

export default AddRecipe;

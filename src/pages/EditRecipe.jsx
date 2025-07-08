import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";
import "../styles/AddRecipe.scss";

function EditRecipe() {
  const { id } = useParams(); // get recipe ID from URL
  const navigate = useNavigate();

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [link, setLink] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

  // fetch recipe data when component mounts
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_URL}/recipes/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.steps || res.data.description || "");
        setDuration(res.data.duration || "");
        setIngredients(res.data.ingredients || []);
        setLink(res.data.link || "");
        if (res.data.image) {
          setPreview(`${import.meta.env.VITE_UPLOADS_URL}${res.data.image}`);
        }
      } catch (err) {
        setMessage(err.response?.data?.message || "Erreur lors du chargement");
      }
    };
    fetchRecipe();
  }, [id]);

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("duration", duration);
      formData.append("link", link);
      formData.append(
        "ingredients",
        JSON.stringify(
          ingredients.map((item) => ({
            name: item.name?.trim() || "",
            quantity: item.quantity?.trim() || "",
          }))
        )
      );
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`${API_URL}/recipes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Recette mise à jour ✅");
      setTimeout(() => navigate(`/recipes/${id}`), 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Erreur lors de la mise à jour"
      );
    }
  };

  // add a new ingredient to the list
  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) return;
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient({ name: "", quantity: "" });
  };

  // update individual ingredient
  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // remove an ingredient
  const handleDeleteIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="add-recipe-page">
      <h2 className="title">✏️ Modifier une recette</h2>
      <form className="recipe-form" onSubmit={handleSubmit}>
        {/* image preview */}
        <div
          className="image-preview"
          onClick={() => document.getElementById("imageInput").click()}
        >
          {imageFile ? (
            <img src={URL.createObjectURL(imageFile)} alt="Preview" />
          ) : preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <div className="placeholder">🖼️</div>
          )}
          <div className="edit-icon">✏️</div>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        {/* recipe title */}
        <input
          type="text"
          placeholder="Nom de la recette"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* duration */}
        <input
          type="text"
          placeholder="Temps (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        {/* optional link */}
        <input
          type="text"
          placeholder="Lien vidéo, Instagram... (facultatif)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {/* steps */}
        <textarea
          placeholder="Description des étapes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* ingredients section */}
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
              <button
                type="button"
                onClick={() => handleDeleteIngredient(index)}
              >
                🗑️
              </button>
            </div>
          ))}

          {/* input to add a new ingredient */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <input
              type="text"
              placeholder="Nom"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Quantité"
              value={newIngredient.quantity}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, quantity: e.target.value })
              }
            />
            <button
              type="button"
              className="add-ingredient"
              onClick={handleAddIngredient}
            >
              + Ajouter
            </button>
          </div>
        </div>

        <button type="submit">💾 Enregistrer</button>
      </form>

      {/* feedback message */}
      {message && <p className="message-info">{message}</p>}
    </div>
  );
}

export default EditRecipe;
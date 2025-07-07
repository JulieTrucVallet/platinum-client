import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/AddRecipe.scss';

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [link, setLink] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '' });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);


  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8010/api/recipes/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.steps || res.data.description || '');
        setDuration(res.data.duration || '');
        setIngredients(res.data.ingredients || []);
        setLink(res.data.link || '');
        if (res.data.image) {
            setPreview(`http://localhost:8010${res.data.image}`);
        }
        setDescription(res.data.steps || res.data.description || '');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Erreur lors du chargement');
      }
    };
    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', duration);
      formData.append('link', link);
      formData.append('ingredients', JSON.stringify(
        ingredients.map((item) => ({
          name: item.name?.trim() || '',
          quantity: item.quantity?.trim() || ''
        }))
      ));
      if (imageFile) formData.append('image', imageFile);

      await axios.put(
        `http://localhost:8010/api/recipes/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Recette mise à jour ✅');
      setTimeout(() => navigate(`/recipes/${id}`), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) return;
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient({ name: '', quantity: '' });
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleDeleteIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="add-recipe-page">
      <h2 className="title">✏️ Modifier une recette</h2>
      <form className="recipe-form" onSubmit={handleSubmit}>
        <div className="image-preview" onClick={() => document.getElementById('imageInput').click()}>
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
                style={{ display: 'none' }}
                onChange={(e) => setImageFile(e.target.files[0])}
            />
        </div>
        <input
          type="text"
          placeholder="Nom de la recette"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Temps (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <input
          type="text"
          placeholder="Lien vidéo, Instagram... (facultatif)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <textarea
          placeholder="Description des étapes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="ingredients-section">
          <h4>🧾 Ingrédients</h4>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-line">
              <input
                type="text"
                placeholder="Nom"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Quantité"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              />
              <button type="button" onClick={() => handleDeleteIngredient(index)}>🗑️</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Nom"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Quantité"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
            />
            <button type="button" className="add-ingredient" onClick={handleAddIngredient}>
              + Ajouter
            </button>
          </div>
        </div>

        <button type="submit">💾 Enregistrer</button>
      </form>
      {message && <p className="message-info">{message}</p>}
    </div>
  );
}

export default EditRecipe;
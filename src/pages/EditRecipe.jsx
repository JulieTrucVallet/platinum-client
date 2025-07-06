import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '' });
  const [message, setMessage] = useState('');

  // 🔃 Charger la recette existante
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8010/api/recipes/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setIngredients(res.data.ingredients || []);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Erreur lors du chargement');
      }
    };
    fetchRecipe();
  }, [id]);

  // ✅ Enregistrer les modifs
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formattedIngredients = ingredients.map((item) => ({
        name: item.name?.trim() || '',
        quantity: item.quantity?.trim() || ''
        }));

        await axios.put(
        `http://localhost:8010/api/recipes/${id}`,
        { title, description, ingredients: formattedIngredients },
        { headers: { Authorization: `Bearer ${token}` } }
        );
      setMessage('Recette mise à jour ✅');
      setTimeout(() => navigate(`/recipes/${id}`), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  // ➕ Ajouter un ingrédient
  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) return;
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient({ name: '', quantity: '' });
  };

  // ✏️ Modifier un ingrédient
  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // ❌ Supprimer un ingrédient
  const handleDeleteIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>✏️ Modifier une recette</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />

        <h4>🧾 Ingrédients</h4>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
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

        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Nouvel ingrédient"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Quantité"
            value={newIngredient.quantity}
            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
          />
          <button type="button" onClick={handleAddIngredient}>➕ Ajouter</button>
        </div>

        <br />
        <button type="submit">💾 Enregistrer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditRecipe;
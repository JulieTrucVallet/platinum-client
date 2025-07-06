import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AddRecipe() {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8010/api/recipes',
        { title, instructions, ingredients },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setMessage('Recette ajoutée ! ✅');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de l’ajout');
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  if (!user) return <p>Veuillez vous connecter pour ajouter une recette.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ajouter une recette</h2>
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
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
        <br />

        <h4>Ingrédients</h4>
        {ingredients.map((ingredient, index) => (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            <input
              type="text"
              placeholder="Nom"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Quantité (facultatif)"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              style={{ marginLeft: '1rem' }}
            />
          </div>
        ))}
        <button type="button" onClick={addIngredientField}>
          Ajouter un ingrédient
        </button>
        <br /><br />

        <button type="submit">Ajouter</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddRecipe;
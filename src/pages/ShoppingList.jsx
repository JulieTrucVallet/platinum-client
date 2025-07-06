import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ShoppingList() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [checked, setChecked] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '' });
  const token = localStorage.getItem('token');

  // 🔃 Charger les ingrédients de la liste de courses
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await axios.get('http://localhost:8010/api/shopping-list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIngredients(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || 'Erreur');
      }
    };
    fetchIngredients();
  }, [token]);

  // ✅ Cocher un ingrédient
  const toggleCheck = async (index) => {
    try {
      await axios.patch(`http://localhost:8010/api/shopping-list/${index}/check`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChecked(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    } catch (err) {
      console.error(err.response?.data?.message || 'Erreur de mise à jour');
    }
  };

  // ❌ Supprimer un ingrédient
  const deleteIngredient = async (index) => {
    try {
      await axios.delete(`http://localhost:8010/api/shopping-list/${index}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngredients(prev => prev.filter((_, i) => i !== index));
      setChecked(prev => prev.filter(i => i !== index));
    } catch (err) {
      console.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  // ➕ Ajouter un ingrédient
  const addIngredient = async () => {
    if (!newIngredient.name.trim()) return;

    try {
      await axios.post('http://localhost:8010/api/shopping-list', newIngredient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngredients(prev => [...prev, newIngredient]);
      setNewIngredient({ name: '', quantity: '' });
    } catch (err) {
      console.error(err.response?.data?.message || 'Erreur lors de l’ajout');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛒 Liste de courses</h2>

      {ingredients.length === 0 ? (
        <p>Aucun ingrédient trouvé.</p>
      ) : (
        <ul>
          {ingredients.map((item, index) => (
            <li key={index}>
              <label style={{ textDecoration: checked.includes(index) ? 'line-through' : 'none' }}>
                <input
                  type="checkbox"
                  checked={checked.includes(index)}
                  onChange={() => toggleCheck(index)}
                  style={{ marginRight: '0.5rem' }}
                />
                {item.name} {item.quantity && `(${item.quantity})`}
                <button onClick={() => deleteIngredient(index)}>🗑️</button>
              </label>
            </li>
          ))}
        </ul>
      )}

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
        <button onClick={addIngredient}>➕ Ajouter</button>
      </div>
    </div>
  );
}

export default ShoppingList;
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ShoppingList.scss';

function ShoppingList() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '' });
  const token = localStorage.getItem('token');

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

    const toggleCheck = async (id) => {
        try {
            await axios.patch(`http://localhost:8010/api/shopping-list/${id}/check`, {}, {
            headers: { Authorization: `Bearer ${token}` }
            });

            setIngredients(prev =>
            prev.map(item =>
                item._id === id ? { ...item, checked: !item.checked } : item
            )
            );
        } catch (err) {
            console.error(err.response?.data?.message || 'Erreur de mise à jour');
        }
    };

    const deleteIngredient = async (id) => {
    try {
        await axios.delete(`http://localhost:8010/api/shopping-list/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        setIngredients(prev => prev.filter(item => item._id !== id));
    } catch (err) {
        console.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
    };

  const addIngredient = async () => {
    if (!newIngredient.name.trim()) return;

    try {
      const res = await axios.post('http://localhost:8010/api/shopping-list', newIngredient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngredients(prev => [...prev, res.data]);
      setNewIngredient({ name: '', quantity: '' });
    } catch (err) {
      console.error(err.response?.data?.message || 'Erreur lors de l’ajout');
    }
  };

  return (
    <div className="shopping-page">
      <div className="notepad">
        <h2>🛒 Liste de courses</h2>

        {ingredients.length === 0 ? (
          <p>Aucun ingrédient trouvé.</p>
        ) : (
          <ul className="ingredient-list">
            {ingredients.map((item) => (
                <li key={item._id} className={item.checked ? 'checked' : ''}>
                <button className="delete-btn" onClick={() => deleteIngredient(item._id)}>🗑</button>
                <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(item._id)}
                />
                <span>{item.name} {item.quantity && `- ${item.quantity}`}</span>
                </li>
            ))}
          </ul>
        )}

        <div className="actions">
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
          <button className="add-btn" onClick={addIngredient}>➕ Ajouter</button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;
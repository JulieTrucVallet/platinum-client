import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import "../styles/ShoppingList.scss";

function ShoppingList() {

  // Local states
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
  });
  const token = localStorage.getItem("token");

  // Load shopping list on mount
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await axios.get(`${API_URL}/shopping-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIngredients(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || "Error while loading");
      }
    };
    fetchIngredients();
  }, [token]);

  // Toggle item checked state
  const toggleCheck = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/shopping-list/${id}/check`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIngredients((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, checked: !item.checked } : item
        )
      );
    } catch (err) {
      console.error(err.response?.data?.message || "Update error");
    }
  };

  // Delete item from list
  const deleteIngredient = async (id) => {
    try {
      await axios.delete(`${API_URL}/shopping-list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIngredients((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || "Delete error");
    }
  };

  // Add a new item to the list
  const addIngredient = async () => {
    if (!newIngredient.name.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/shopping-list`,
        newIngredient,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIngredients((prev) => [...prev, res.data]);
      setNewIngredient({ name: "", quantity: "" });
    } catch (err) {
      console.error(err.response?.data?.message || "Add error");
    }
  };

  return (
    <main className="shopping-page">
      <section className="notepad">
        <header>
          <h2>🛒 Liste de courses</h2>
        </header>

        <section>
          {ingredients.length === 0 ? (
            <p>Pas d’ingrédient trouvé</p>
          ) : (
            <ul className="ingredient-list">
              {ingredients.map((item) => (
                <li key={item._id} className={item.checked ? "checked" : ""}>
                  <button
                    className="delete-btn"
                    onClick={() => deleteIngredient(item._id)}
                  >
                    🗑
                  </button>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(item._id)}
                  />
                  <span>
                    {item.name} {item.quantity && `- ${item.quantity}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="actions">
          <label htmlFor="ingredientName" className="sr-only">Nouvel ingrédient</label>
          <input
            id="ingredientName"
            type="text"
            placeholder="Nouvel ingrédient"
            value={newIngredient.name}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, name: e.target.value })
            }
          />

          <label htmlFor="ingredientQty" className="sr-only">Quantité</label>
          <input
            id="ingredientQty"
            type="text"
            placeholder="Quantité"
            value={newIngredient.quantity}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, quantity: e.target.value })
            }
          />

          <button className="add-btn" onClick={addIngredient}>
            Ajouter
          </button>
        </section>
      </section>
    </main>
  );
}

export default ShoppingList;
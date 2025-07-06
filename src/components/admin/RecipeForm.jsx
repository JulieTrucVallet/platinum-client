import { useEffect, useState } from 'react';

const RecipeForm = ({ initialData = {}, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [instructions, setInstructions] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    if (initialData.title) setTitle(initialData.title);
    if (initialData.ingredients) setIngredients(initialData.ingredients);
    if (initialData.instructions) setInstructions(initialData.instructions);
    if (initialData.duration) setDuration(initialData.duration);
    if (initialData.difficulty) setDifficulty(initialData.difficulty);
  }, [initialData]);

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, ingredients, instructions, duration, difficulty });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Titre</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Ingrédients</label>
      {ingredients.map((ing, index) => (
        <div key={index}>
          <input
            placeholder="Nom"
            value={ing.name}
            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            required
          />
          <input
            placeholder="Quantité"
            value={ing.quantity}
            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={addIngredient}>+ Ingrédient</button>

      <label>Instructions</label>
      <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required />

      <label>Durée (minutes)</label>
      <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />

      <label>Difficulté</label>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
        <option value="">Choisir...</option>
        <option value="Facile">Facile</option>
        <option value="Moyenne">Moyenne</option>
        <option value="Difficile">Difficile</option>
      </select>

      <button type="submit">Valider</button>
    </form>
  );
};

export default RecipeForm;
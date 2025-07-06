import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.scss';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:8010/api/recipes');
        setRecipes(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des recettes');
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    ingredients.every((ingredient) =>
      recipe.ingredients.some((ing) =>
        ing.name?.toLowerCase().includes(ingredient.toLowerCase())
      )
    )
  );

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Bienvenue sur <span>PLATINUM</span></h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Recherche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ajouter un ingrédient"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <button onClick={handleAddIngredient} className="btn-filter">Ajouter</button>
          <div className="ingredient-tags">
            {ingredients.map((ing, idx) => (
              <span key={idx} className="tag">
                {ing} <button onClick={() => handleRemoveIngredient(ing)}>x</button>
              </span>
            ))}
          </div>
          <Link to="/add" className="new-recipe-btn">Nouvelle Recette</Link>
        </div>
      </header>

      {error && <p className="error-msg">{error}</p>}

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div className="recipe-card" key={recipe._id}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="card-content">
              <p className="recipe-title">{recipe.title}</p>
              <p className="prep-time">Préparation : {recipe.duration} min</p>
              <Link to={`/recipes/${recipe._id}`} className="see-recipe">Voir la recette →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
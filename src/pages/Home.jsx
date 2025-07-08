import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.scss";

function Home() {
  const [recipes, setRecipes] = useState([]); // all recipes
  const [error, setError] = useState(""); // error message
  const [searchTerm, setSearchTerm] = useState(""); // text search
  const [ingredients, setIngredients] = useState([]); // list of ingredients to filter
  const [ingredientInput, setIngredientInput] = useState(""); // input value for ingredient filter

  useEffect(() => {
    // fetch all recipes from the API
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:8010/api/recipes");
        setRecipes(res.data);
      } catch (err) {
        setError("Erreur lors du chargement des recettes");
      }
    };

    fetchRecipes();
  }, []);

  // filter recipes by title and ingredients
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      ingredients.every((ingredient) =>
        recipe.ingredients.some((ing) =>
          ing.name?.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
  );

  // add an ingredient filter
  const handleAddIngredient = () => {
    if (
      ingredientInput.trim() &&
      !ingredients.includes(ingredientInput.trim())
    ) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  // remove an ingredient filter
  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>
          Bienvenue sur <span>PLATINUM</span>
        </h1>

        {/* Filters section */}
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
          <button onClick={handleAddIngredient} className="btn-filter">
            Ajouter
          </button>

          {/* Display added ingredient filters */}
          <div className="ingredient-tags">
            {ingredients.map((ing, idx) => (
              <span key={idx} className="tag">
                {ing}{" "}
                <button onClick={() => handleRemoveIngredient(ing)}>x</button>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Display error if needed */}
      {error && <p className="error-msg">{error}</p>}

      {/* Recipe cards */}
      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div className="recipe-card" key={recipe._id}>
            {recipe.image ? (
              <img
                src={`http://localhost:8010${recipe.image}`}
                alt={recipe.title}
              />
            ) : (
              <div className="no-image">
                <span>📷</span>
              </div>
            )}
            <div className="card-content">
              <p className="recipe-title">{recipe.title}</p>
              <p className="prep-time">Préparation : {recipe.duration} min</p>
              <Link to={`/recipes/${recipe._id}`} className="see-recipe">
                Voir la recette →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
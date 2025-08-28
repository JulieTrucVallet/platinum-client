import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/platinum-logo-slogan.png";
import { getRecipes } from "../services/RecipeService";
import "../styles/Home.scss";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getRecipes()
      .then((data) => {
        setRecipes(data);
        setFilteredRecipes(data);
      })
      .catch(() => setError("Erreur lors du chargement des recettes"));
  }, []);

  useEffect(() => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ingredients.length > 0) {
      filtered = filtered.filter((r) =>
        ingredients.every((ing) =>
          r.ingredients.some((ri) =>
            ri.name.toLowerCase().includes(ing.toLowerCase())
          )
        )
      );
    }

    setFilteredRecipes(filtered);
  }, [searchTerm, ingredients, recipes]);

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput)) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  return (
    <main className="home-page">
      <header className="home-header">
        <div className="home-title">
          <img src={logo} alt="Logo Platinum" className="home-logo" />
        </div>

        <section className="sticky-filters" aria-label="Filtres de recherche">
          <label htmlFor="searchInput" className="sr-only">
            Recherche par titre
          </label>
          <input
            id="searchInput"
            type="text"
            placeholder="Recherche par titre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="right-filters">
            <label htmlFor="ingredientInput" className="sr-only">
              Ajouter un ingrédient
            </label>
            <input
              id="ingredientInput"
              type="text"
              placeholder="Ajouter un ingrédient"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
            />
            <button onClick={handleAddIngredient} className="btn-filter">
              Ajouter
            </button>
          </div>

          <div className="ingredient-tags">
            {ingredients.map((ing, idx) => (
              <span key={idx} className="tag">
                {ing}{" "}
                <button onClick={() => handleRemoveIngredient(ing)}>×</button>
              </span>
            ))}
          </div>
        </section>
      </header>

      {error && (
        <p className="error-msg" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <section className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <article className="recipe-card" key={recipe._id}>
            {recipe.image ? (
              <img
                src={
                  recipe.image.startsWith("http")
                    ? recipe.image
                    : `${import.meta.env.VITE_UPLOADS_URL}${recipe.image}`
                }
                alt={`Illustration de la recette ${recipe.title}`}
                loading="lazy"
              />
            ) : (
              <div className="no-image" aria-label="Aucune image disponible">
                <span role="img" aria-hidden="true">
                  📷
                </span>
              </div>
            )}

            <div className="card-content">
              <h2 className="recipe-title">{recipe.title}</h2>
              <p className="prep-time">
                Préparation : {recipe.duration || "–"} min
              </p>
              <Link to={`/recipes/${recipe._id}`} className="see-recipe">
                Voir la recette →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
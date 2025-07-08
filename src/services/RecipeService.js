import axios from "axios";

// Base API URL for admin recipe endpoints
const API_URL = "http://localhost:8010/api/admin/recipes";

// Helper to get token from local storage
const getToken = () => {
  return localStorage.getItem("token");
};

// Configure request headers with authorization
const headers = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Object grouping all recipe-related API actions for the admin
const RecipeService = {
  // Get all recipes (admin only)
  getAll: async () => {
    const res = await axios.get(API_URL, headers());
    return res.data;
  },

  // Delete a recipe by ID (admin only)
  deleteRecipe: async (id) => {
    await axios.delete(`${API_URL}/${id}`, headers());
  },

  // Create a new recipe (admin only)
  createRecipe: async (recipeData) => {
    const res = await axios.post(API_URL, recipeData, headers());
    return res.data;
  },

  // Update an existing recipe (admin only)
  updateRecipe: async (id, updatedData) => {
    const res = await axios.put(`${API_URL}/${id}`, updatedData, headers());
    return res.data;
  },
};

// Fetch all recipe categories (public)
export const getCategories = async () => {
  const res = await axios.get("http://localhost:8010/api/categories");
  return res.data;
};

export default RecipeService;
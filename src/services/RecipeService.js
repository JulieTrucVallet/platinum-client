import http from "./http";

// Recipes API calls
export const getRecipes     = () => http.get("/recipes").then(r => r.data);
export const getRecipeById  = (id) => http.get(`/recipes/${id}`).then(r => r.data);
export const deleteRecipe   = (id) => http.delete(`/recipes/${id}`).then(r => r.data);

// Create recipe (supports JSON or FormData for image upload)
export const createRecipe = (data) => {
  if (data instanceof FormData) {
    return http.post("/recipes", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(r => r.data);
  }
  return http.post("/recipes", data).then(r => r.data);
};

// Update recipe (same logic as create)
export const updateRecipe = (id, data) => {
  if (data instanceof FormData) {
    return http.put(`/recipes/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(r => r.data);
  }
  return http.put(`/recipes/${id}`, data).then(r => r.data);
};

// Favorites
export const toggleFavorite = (id) => http.post(`/recipes/${id}/favorite`).then(r => r.data);
export const getFavorites   = () => http.get("/recipes/user/favorites").then(r => r.data);

// Categories
export const getCategories  = () => http.get("/categories").then(r => r.data);
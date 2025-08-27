import http from "./http";

export const getRecipes = () => http.get("/recipes").then(r => r.data);
export const getRecipeById = (id) => http.get(`/recipes/${id}`).then(r => r.data);
export const createRecipe = (formData) => http.post("/recipes", formData).then(r => r.data);
export const updateRecipe = (id, formData) => http.put(`/recipes/${id}`, formData).then(r => r.data);
export const deleteRecipe = (id) => http.delete(`/recipes/${id}`).then(r => r.data);

export const toggleFavorite = (id) => http.post(`/recipes/${id}/favorite`).then(r => r.data);
export const getFavorites = () => http.get("/recipes/user/favorites").then(r => r.data);

// si tu as les catégories :
export const getCategories = () => http.get("/categories").then(r => r.data);

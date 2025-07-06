import axios from 'axios';

const API_URL = 'http://localhost:8010/api/admin/recipes';

const getToken = () => {
  return localStorage.getItem('token');
};

const headers = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

const RecipeService = {
  getAll: async () => {
    const res = await axios.get(API_URL, headers());
    return res.data;
  },

  deleteRecipe: async (id) => {
    await axios.delete(`${API_URL}/${id}`, headers());
  },

  createRecipe: async (recipeData) => {
    const res = await axios.post(API_URL, recipeData, headers());
    return res.data;
  },

  updateRecipe: async (id, updatedData) => {
    const res = await axios.put(`${API_URL}/${id}`, updatedData, headers());
    return res.data;
  },
};

export default RecipeService;
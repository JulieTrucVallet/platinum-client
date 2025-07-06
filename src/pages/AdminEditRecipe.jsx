import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RecipeForm from '../components/admin/RecipeForm';
import RecipeService from '../services/RecipeService';

const AdminEditRecipe = () => {
  const { id } = useParams(); // récupère l'id de la recette dans l'URL
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les données de la recette
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipes = await RecipeService.getAll(); // ou une méthode getById si tu l’as
        const found = recipes.find((r) => r._id === id);
        if (found) {
          setInitialData(found);
        } else {
          alert('Recette introuvable');
          navigate('/admin');
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la recette :', err);
        alert('Erreur serveur');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await RecipeService.updateRecipe(id, formData);
      alert('Recette mise à jour !');
      navigate('/admin');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      alert('Erreur lors de la modification');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Modifier une recette</h2>
      <RecipeForm onSubmit={handleSubmit} initialData={initialData} />
    </div>
  );
};

export default AdminEditRecipe;
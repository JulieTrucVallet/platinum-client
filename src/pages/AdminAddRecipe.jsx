import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/admin/RecipeForm';
import RecipeService from '../services/RecipeService';

const AdminAddRecipe = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await RecipeService.createRecipe(formData);
      alert('Recette ajoutée avec succès !');
      navigate('/admin'); // redirection vers ton dashboard admin
    } catch (error) {
      console.error('Erreur lors de la création de la recette :', error);
      alert('Erreur lors de la création');
    }
  };

  return (
    <div>
      <h2>Ajouter une recette</h2>
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AdminAddRecipe;
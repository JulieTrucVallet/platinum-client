import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8010/api/recipes/user/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      }
    };

    fetchFavorites();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mes recettes favorites</h2>
      {favorites.length === 0 ? (
        <p>Pas encore de favoris...</p>
      ) : (
        favorites.map((r) => (
          <div key={r._id} style={{ marginBottom: '1rem' }}>
            <Link to={`/recipe/${r._id}`}>
              <h3>{r.title}</h3>
              {r.image && <img src={`http://localhost:8010${r.image}`} alt={r.title} style={{ maxWidth: '200px' }} />}
              <p>{r.description}</p>
              <p><strong>Auteur :</strong> {r.user?.username}</p>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Favorites;
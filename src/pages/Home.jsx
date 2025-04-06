import { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchBar } from '../components/SearchBar';
import { DestinationGrid } from '../components/DestinationGrid';
import { FavoritesBanner } from '../components/FavoritesBanner';
import { useFavorites } from '../hooks/useFavorites';

export const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('Sevilla'); // Valor inicial para demo
  const [isLoading, setIsLoading] = useState(false);
  const { favorites } = useFavorites();

  // Función para buscar destinos
  const searchDestinations = async (query) => {
    try {
      setIsLoading(true);
      
      // 1. Obtener imágenes de Unsplash
      const unsplashResponse = await axios.get(
        `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${import.meta.env.VITE_UNSPLASH_API_KEY}`
      );

      // 2. Mapear a formato de destino
      const destinationsData = unsplashResponse.data.results.map((img, index) => ({
        id: `unsplash-${img.id}-${index}`,
        name: query,
        image: img.urls.regular,
        country: 'Desconocido', // Podrías enriquecer estos datos con otra API
      }));

      setDestinations(destinationsData);
    } catch (error) {
      console.error('Error buscando destinos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para buscar al cargar y cuando cambia el término
  useEffect(() => {
    if (searchTerm.trim()) {
      searchDestinations(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Descubre Tu Próxima Aventura</h1>
          <p className="text-xl mb-8">Explora destinos increíbles alrededor del mundo</p>
          <SearchBar 
            onSearch={setSearchTerm} 
            initialValue={searchTerm}
          />
        </div>
      </header>

      {/* Favorites Banner */}
      {favorites.length > 0 && <FavoritesBanner count={favorites.length} />}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Buscando destinos...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              {destinations.length ? `Resultados para "${searchTerm}"` : 'No se encontraron resultados'}
            </h2>
            <DestinationGrid destinations={destinations} />
          </>
        )}
      </main>
    </div>
  );
};
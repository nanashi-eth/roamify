import { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchBar } from '../components/SearchBar';
import { DestinationGrid } from '../components/DestinationGrid';
import { FavoritesBanner } from '../components/FavoritesBanner';
import { useFavorites } from '../hooks/useFavorites';

export const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('Sevilla');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { favorites } = useFavorites();

  const fetchLocationData = async (location) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [weather, images, wiki] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`),
        axios.get(`https://api.unsplash.com/search/photos?page=1&query=${location.name}&client_id=${import.meta.env.VITE_UNSPLASH_API_KEY}`),
        axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location.name)}`)
      ]);

      // Validar respuestas
      if (!weather.data || !images.data || !wiki.data) {
        throw new Error('No se pudieron obtener todos los datos requeridos');
      }

      const newDestination = {
        id: `loc-${location.name}-${Date.now()}`,
        name: location.name,
        country: location.country,
        image: images.data.results[0]?.urls.regular || '',
        weather: {
          temp: weather.data.main.temp,
          description: weather.data.weather[0].description,
          icon: weather.data.weather[0].icon
        },
        wiki: {
          summary: wiki.data.extract,
          link: wiki.data.content_urls.desktop.page
        }
      };

      setDestinations([newDestination]);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchLocationData(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Descubre Tu Próxima Aventura</h1>
          <SearchBar 
            onSearch={setSelectedLocation} 
            initialValue={searchTerm}
            onInputChange={setSearchTerm}
          />
        </div>
      </header>

      {favorites.length > 0 && <FavoritesBanner count={favorites.length} />}

      <main className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Cargando información...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              {destinations.length ? `${destinations[0].name}, ${destinations[0].country}` : 'Busca un destino para comenzar'}
            </h2>
            <DestinationGrid destinations={destinations} />
          </>
        )}
      </main>
    </div>
  );
};
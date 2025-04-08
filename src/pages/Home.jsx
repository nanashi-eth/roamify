// pages/Home.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { SearchBar } from "../components/SearchBar";
import { DestinationGrid } from "../components/DestinationGrid";
import { FavoritesBanner } from "../components/FavoritesBanner";
import { useFavorites } from "../hooks/useFavorites";
import { searchLocations } from "../services/geocoding";

export const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { favorites } = useFavorites();

  const searchDestinations = async (location) => {
    if (!location) return;

    try {
      setIsLoading(true);

      // 1. Obtener imágenes de Unsplash con query mejorado
      const unsplashResponse = await axios.get(
        `https://api.unsplash.com/search/photos?page=1&query=${location.displayName}&client_id=${import.meta.env.VITE_UNSPLASH_API_KEY}`
      );

      // 2. Enriquecer datos con geolocalización
      const destinationsData = unsplashResponse.data.results.map(
        (img, index) => ({
          id: `unsplash-${img.id}-${index}`,
          name: location.name,
          image: img.urls.regular,
          country: location.country,
          state: location.state,
          coordinates: {
            lat: location.lat,
            lon: location.lon,
          },
        })
      );

      setDestinations(destinationsData);
    } catch (error) {
      console.error("Error buscando destinos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      const [defaultLocation] = await searchLocations("Sevilla");
      if (defaultLocation) {
        searchDestinations(defaultLocation);
      }
    };

    if (!selectedLocation) {
      fetchInitial();
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Descubre Tu Próxima Aventura
          </h1>
          <SearchBar
            onSearch={(location) => {
              setSelectedLocation(location);
              searchDestinations(location);
            }}
            initialValue="Sevilla, ES"
          />
        </div>
      </header>

      {favorites.length > 0 && <FavoritesBanner count={favorites.length} />}

      <main className="max-w-6xl mx-auto p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Cargando información...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              {destinations.length
                ? `${destinations[0].name}, ${destinations[0].country}`
                : "Busca un destino para comenzar"}
            </h2>
            <DestinationGrid destinations={destinations} />
          </>
        )}
      </main>
    </div>
  );
};

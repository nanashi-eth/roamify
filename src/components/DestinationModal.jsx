// DestinationModal.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const DestinationModal = ({ destination, onClose }) => {
  const [weather, setWeather] = useState(null);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener clima
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${destination.name}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        setWeather(weatherResponse.data);

        // Obtener imágenes
        const unsplashResponse = await axios.get(
          `https://api.unsplash.com/search/photos?query=${destination.name}&client_id=${import.meta.env.VITE_UNSPLASH_API_KEY}`
        );
        setImages(unsplashResponse.data.results.slice(0, 4));

        // Obtener descripción
        const wikiResponse = await axios.get(
          `https://es.wikipedia.org/api/rest_v1/page/summary/${destination.name}`
        );
        setDescription(wikiResponse.data.extract);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [destination.name]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{destination.name}</h2>
            <button onClick={onClose} className="p-2 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Galería de imágenes */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {images.map((image) => (
              <img
                key={image.id}
                src={image.urls.regular}
                alt={image.alt_description}
                className="h-48 w-full object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Información del clima */}
          {weather && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Clima Actual</h3>
              <div className="flex items-center gap-4">
                <img 
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                  alt="Weather icon" 
                  className="h-16 w-16"
                />
                <div>
                  <p className="text-2xl">{Math.round(weather.main.temp)}°C</p>
                  <p className="text-gray-600">{weather.weather[0].description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Descripción */}
          {description && (
            <div className="prose">
              <h3 className="text-lg font-semibold mb-2">Sobre {destination.name}</h3>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
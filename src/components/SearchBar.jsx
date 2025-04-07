import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export const SearchBar = ({ onSearch, initialValue = '', onInputChange }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const fetchLocations = async (query) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      
      return response.data.map(loc => ({
        name: loc.name,
        country: loc.country,
        lat: loc.lat,
        lon: loc.lon
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (inputValue.trim().length > 2) {
        setIsLoadingSuggestions(true);
        const results = await fetchLocations(inputValue);
        setSuggestions(results);
        setIsLoadingSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue]);

  const handleSelect = (location) => {
    setInputValue(`${location.name}, ${location.country}`);
    onSearch(location);
    setSuggestions([]);
    onInputChange(location.name);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onInputChange(e.target.value);
        }}
        placeholder="Escribe un destino (ej: Tokyo, Roma)..."
        className="w-full p-4 pr-12 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      />
      <MagnifyingGlassIcon className="h-6 w-6 absolute right-4 top-4 text-gray-400" />
      
      {(suggestions.length > 0 || isLoadingSuggestions) && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {isLoadingSuggestions ? (
            <div className="p-3 text-gray-500">Buscando ubicaciones...</div>
          ) : (
            suggestions.map((location, index) => (
              <div
                key={index}
                onClick={() => handleSelect(location)}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-gray-500">{location.country}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
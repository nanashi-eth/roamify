// components/SearchBar.jsx
import { useState, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchLocations } from '../services/geocoding';

export const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Debounce unificado para todas las peticiones
  const handleSearch = (value) => {
    clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(async () => {
      if (value.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const locations = await searchLocations(value);
        setSuggestions(locations);
        
        // Autobúsqueda si hay una coincidencia exacta
        const exactMatch = locations.find(
          loc => loc.displayName.toLowerCase() === value.toLowerCase()
        );
        
        if (exactMatch) {
          onSearch(exactMatch);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 400); // Tiempo único de debounce
  };

  const handleChange = (value) => {
    setInputValue(value);
    handleSearch(value);
  };

  const handleSelect = (location) => {
    clearTimeout(timeoutRef.current); // Cancelar debounce pendiente
    setInputValue(location.displayName);
    onSearch(location);
    setSuggestions([]);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Escribe un destino (ej: Tokyo, Roma)..."
        className="w-full p-4 pr-12 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      />
      <MagnifyingGlassIcon className="h-6 w-6 absolute right-4 top-4 text-gray-400" />
      
      {(suggestions.length > 0 || isLoading) && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg text-black">
          {isLoading ? (
            <div className="p-2 text-gray-500">Buscando...</div>
          ) : (
            suggestions.map((location) => (
              <div
                key={`${location.lat}-${location.lon}`}
                onClick={() => handleSelect(location)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              >
                {location.displayName}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
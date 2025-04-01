import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  // Debounce para evitar múltiples búsquedas
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <div className="relative max-w-xl mx-auto">
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Escribe un destino (ej: Tokyo, Roma)..."
        className="w-full p-4 pr-12 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      />
      <MagnifyingGlassIcon className="h-6 w-6 absolute right-4 top-4 text-gray-400" />
    </div>
  );
};
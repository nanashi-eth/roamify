// DestinationCard.jsx
import { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { DestinationModal } from '../components/DestinationModal';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export const DestinationCard = ({ destination }) => {
  const [showModal, setShowModal] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === destination.id);

  const handleFavorite = () => {
    isFavorite ? removeFavorite(destination.id) : addFavorite(destination);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="h-48 w-full object-cover cursor-pointer"
          onClick={() => setShowModal(true)}
        />
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">{destination.name}</h3>
          <button 
            onClick={handleFavorite}
            className="p-2 hover:text-red-500 transition-colors"
          >
            {isFavorite ? (
              <HeartSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {showModal && (
        <DestinationModal 
          destination={destination} 
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
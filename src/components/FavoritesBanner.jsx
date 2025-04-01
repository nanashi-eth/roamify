import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';

export const FavoritesBanner = ({ count }) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <HeartIcon className="h-6 w-6" />
        <p>
          Tienes {count} destino{count > 1 ? 's' : ''} en favoritos. 
          <Link to="/favorites" className="ml-2 font-semibold hover:underline">
            Ver favoritos →
          </Link>
        </p>
      </div>
    </div>
  );
};
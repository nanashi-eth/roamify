import { useFavorites } from '../hooks/useFavorites';
import { DestinationGrid } from '../components/DestinationGrid';

export const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Tus Destinos Favoritos</h1>
      <DestinationGrid destinations={favorites} />
    </div>
  );
};
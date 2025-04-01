// DestinationGrid.jsx
import { DestinationCard } from "./DestinationCard";

export const DestinationGrid = ({ destinations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
};

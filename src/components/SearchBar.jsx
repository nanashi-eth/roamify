import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SearchBar = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar destinos..."
        className="w-full p-4 rounded-lg shadow-lg"
      />
      <MagnifyingGlassIcon className="h-6 w-6 absolute right-4 top-4 text-gray-400" />
    </div>
  );
};

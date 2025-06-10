import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

type UsersSearchProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
};

export const UsersSearch = ({ searchTerm, setSearchTerm, isLoading }: UsersSearchProps) => {
  const clearSearch = () => setSearchTerm("");

  return (
    <div className="max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-base-content/40" />
        </div>

        <input
          type="text"
          placeholder="Search by address, GitHub, X, or location..."
          className="input input-bordered w-full pl-10 pr-10 bg-base-100 border-base-300 focus:border-primary transition-colors"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content transition-colors"
            disabled={isLoading}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {searchTerm && (
        <p className="text-center text-sm text-base-content/60 mt-2">Searching for &quot;{searchTerm}&quot;</p>
      )}
    </div>
  );
};

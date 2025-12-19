import { Search, X } from 'lucide-react';
import CustomSelect from './CustomSelect';

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  speciesFilter: string;
  setSpeciesFilter: (species: string) => void;
  breedFilter: string;
  setBreedFilter: (breed: string) => void;
  ageFilter: string;
  setAgeFilter: (age: string) => void;
  availableSpecies: string[];
  availableBreeds: string[];
}

export default function Filters({
  searchQuery,
  setSearchQuery,
  speciesFilter,
  setSpeciesFilter,
  breedFilter,
  setBreedFilter,
  ageFilter,
  setAgeFilter,
  availableSpecies,
  availableBreeds,
}: FiltersProps) {
  const speciesOptions = [
    { value: "", label: "All Species" },
    ...availableSpecies.map(species => ({ value: species, label: species }))
  ];

  const breedOptions = [
    { value: "", label: "All Breeds" },
    ...availableBreeds.map(breed => ({ value: breed, label: breed }))
  ];

  const ageOptions = [
    { value: "", label: "All Ages" },
    { value: "0-2", label: "0-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6+", label: "6+ years" }
  ];
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filters</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search by Name or Breed
          </label>
          <div className="relative gap-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pets by name or breed"
              className="h-10 pl-12 pr-12 w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
            Species
          </label>
          <CustomSelect
            value={speciesFilter}
            onChange={setSpeciesFilter}
            options={speciesOptions}
          />
        </div>

        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
            Breed
          </label>
          <CustomSelect
            value={breedFilter}
            onChange={setBreedFilter}
            options={breedOptions}
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age Range
          </label>
          <CustomSelect
            value={ageFilter}
            onChange={setAgeFilter}
            options={ageOptions}
          />
        </div>
      </div>
    </div>
  );
}

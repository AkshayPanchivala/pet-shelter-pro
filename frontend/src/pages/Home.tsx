import { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPets } from '../store/slices/petSlice';
import PetCard from '../components/PetCard';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const dispatch = useAppDispatch();
  const { pets, isLoading } = useAppSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const availableSpecies = useMemo(() => {
    return Array.from(new Set(pets.map((pet) => pet.species))).sort();
  }, [pets]);

  const availableBreeds = useMemo(() => {
    return Array.from(new Set(pets.map((pet) => pet.breed))).sort();
  }, [pets]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecies = !speciesFilter || pet.species === speciesFilter;
      const matchesBreed = !breedFilter || pet.breed === breedFilter;

      let matchesAge = true;
      if (ageFilter === '0-2') {
        matchesAge = pet.age >= 0 && pet.age <= 2;
      } else if (ageFilter === '3-5') {
        matchesAge = pet.age >= 3 && pet.age <= 5;
      } else if (ageFilter === '6+') {
        matchesAge = pet.age >= 6;
      }

      return matchesSearch && matchesSpecies && matchesBreed && matchesAge;
    });
  }, [pets, searchQuery, speciesFilter, breedFilter, ageFilter]);

  const totalPages = Math.ceil(filteredPets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPets = filteredPets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pets...</p>
        </div>
      </div>
    );
  }


  return (
    <div className=" bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Companion</h1>
          <p className="text-xl">
            Browse available pets ready to join your family.
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py2">
        <Filters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          speciesFilter={speciesFilter}
          setSpeciesFilter={setSpeciesFilter}
          breedFilter={breedFilter}
          setBreedFilter={setBreedFilter}
          ageFilter={ageFilter}
          setAgeFilter={setAgeFilter}
          availableSpecies={availableSpecies}
          availableBreeds={availableBreeds}
        />

        <div className="mb-4 text-gray-600">
          Showing {paginatedPets.length} of {filteredPets.length} pets
        </div>

        {paginatedPets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              No pets found matching your criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

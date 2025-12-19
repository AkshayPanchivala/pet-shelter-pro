import { Link } from 'react-router-dom';
import { PawPrint, Award, Calendar } from 'lucide-react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Adopted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Link
      to={`/pets/${pet.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            pet.status
          )}`}
        >
          {pet.status ==='Adopted' ? pet.status :'Available' }
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{pet.name}</h3>

        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <PawPrint className="h-3.5 w-3.5 text-emerald-600" />
            <span>{pet.species}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-emerald-600" />
            <span>{pet.breed}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            <span>{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4">
          {pet.description.length > 25
            ? `${pet.description.substring(0, 50)}...`
            : pet.description}
        </p>

        <button className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors">
          View Details
        </button>
      </div>
    </Link>
  );
}

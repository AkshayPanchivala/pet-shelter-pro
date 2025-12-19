import api from './api';
import { Pet } from '../types';

interface PetsResponse {
  pets: Pet[];
}

interface PetResponse {
  pet: Pet;
}

interface CreatePetData {
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  image: string;
  status: 'Available' | 'Pending' | 'Adopted';
}

// Get all pets
export const getAllPets = async (): Promise<PetsResponse> => {
  const response = await api.get<PetsResponse>('/pets');
  return response.data;
};

// Get single pet by ID
export const getPetById = async (id: string): Promise<PetResponse> => {
  const response = await api.get<PetResponse>(`/pets/${id}`);
  return response.data;
};

// Create new pet (Admin only)
export const createPet = async (petData: CreatePetData): Promise<PetResponse> => {
  const response = await api.post<PetResponse>('/pets', petData);
  return response.data;
};

// Update pet (Admin only)
export const updatePet = async (id: string, petData: Partial<CreatePetData>): Promise<PetResponse> => {
  const response = await api.put<PetResponse>(`/pets/${id}`, petData);
  return response.data;
};

// Delete pet (Admin only)
export const deletePet = async (id: string): Promise<void> => {
  await api.delete(`/pets/${id}`);
};

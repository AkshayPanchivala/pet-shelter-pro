export type UserRole = 'visitor' | 'user' | 'admin';

export type PetStatus = 'Available' | 'Pending' | 'Adopted';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  image: string;
  status: PetStatus;
  createdAt?: string;
}

export interface Application {
  id: string;
  petId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  petName?: string;
  status: ApplicationStatus;
  message: string;
  reviewedBy?: string;
  reviewedByName?: string;
  createdAt?: string;
}

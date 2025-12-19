import api from './api';
import { Application, ApplicationStatus } from '../types';

interface ApplicationsResponse {
  applications: Application[];
}

interface ApplicationResponse {
  application: Application;
}

interface CreateApplicationData {
  petId: string;
  message: string;
}

// Get all applications (Admin only)
export const getAllApplications = async (): Promise<ApplicationsResponse> => {
  const response = await api.get<ApplicationsResponse>('/applications');
  return response.data;
};

// Get user's applications
export const getUserApplications = async (): Promise<ApplicationsResponse> => {
  const response = await api.get<ApplicationsResponse>('/applications/my');
  return response.data;
};

// Get applications for a pet (Admin only)
export const getPetApplications = async (petId: string): Promise<ApplicationsResponse> => {
  const response = await api.get<ApplicationsResponse>(`/applications/pet/${petId}`);
  return response.data;
};

// Create new application
export const createApplication = async (applicationData: CreateApplicationData): Promise<ApplicationResponse> => {
  const response = await api.post<ApplicationResponse>('/applications', applicationData);
  return response.data;
};

// Update application status (Admin only)
export const updateApplicationStatus = async (id: string, status: ApplicationStatus): Promise<ApplicationResponse> => {
  const response = await api.patch<ApplicationResponse>(`/applications/${id}/status`, { status });
  return response.data;
};

// Delete application
export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};

import { apiClient } from './client';
import { Doctor } from './types';

/**
 * Doctor API Functions
 */

/**
 * Get all doctors with optional filters
 * 
 * ENDPOINT: GET /api/doctors?hospitalId={id}&specialization={spec}
 * 
 * WHY OPTIONAL PARAMS: Same endpoint handles multiple use cases
 */
export const getDoctors = async (filters?: {
  hospitalId?: number;
  specialization?: string;
}): Promise<Doctor[]> => {
  const response = await apiClient.get<Doctor[]>('/doctors', {
    params: filters
  });
  return response.data;
};

/**
 * Get doctor by ID
 * 
 * ENDPOINT: GET /api/doctors/{id}
 */
export const getDoctorById = async (id: number): Promise<Doctor> => {
  const response = await apiClient.get<Doctor>(`/doctors/${id}`);
  return response.data;
};

/**
 * Get all specializations (for dropdown filter)
 * 
 * ENDPOINT: GET /api/doctors/specializations
 * RETURNS: ["Cardiology", "Dermatology", ...]
 */
export const getSpecializations = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/doctors/specializations');
  return response.data;
};
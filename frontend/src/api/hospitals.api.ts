import { apiClient } from './client';
import { Hospital } from './types';

/**
 * Hospital API Functions
 * 
 * WHY SEPARATE FILE: Keep API calls organized by domain
 * PATTERN: Each function returns a Promise with typed data
 */

/**
 * Get all hospitals
 * 
 * ENDPOINT: GET /api/hospitals
 */
export const getAllHospitals = async (): Promise<Hospital[]> => {
  const response = await apiClient.get<Hospital[]>('/hospitals');
  return response.data;
};

/**
 * Get hospital by ID
 * 
 * ENDPOINT: GET /api/hospitals/{id}
 */
export const getHospitalById = async (id: number): Promise<Hospital> => {
  const response = await apiClient.get<Hospital>(`/hospitals/${id}`);
  return response.data;
};

/**
 * Get hospitals by city
 * 
 * ENDPOINT: GET /api/hospitals/city/{city}
 */
export const getHospitalsByCity = async (city: string): Promise<Hospital[]> => {
  const response = await apiClient.get<Hospital[]>(`/hospitals/city/${city}`);
  return response.data;
};

/**
 * Search hospitals by name
 * 
 * ENDPOINT: GET /api/hospitals/search?name={name}
 */
export const searchHospitals = async (name: string): Promise<Hospital[]> => {
  const response = await apiClient.get<Hospital[]>('/hospitals/search', {
    params: { name }
  });
  return response.data;
};
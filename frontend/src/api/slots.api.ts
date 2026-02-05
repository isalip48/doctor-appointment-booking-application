import { apiClient } from './client';
import { Slot, SlotSearchRequest } from './types';

/**
 * Slot API Functions
 */

/**
 * Search slots with filters
 * 
 * ENDPOINT: POST /api/slots/search
 * 
 * WHY POST: Complex search criteria, cleaner as JSON body
 */
export const searchSlots = async (searchRequest: SlotSearchRequest): Promise<Slot[]> => {
  const response = await apiClient.post<Slot[]>('/slots/search', searchRequest);
  return response.data;
};

/**
 * Get all available slots (no filters)
 * 
 * ENDPOINT: GET /api/slots
 * 
 * WARNING: Can return a lot of data in production
 */
export const getAllAvailableSlots = async (): Promise<Slot[]> => {
  const response = await apiClient.get<Slot[]>('/slots');
  return response.data;
};

/**
 * Get slots for a specific doctor
 * 
 * ENDPOINT: GET /api/slots/doctor/{doctorId}
 */
export const getSlotsByDoctor = async (doctorId: number): Promise<Slot[]> => {
  const response = await apiClient.get<Slot[]>(`/slots/doctor/${doctorId}`);
  return response.data;
};
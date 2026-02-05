import { apiClient } from './client';
import { Booking, BookingRequest } from './types';

/**
 * Booking API Functions
 */

/**
 * Create a new booking
 * 
 * ENDPOINT: POST /api/bookings
 * 
 * MUTATION: Changes server state
 */
export const createBooking = async (request: BookingRequest): Promise<Booking> => {
  const response = await apiClient.post<Booking>('/bookings', request);
  return response.data;
};

/**
 * Get all bookings for a user
 * 
 * ENDPOINT: GET /api/bookings/user/{userId}
 */
export const getUserBookings = async (userId: number): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>(`/bookings/user/${userId}`);
  return response.data;
};

/**
 * Get upcoming bookings for a user
 * 
 * ENDPOINT: GET /api/bookings/user/{userId}/upcoming
 */
export const getUpcomingBookings = async (userId: number): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>(`/bookings/user/${userId}/upcoming`);
  return response.data;
};

/**
 * Get past bookings for a user
 * 
 * ENDPOINT: GET /api/bookings/user/{userId}/past
 */
export const getPastBookings = async (userId: number): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>(`/bookings/user/${userId}/past`);
  return response.data;
};

/**
 * Cancel a booking
 * 
 * ENDPOINT: DELETE /api/bookings/{bookingId}/cancel?userId={userId}
 * 
 * MUTATION: Changes server state (cancels booking, frees slot)
 */
export const cancelBooking = async (bookingId: number, userId: number): Promise<Booking> => {
  const response = await apiClient.delete<Booking>(`/bookings/${bookingId}/cancel`, {
    params: { userId }
  });
  return response.data;
};

/**
 * Get single booking details
 * 
 * ENDPOINT: GET /api/bookings/{id}
 */
export const getBookingById = async (bookingId: number): Promise<Booking> => {
  const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
  return response.data;
};
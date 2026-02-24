import { apiClient } from './client';
import { Booking, BookingRequest, BookingLookupRequest } from './types';

/**
 * Booking API Functions - UPDATED for Guest Bookings
 */

/**
 * Create a new booking (GUEST BOOKING)
 * 
 * ENDPOINT: POST /api/bookings
 * 
 * NEW: No userId required, includes user details in request
 */
export const createBooking = async (request: BookingRequest): Promise<Booking> => {
  const response = await apiClient.post<Booking>('/bookings', request);
  return response.data;
};

/**
 * NEW: Get bookings by phone number and NIC
 * 
 * ENDPOINT: GET /api/bookings/lookup?phoneNumber={phone}&nic={nic}
 * 
 * USE CASE: Guest users checking their bookings
 */
export const getBookingsByPhoneAndNic = async (
  phoneNumber: string, 
  nic: string
): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/bookings/lookup', {
    params: { phoneNumber, nic }
  });
  return response.data;
};

/**
 * NEW: Get upcoming bookings by phone and NIC
 * 
 * ENDPOINT: GET /api/bookings/lookup/upcoming?phoneNumber={phone}&nic={nic}
 */
export const getUpcomingBookingsByPhoneAndNic = async (
  phoneNumber: string,
  nic: string
): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/bookings/lookup/upcoming', {
    params: { phoneNumber, nic }
  });
  return response.data;
};

/**
 * Cancel a booking (UPDATED - verify with phone + NIC)
 * 
 * ENDPOINT: DELETE /api/bookings/{bookingId}/cancel?phoneNumber={phone}&nic={nic}
 */
export const cancelBooking = async (
  bookingId: number, 
  phoneNumber: string,
  nic: string
): Promise<Booking> => {
  const response = await apiClient.delete<Booking>(`/bookings/${bookingId}/cancel`, {
    params: { phoneNumber, nic }
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

import { useQuery } from '@tanstack/react-query';
import { 
  getUserBookings, 
  getUpcomingBookings, 
  getPastBookings,
  getBookingById 
} from '@/api/bookings.api';

/**
 * React Query Hooks for Bookings
 */

/**
 * Get all bookings for a user
 * 
 * USAGE:
 * const { data: bookings } = useUserBookings(userId);
 */
export const useUserBookings = (userId: number) => {
  return useQuery({
    queryKey: ['bookings', 'user', userId],
    queryFn: () => getUserBookings(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds (bookings can change)
  });
};

/**
 * Get upcoming bookings
 * 
 * USAGE:
 * const { data: upcoming } = useUpcomingBookings(userId);
 */
export const useUpcomingBookings = (userId: number) => {
  return useQuery({
    queryKey: ['bookings', 'upcoming', userId],
    queryFn: () => getUpcomingBookings(userId),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
};

/**
 * Get past bookings
 * 
 * USAGE:
 * const { data: past } = usePastBookings(userId);
 */
export const usePastBookings = (userId: number) => {
  return useQuery({
    queryKey: ['bookings', 'past', userId],
    queryFn: () => getPastBookings(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes (past bookings don't change)
  });
};

/**
 * Get single booking details
 * 
 * USAGE:
 * const { data: booking } = useBooking(bookingId);
 */
export const useBooking = (bookingId: number) => {
  return useQuery({
    queryKey: ['bookings', 'detail', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000,
  });
};
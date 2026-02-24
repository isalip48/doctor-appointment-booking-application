import { useQuery } from '@tanstack/react-query';
import { 
  getBookingsByPhoneAndNic,
  getUpcomingBookingsByPhoneAndNic,
  getBookingById 
} from '@/api/bookings.api';

/**
 * React Query Hooks for Bookings - UPDATED for Guest Bookings
 */

/**
 * Get all bookings by phone and NIC
 * 
 * USAGE:
 * const { data: bookings } = useGuestBookings('0771234567', '123456789V');
 */
export const useGuestBookings = (phoneNumber: string, nic: string) => {
  return useQuery({
    queryKey: ['bookings', 'guest', phoneNumber, nic],
    queryFn: () => getBookingsByPhoneAndNic(phoneNumber, nic),
    enabled: !!phoneNumber && !!nic && phoneNumber.length >= 10 && nic.length >= 9,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Get upcoming bookings by phone and NIC
 * 
 * USAGE:
 * const { data: upcoming } = useUpcomingGuestBookings('0771234567', '123456789V');
 */
export const useUpcomingGuestBookings = (phoneNumber: string, nic: string) => {
  return useQuery({
    queryKey: ['bookings', 'upcoming', 'guest', phoneNumber, nic],
    queryFn: () => getUpcomingBookingsByPhoneAndNic(phoneNumber, nic),
    enabled: !!phoneNumber && !!nic && phoneNumber.length >= 10 && nic.length >= 9,
    staleTime: 30 * 1000,
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
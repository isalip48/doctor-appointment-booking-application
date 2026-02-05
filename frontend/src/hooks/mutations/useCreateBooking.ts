import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '@/api/bookings.api';
import { BookingRequest } from '@/api/types';
import { Alert } from 'react-native';

/**
 * Create Booking Mutation
 * 
 * WHY MUTATION:
 * - Changes server state (creates booking)
 * - Invalidates queries to refetch fresh data
 * - Handles success/error states
 * 
 * USAGE:
 * const { mutate: book, isLoading } = useCreateBooking();
 * 
 * book({ slotId: 123, userId: 45 }, {
 *   onSuccess: (booking) => {
 *     Alert.alert('Success', 'Booking confirmed!');
 *   }
 * });
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookingRequest) => createBooking(request),
    
    /**
     * onSuccess: Runs when mutation succeeds
     * 
     * IMPORTANT: Invalidate related queries to refetch fresh data
     * - User's bookings list needs to update
     * - Slot availability changed, so invalidate slot searches
     */
    onSuccess: (data, variables) => {
      // Invalidate user's bookings
      queryClient.invalidateQueries({ 
        queryKey: ['bookings', 'user', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['bookings', 'upcoming', variables.userId] 
      });
      
      // Invalidate slot searches (availability changed)
      queryClient.invalidateQueries({ 
        queryKey: ['slots'] 
      });
      
      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your appointment is confirmed for ${data.appointmentDate} at ${data.appointmentTime}`
      );
    },
    
    /**
     * onError: Runs when mutation fails
     */
    onError: (error: any) => {
      const errorMessage = error.response?.data || error.message || 'Booking failed';
      Alert.alert('Booking Failed', errorMessage);
    },
  });
};
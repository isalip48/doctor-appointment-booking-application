import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking } from '@/api/bookings.api';
import { Alert } from 'react-native';

/**
 * Cancel Booking Mutation
 * 
 * USAGE:
 * const { mutate: cancel } = useCancelBooking();
 * 
 * cancel({ bookingId: 123, userId: 45 });
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, userId }: { bookingId: number; userId: number }) => 
      cancelBooking(bookingId, userId),
    
    onSuccess: (data, variables) => {
      // Invalidate user's bookings
      queryClient.invalidateQueries({ 
        queryKey: ['bookings', 'user', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['bookings', 'upcoming', variables.userId] 
      });
      
      // Invalidate slots (slot became available again)
      queryClient.invalidateQueries({ 
        queryKey: ['slots'] 
      });
      
      Alert.alert('Cancelled', 'Your booking has been cancelled');
    },
    
    onError: (error: any) => {
      const errorMessage = error.response?.data || error.message || 'Cancellation failed';
      Alert.alert('Error', errorMessage);
    },
  });
};
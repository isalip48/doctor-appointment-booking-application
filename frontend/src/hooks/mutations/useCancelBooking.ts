import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking } from '@/api/bookings.api';
import { Alert } from 'react-native';

/**
 * Cancel Booking Mutation - UPDATED
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      bookingId, 
      phoneNumber, 
      nic 
    }: { 
      bookingId: number; 
      phoneNumber: string;
      nic: string;
    }) => cancelBooking(bookingId, phoneNumber, nic),
    
    onSuccess: () => {
      // Invalidate bookings queries
      queryClient.invalidateQueries({ 
        queryKey: ['bookings'] 
      });
      
      // Invalidate slots (slot became available again)
      queryClient.invalidateQueries({ 
        queryKey: ['slots'] 
      });
      
      Alert.alert('Cancelled', 'Your booking has been cancelled successfully');
    },
    
    onError: (error: any) => {
      const errorMessage = error.response?.data || error.message || 'Cancellation failed';
      Alert.alert('Error', errorMessage);
    },
  });
};
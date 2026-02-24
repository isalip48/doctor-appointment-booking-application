import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '@/api/bookings.api';
import { BookingRequest } from '@/api/types';
import { Alert } from 'react-native';

/**
 * Create Booking Mutation - UPDATED for Guest Bookings
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookingRequest) => {
      console.log('🚀 Creating booking:', request);
      return createBooking(request);
    },
    
    onSuccess: (data) => {
      console.log('✅ Booking created:', data);
      
      // Invalidate all slot queries (availability changed)
      queryClient.invalidateQueries({ 
        queryKey: ['slots'] 
      });
      
      // No need to invalidate user bookings since we're using phone+NIC lookup
      
      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your appointment is confirmed for ${data.appointmentDate} at ${data.appointmentTime}\n\n` +
        `Doctor: ${data.doctor.name}\n` +
        `Hospital: ${data.hospital.name}\n\n` +
        `To view your bookings, use your phone number and NIC.`,
        [{ text: 'OK' }]
      );
    },
    
    onError: (error: any) => {
      console.error('❌ Booking failed:', error);
      const errorMessage = error.response?.data || error.message || 'Booking failed';
      Alert.alert('Booking Failed', errorMessage);
    },
  });
};
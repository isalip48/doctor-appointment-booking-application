import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Booking } from '@/api/types';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
  showCancelButton?: boolean;
}

/**
 * Booking Card Component
 * 
 * DISPLAYS:
 * - Appointment date & time
 * - Doctor & hospital info
 * - Booking status
 * - Cancel button (optional)
 */
const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onCancel,
  showCancelButton = false 
}) => {
  // Status color mapping
  const getStatusColor = () => {
    switch (booking.status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <View className="bg-white p-4 m-2 rounded-xl shadow-sm border border-gray-200">
      {/* Appointment Date & Time */}
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-xl font-bold text-gray-800">
            {booking.appointmentTime}
          </Text>
          <Text className="text-gray-600">
            📅 {booking.appointmentDate}
          </Text>
        </View>
        
        {/* Status Badge */}
        <View className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
          <Text className="font-bold text-sm">
            {booking.status}
          </Text>
        </View>
      </View>
      
      {/* Divider */}
      <View className="h-[1px] bg-gray-200 my-2" />
      
      {/* Doctor Info */}
      <Text className="text-gray-800 font-bold mb-1">
        👨‍⚕️ {booking.doctor.name}
      </Text>
      <Text className="text-gray-600 text-sm mb-2">
        {booking.doctor.specialization}
      </Text>
      
      {/* Hospital Info */}
      <Text className="text-gray-600 text-sm mb-2">
        🏥 {booking.hospital.name}
      </Text>
      
      {/* Patient Notes */}
      {booking.patientNotes && (
        <View className="bg-blue-50 p-2 rounded mt-2">
          <Text className="text-gray-700 text-sm">
            📝 Note: {booking.patientNotes}
          </Text>
        </View>
      )}
      
      {/* Amount Paid */}
      {booking.amountPaid && (
        <Text className="text-gray-700 text-sm mt-2">
          💰 Paid: LKR {booking.amountPaid.toLocaleString()}
        </Text>
      )}
      
      {/* Booking Time */}
      <Text className="text-gray-500 text-xs mt-2">
        Booked on: {booking.bookingTime}
      </Text>
      
      {/* Cancel Button */}
      {showCancelButton && booking.status === 'CONFIRMED' && onCancel && (
        <TouchableOpacity
          onPress={() => onCancel(booking)}
          className="bg-red-500 p-3 rounded-lg mt-3"
        >
          <Text className="text-white text-center font-bold">
            Cancel Booking
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BookingCard;
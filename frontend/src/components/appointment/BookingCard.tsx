import React from 'react';
import { View, Text } from 'react-native';
import { Booking } from '@/types/appointment';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  // Determine status color logic
  const isConfirmed = booking.status === 'CONFIRMED';

  return (
    <View className="bg-white p-5 m-2 rounded-2xl shadow-sm border border-slate-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          {/* Doctor Info */}
          <Text className="text-xl font-bold text-slate-900">
            {booking.doctor?.name || 'Unknown Doctor'}
          </Text>
          {/* Hospital Info - New! */}
          <Text className="text-slate-500 text-sm font-medium mt-1">
            {booking.hospital?.name || 'General Hospital'}
          </Text>
        </View>

        {/* Status Badge */}
        <View className={`px-3 py-1 rounded-full ${isConfirmed ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`text-xs font-bold ${isConfirmed ? 'text-green-700' : 'text-red-700'}`}>
            {booking.status}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-slate-100 my-4" />

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-slate-400 text-xs uppercase font-bold tracking-wider">Date & Time</Text>
          <Text className="text-slate-800 font-semibold mt-1">
            {booking.appointmentDate}  •  {booking.appointmentTime}
          </Text>
        </View>

        {/* Optional: Add a small indicator for booking ID or notes */}
        <View className="items-end">
          <Text className="text-slate-400 text-xs uppercase font-bold tracking-wider">Booking Ref</Text>
          <Text className="text-slate-600 font-medium mt-1">#{booking.id}</Text>
        </View>
      </View>

      {booking.patientNotes && (
        <View className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <Text className="text-slate-500 text-xs italic">" {booking.patientNotes} "</Text>
        </View>
      )}
    </View>
  );
};

export default BookingCard;
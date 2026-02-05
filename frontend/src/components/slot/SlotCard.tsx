import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Slot } from '@/api/types';

interface SlotCardProps {
  slot: Slot;
  onPress: (slot: Slot) => void;
}

/**
 * Slot Card Component
 * 
 * SHOWS:
 * - Time slot
 * - Doctor name
 * - Hospital name
 * - Availability status
 * - Available slots count
 */
const SlotCard: React.FC<SlotCardProps> = ({ slot, onPress }) => {
  const isAvailable = slot.isAvailable && slot.availableSlots > 0;
  
  return (
    <TouchableOpacity
      onPress={() => onPress(slot)}
      disabled={!isAvailable}
      className={`p-4 m-2 rounded-xl shadow-sm border-l-4 ${
        isAvailable 
          ? 'bg-white border-green-500' 
          : 'bg-gray-100 border-gray-400'
      }`}
    >
      {/* Date & Time */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-xl font-bold text-gray-800">
            {slot.startTime} - {slot.endTime}
          </Text>
          <Text className="text-gray-600 text-sm">
            📅 {slot.slotDate}
          </Text>
        </View>
        
        {/* Availability Badge */}
        <View className={`px-3 py-1 rounded-full ${
          isAvailable ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Text className={`font-bold text-sm ${
            isAvailable ? 'text-green-700' : 'text-red-700'
          }`}>
            {isAvailable ? `${slot.availableSlots} Available` : 'Fully Booked'}
          </Text>
        </View>
      </View>
      
      {/* Doctor */}
      <Text className="text-gray-800 font-medium mb-1">
        👨‍⚕️ {slot.doctor.name}
      </Text>
      <Text className="text-gray-600 text-sm mb-1">
        {slot.doctor.specialization}
      </Text>
      
      {/* Hospital */}
      <Text className="text-gray-600 text-sm">
        🏥 {slot.hospital.name}
      </Text>
      
      {/* Booking hint */}
      {isAvailable && (
        <Text className="text-green-600 text-sm mt-2 font-medium">
          Tap to book →
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SlotCard;
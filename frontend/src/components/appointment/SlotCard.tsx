import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Slot } from '@/types/appointment';

interface SlotCardProps {
  slot: Slot;
  onPress: (slot: Slot) => void;
  isLoading?: boolean;
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, onPress, isLoading }) => {
  return (
    <View className="bg-white p-5 rounded-3xl mb-4 border border-slate-100 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-emerald-600 font-bold text-xs uppercase mb-1">
            {slot.doctor.specialization}
          </Text>
          <Text className="text-xl font-bold text-slate-900">{slot.doctor.name}</Text>
          <Text className="text-slate-500 text-sm mt-1">{slot.doctor.hospital?.name}</Text>
        </View>
        <View className="bg-indigo-50 px-4 py-2 rounded-2xl">
          <Text className="text-indigo-600 font-bold text-lg">{slot.time}</Text>
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => onPress(slot)}
        disabled={slot.isBooked || isLoading}
        className={`mt-4 py-4 rounded-2xl items-center ${slot.isBooked ? 'bg-slate-100' : 'bg-indigo-600'}`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className={`font-bold ${slot.isBooked ? 'text-slate-400' : 'text-white'}`}>
            {slot.isBooked ? 'Unavailable' : 'Confirm Booking'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SlotCard;
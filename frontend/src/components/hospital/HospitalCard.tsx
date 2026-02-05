import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Hospital } from '@/api/types';

interface HospitalCardProps {
  hospital: Hospital;
  onPress: (hospital: Hospital) => void;
}

/**
 * Hospital Card Component
 * 
 * WHY SEPARATE COMPONENT:
 * - Reusable across different screens
 * - Consistent styling
 * - Easy to modify once, updates everywhere
 */
const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(hospital)}
      className="bg-white p-4 m-2 rounded-xl shadow-sm border border-gray-200"
    >
      {/* Hospital Name */}
      <Text className="text-xl font-bold text-gray-800 mb-2">
        {hospital.name}
      </Text>
      
      {/* Address */}
      <View className="flex-row items-center mb-1">
        <Text className="text-gray-600">📍 {hospital.address}</Text>
      </View>
      
      {/* City */}
      <View className="flex-row items-center mb-1">
        <Text className="text-gray-600">🏙️ {hospital.city}</Text>
      </View>
      
      {/* Phone */}
      {hospital.phoneNumber && (
        <View className="flex-row items-center">
          <Text className="text-gray-600">📞 {hospital.phoneNumber}</Text>
        </View>
      )}
      
      {/* Tap to view doctors hint */}
      <Text className="text-indigo-600 text-sm mt-2 font-medium">
        Tap to view doctors →
      </Text>
    </TouchableOpacity>
  );
};

export default HospitalCard;
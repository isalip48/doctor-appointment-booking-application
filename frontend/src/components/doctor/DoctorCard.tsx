import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Doctor } from '@/api/types';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
}

/**
 * Doctor Card Component
 */
const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(doctor)}
      className="bg-white p-4 m-2 rounded-xl shadow-sm border-l-4 border-indigo-600"
    >
      {/* Doctor Name & Specialization */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            {doctor.name}
          </Text>
          <Text className="text-indigo-600 font-medium">
            {doctor.specialization}
          </Text>
        </View>
        
        {/* Consultation Fee */}
        {doctor.consultationFee && (
          <View className="bg-green-50 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-bold">
              LKR {doctor.consultationFee.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
      
      {/* Qualifications */}
      {doctor.qualifications && (
        <Text className="text-gray-600 text-sm mb-1">
          🎓 {doctor.qualifications}
        </Text>
      )}
      
      {/* Experience */}
      {doctor.experienceYears && (
        <Text className="text-gray-600 text-sm mb-1">
          ⏱️ {doctor.experienceYears} years experience
        </Text>
      )}
      
      {/* Hospital */}
      <Text className="text-gray-600 text-sm">
        🏥 {doctor.hospital.name}
      </Text>
      
      {/* Action hint */}
      <Text className="text-indigo-600 text-sm mt-2 font-medium">
        Tap to view available slots →
      </Text>
    </TouchableOpacity>
  );
};

export default DoctorCard;
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SpecializationSelectorProps {
  specializations?: string[];
  selectedSpecialization: string;
  onSelect: (spec: string) => void;
}

const SpecializationSelector: React.FC<SpecializationSelectorProps> = ({
  specializations,
  selectedSpecialization,
  onSelect,
}) => {
  return (
    <View className="px-4 mb-6">
      <View className="bg-white rounded-2xl shadow-sm p-4">
        <Text className="text-gray-700 font-semibold mb-3">
          Select Specialization
        </Text>
        <View className="flex-row flex-wrap">
          {specializations?.map((spec) => (
            <TouchableOpacity
              key={spec}
              onPress={() => onSelect(spec)}
              className={`px-4 py-2 rounded-full m-1 ${
                selectedSpecialization === spec ? 'bg-indigo-600' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedSpecialization === spec ? 'text-white' : 'text-gray-700'
                }`}
              >
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SpecializationSelector;
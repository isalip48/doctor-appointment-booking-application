import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SpecializationFilterProps {
  specializations?: string[];
  selectedSpecialization?: string;
  onSelect: (spec?: string) => void;
}

const SpecializationFilter: React.FC<SpecializationFilterProps> = ({
  specializations,
  selectedSpecialization,
  onSelect,
}) => {
  return (
    <View className="bg-white p-3 m-2 rounded-lg">
      <Text className="text-sm font-bold text-gray-700 mb-2">
        Filter by Specialization:
      </Text>
      <View className="flex-row flex-wrap">
        <TouchableOpacity
          onPress={() => onSelect(undefined)}
          className={`px-4 py-2 rounded-full m-1 ${
            !selectedSpecialization ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Text
            className={
              !selectedSpecialization ? 'text-white font-bold' : 'text-gray-700'
            }
          >
            All
          </Text>
        </TouchableOpacity>

        {specializations?.map((spec) => (
          <TouchableOpacity
            key={spec}
            onPress={() => onSelect(spec)}
            className={`px-4 py-2 rounded-full m-1 ${
              selectedSpecialization === spec ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <Text
              className={
                selectedSpecialization === spec
                  ? 'text-white font-bold'
                  : 'text-gray-700'
              }
            >
              {spec}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SpecializationFilter;
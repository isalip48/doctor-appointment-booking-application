import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SearchTypeToggleProps {
  searchType: 'name' | 'specialization';
  onToggle: (type: 'name' | 'specialization') => void;
}

const SearchTypeToggle: React.FC<SearchTypeToggleProps> = ({ searchType, onToggle }) => {
  return (
    <View className="p-4">
      <View className="flex-row bg-white rounded-full p-1 shadow-sm">
        <TouchableOpacity
          onPress={() => onToggle('name')}
          className={`flex-1 py-4 rounded-full ${
            searchType === 'name' ? 'bg-indigo-600' : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-center font-bold ${
              searchType === 'name' ? 'text-white' : 'text-gray-600'
            }`}
          >
            By Name
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onToggle('specialization')}
          className={`flex-1 py-3 rounded-xl ${
            searchType === 'specialization' ? 'bg-indigo-600' : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-center font-bold ${
              searchType === 'specialization' ? 'text-white' : 'text-gray-600'
            }`}
          >
            By Specialty
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchTypeToggle;
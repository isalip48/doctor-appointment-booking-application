import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface NameSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

const NameSearch: React.FC<NameSearchProps> = ({ value, onChangeText }) => {
  return (
    <View className="px-4 mb-6">
      <View className="bg-white rounded-2xl shadow-sm p-4">
        <Text className="text-gray-700 font-semibold mb-2">Doctor's Name</Text>
        <TextInput
          placeholder="Enter doctor's name..."
          value={value}
          onChangeText={onChangeText}
          className="bg-gray-50 p-4 rounded-xl text-gray-800 text-base"
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
};

export default NameSearch;
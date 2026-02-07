import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📭', title, subtitle }) => {
  return (
    <View className="flex-1 justify-center items-center p-10">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-gray-800 font-bold text-lg mb-2">{title}</Text>
      {subtitle && (
        <Text className="text-gray-600 text-center">{subtitle}</Text>
      )}
    </View>
  );
};

export default EmptyState;
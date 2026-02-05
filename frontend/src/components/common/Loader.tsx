import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

interface LoaderProps {
  message?: string;
}

/**
 * Loading Indicator Component
 */
const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => (
  <View className="flex-1 justify-center items-center bg-gray-100">
    <ActivityIndicator size="large" color="#4F46E5" />
    <Text className="text-gray-600 mt-4">{message}</Text>
  </View>
);

export default Loader;
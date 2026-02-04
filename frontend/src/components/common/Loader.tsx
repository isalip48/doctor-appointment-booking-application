import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const Loader = () => (
  <View className="flex-1 justify-center items-center bg-gray-100">
    <ActivityIndicator size="large" color="#4F46E5" />
  </View>
);

export default Loader;
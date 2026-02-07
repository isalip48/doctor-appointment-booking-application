import React from 'react';
import { View, Text } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View className="bg-white p-4 shadow-sm">
      <Text className="text-2xl font-bold text-gray-800">{title}</Text>
      {subtitle && <Text className="text-gray-600 mt-1">{subtitle}</Text>}
    </View>
  );
};

export default Header;
import React from 'react';
import { View, Text } from 'react-native';

const InfoCard: React.FC = () => {
  return (
    <View className="px-4 mb-6">
      <View className="bg-blue-50 p-4 rounded-2xl">
        <Text className="text-blue-900 font-semibold mb-1">ℹ️ How it works</Text>
        <Text className="text-blue-800 text-sm">
          • Each doctor has 30 slots per day{'\n'}
          • 10 minutes per consultation{'\n'}
          • Book the next available time slot
        </Text>
      </View>
    </View>
  );
};

export default InfoCard;
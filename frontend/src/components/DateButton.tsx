import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface DateButtonProps {
  day: string;
  dateNum: string;
  month: string;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
}

const DateButton: React.FC<DateButtonProps> = ({
  day,
  dateNum,
  month,
  isSelected,
  isToday,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginRight: 12,
        padding: 16,
        borderRadius: 16,
        width: 80,
        alignItems: 'center',
        backgroundColor: isSelected ? '#4F46E5' : '#F9FAFB',
        shadowColor: isSelected ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isSelected ? 0.3 : 0,
        shadowRadius: isSelected ? 8 : 0,
        elevation: isSelected ? 8 : 0,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '500',
          color: isSelected ? '#FFFFFF' : '#6B7280',
        }}
      >
        {day}
      </Text>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginVertical: 4,
          color: isSelected ? '#FFFFFF' : '#1F2937',
        }}
      >
        {dateNum}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: isSelected ? 'rgba(255,255,255,0.8)' : '#6B7280',
        }}
      >
        {month}
      </Text>
      {isToday && (
        <View
          style={{
            marginTop: 4,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 9999,
            backgroundColor: '#FBBF24',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: '#1F2937',
            }}
          >
            Today
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DateButton;
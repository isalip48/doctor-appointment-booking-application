import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { format, addDays } from 'date-fns';
import DateButton from '@/components/DateButton';
import { isWeb } from '@/utils/platform';

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  daysToShow?: number;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
  daysToShow = 30,
}) => {
  const dates = useMemo(() => {
    const days = [];
    for (let i = 0; i < daysToShow; i++) {
      const date = addDays(new Date(), i);
      days.push({
        date: format(date, 'yyyy-MM-dd'),
        day: format(date, 'EEE'),
        dateNum: format(date, 'd'),
        month: format(date, 'MMM'),
        isToday: i === 0,
      });
    }
    return days;
  }, [daysToShow]);

  // Web Layout - Grid
  if (isWeb) {
    return (
      <View className="px-4 mb-6">
        <View className="bg-white rounded-2xl shadow-sm p-4">
          <Text className="text-gray-700 font-semibold mb-3">Select Date</Text>

          <View className="flex-row flex-wrap gap-2">
            {dates.map((day) => {
              const isSelected = selectedDate === day.date;
              return (
                <TouchableOpacity
                  key={day.date}
                  onPress={() => onSelectDate(day.date)}
                  className={`px-4 py-3 rounded-xl min-w-[90px] items-center ${
                    isSelected ? 'bg-indigo-600 shadow-lg' : 'bg-gray-50'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {day.day}
                  </Text>
                  <Text
                    className={`text-2xl font-bold my-1 ${
                      isSelected ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {day.dateNum}
                  </Text>
                  <Text
                    className={`text-xs ${
                      isSelected ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {day.month}
                  </Text>
                  {day.isToday && (
                    <View className="mt-1 px-2 py-0.5 rounded-full bg-yellow-400">
                      <Text className="text-xs font-bold text-gray-800">Today</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  // Mobile/Native Layout - Horizontal Scroll with DateButton
  return (
    <View className="px-4 mb-6">
      <View className="bg-white rounded-2xl shadow-sm p-4">
        <Text className="text-gray-700 font-semibold mb-3">Select Date</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {dates.map((day) => (
            <DateButton
              key={day.date}
              day={day.day}
              dateNum={day.dateNum}
              month={day.month}
              isSelected={selectedDate === day.date}
              isToday={day.isToday}
              onPress={() => onSelectDate(day.date)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default DateSelector;
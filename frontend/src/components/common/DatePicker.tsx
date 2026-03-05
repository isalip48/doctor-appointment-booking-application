import React from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";

interface DatePickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  isWeb: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate,
  isWeb,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#E2E8F0",
        overflow: "hidden",
      }}
    >
      <Calendar
        key={selectedDate} // ⭐ prevents navigation crash
        current={selectedDate}
        minDate={today}
        onDayPress={(day) => {
          console.log("Date selected:", day.dateString);
          onSelectDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#4F46E5",
          },
        }}
        theme={{
          todayTextColor: "#4F46E5",
          arrowColor: "#4F46E5",
          selectedDayBackgroundColor: "#4F46E5",
          selectedDayTextColor: "#ffffff",
          textDayFontSize: isWeb ? 14 : 12,
          textMonthFontSize: isWeb ? 16 : 14,
          textDayHeaderFontSize: isWeb ? 12 : 10,
          textDayFontWeight: "600",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "600",
        }}
        style={{
          height: isWeb ? 340 : 310,
        }}
      />
    </View>
  );
};

export default DatePicker;
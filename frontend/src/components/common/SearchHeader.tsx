import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface SearchHeaderProps {
  doctorName: string;
  setDoctorName: (name: string) => void;
  selectedDate: Date; // Changed to Date object
  onDateChange: (date: Date) => void;
  onSearch: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  doctorName,
  setDoctorName,
  selectedDate,
  onDateChange,
  onSearch,
}) => {
  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    setShow(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    if (date) {
      onDateChange(date);
    }
  };

  return (
    <View className="bg-indigo-600 p-6 rounded-b-[40px] shadow-2xl pt-12">
      <Text className="text-white text-3xl font-bold mb-6">Find Your Doctor</Text>
      
      {/* Doctor Name Input */}
      <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl mb-4">
        <Ionicons name="search" size={20} color="#6366f1" />
        <TextInput
          placeholder="Doctor's name..."
          className="flex-1 ml-3 text-slate-800"
          value={doctorName}
          onChangeText={setDoctorName}
        />
      </View>

      <View className="flex-row space-x-3">
        {/* Date Selector */}
        <TouchableOpacity 
          onPress={() => setShow(true)}
          className="flex-1 bg-indigo-500 flex-row items-center px-4 py-4 rounded-2xl border border-indigo-400"
        >
          <Ionicons name="calendar-outline" size={20} color="white" />
          <View className="ml-3">
            <Text className="text-indigo-200 text-[10px] uppercase font-bold">Date</Text>
            <Text className="text-white font-semibold">{selectedDate.toDateString()}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSearch} className="bg-white px-6 rounded-2xl justify-center">
          <Text className="text-indigo-600 font-bold">Search</Text>
        </TouchableOpacity>
      </View>

      {show && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={new Date()} // Prevent booking in the past
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default SearchHeader;
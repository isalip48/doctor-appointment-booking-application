import React, { useState } from 'react';
import { View, FlatList, Text, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSlotSearch } from '@/hooks/queries/useSlots';
import { useCreateBooking } from '@/hooks/mutations/useCreateBooking';
import SlotCard from '@/components/slot/SlotCard';
import Loader from '@/components/common/Loader';
import Button from '@/components/common/Button';
import { Slot } from '@/api/types';
import { format, addDays } from 'date-fns';

/**
 * Slot Search Screen
 * 
 * FEATURES:
 * - Search slots by date
 * - Filter by doctor/hospital (passed from previous screen)
 * - Book slot with confirmation
 * - Date selector (next 7 days)
 */
const SlotSearchScreen = ({ route, navigation }: any) => {
  const { doctorId, doctorName, hospitalId, hospitalName } = route.params || {};
  
  // Default to today
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Fetch slots
  const { data: slots, isLoading } = useSlotSearch({
    doctorId,
    hospitalId,
    date: selectedDate,
  });
  
  // Book mutation
  const { mutate: book, isPending: isBooking } = useCreateBooking();
  
  /**
   * Handle slot booking
   * 
   * TODO: Get actual user ID (from auth context)
   * For now, hardcode user ID 1
   */
  const handleSlotPress = (slot: Slot) => {
    Alert.alert(
      'Confirm Booking',
      `Book appointment with ${slot.doctor.name} at ${slot.startTime} on ${slot.slotDate}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book',
          onPress: () => {
            book({
              slotId: slot.id,
              userId: 1, // TODO: Get from auth context
              patientNotes: '',
            }, {
              onSuccess: () => {
                navigation.navigate('MyBookings');
              }
            });
          },
        },
      ]
    );
  };
  
  /**
   * Generate next 7 days for date selector
   */
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      days.push({
        date: format(date, 'yyyy-MM-dd'),
        display: format(date, 'EEE, MMM d'),
        isToday: i === 0,
      });
    }
    return days;
  };

  if (isLoading) return <Loader message="Searching slots..." />;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">
          {doctorName || 'All Doctors'}
        </Text>
        {hospitalName && (
          <Text className="text-gray-600">{hospitalName}</Text>
        )}
      </View>

      {/* Date Selector */}
      <View className="bg-white p-3 m-2 rounded-lg">
        <Text className="text-sm font-bold text-gray-700 mb-2">
          Select Date:
        </Text>
        <FlatList
          horizontal
          data={getNext7Days()}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedDate(item.date)}
              className={`px-4 py-3 rounded-lg m-1 ${
                selectedDate === item.date ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <Text className={`text-center font-bold ${
                selectedDate === item.date ? 'text-white' : 'text-gray-700'
              }`}>
                {item.display}
              </Text>
              {item.isToday && (
                <Text className={`text-xs text-center ${
                  selectedDate === item.date ? 'text-white' : 'text-gray-500'
                }`}>
                  Today
                </Text>
              )}
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Slot List */}
      <FlatList
        data={slots || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SlotCard slot={item} onPress={handleSlotPress} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-10">
            <Text className="text-gray-500 text-center">
              No available slots for {selectedDate}
            </Text>
          </View>
        }
      />

      {/* View Bookings Button */}
      <Button
        title="View My Bookings"
        onPress={() => navigation.navigate('MyBookings')}
        variant="secondary"
      />
    </SafeAreaView>
  );
};

export default SlotSearchScreen;
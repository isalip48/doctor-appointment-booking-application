import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from '@/types/appointment';
import { getMyBookings } from '@/api/appointment.api';
import BookingCard from '@/components/appointment/BookingCard';
import Loader from '@/components/common/Loader';

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 bg-white shadow-sm mb-2">
        <Text className="text-2xl font-bold text-gray-800">My Appointments</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <BookingCard booking={{
          id: item.id,
          slotId: item.id,
          patientName: "You",
          doctorName: item.doctor.name,
          time: item.time,
          status: "CONFIRMED"
        }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text className="text-center mt-10 text-gray-500">No bookings found</Text>}
      />
    </SafeAreaView>
  );
};

export default MyBookingsScreen;

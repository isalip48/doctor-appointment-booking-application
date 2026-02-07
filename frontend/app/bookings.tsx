import React, { useState } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserBookings, useUpcomingBookings, usePastBookings } from '@/hooks/queries/useBookings';
import { useCancelBooking } from '@/hooks/mutations/useCancelBooking';
import BookingCard from '@/components/booking/BookingCard';
import Loader from '@/components/common/Loader';
import { Booking } from '@/api/types';
import { TouchableOpacity } from 'react-native';

/**
 * My Bookings Screen
 * 
 * FEATURES:
 * - View all bookings
 * - Filter: All / Upcoming / Past
 * - Cancel confirmed bookings
 */
const MyBookingsScreen = () => {
  // TODO: Get actual user ID from auth context
  const userId = 1;
  
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  
  // Fetch bookings based on filter
  const { data: allBookings, isLoading: loadingAll } = useUserBookings(userId);
  const { data: upcomingBookings, isLoading: loadingUpcoming } = useUpcomingBookings(userId);
  const { data: pastBookings, isLoading: loadingPast } = usePastBookings(userId);
  
  // Cancel mutation
  const { mutate: cancel } = useCancelBooking();
  
  // Determine which data to show
  const getBookings = () => {
    switch (filter) {
      case 'upcoming':
        return upcomingBookings;
      case 'past':
        return pastBookings;
      default:
        return allBookings;
    }
  };
  
  const getLoading = () => {
    switch (filter) {
      case 'upcoming':
        return loadingUpcoming;
      case 'past':
        return loadingPast;
      default:
        return loadingAll;
    }
  };
  
  const bookings = getBookings();
  const isLoading = getLoading();
  
  /**
   * Handle booking cancellation
   */
  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your appointment on ${booking.appointmentDate} at ${booking.appointmentTime}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancel({ bookingId: booking.id, userId });
          },
        },
      ]
    );
  };

  if (isLoading) return <Loader message="Loading bookings..." />;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">
          My Appointments
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white p-3 m-2 rounded-lg flex-row justify-around">
        <TouchableOpacity
          onPress={() => setFilter('upcoming')}
          className={`px-6 py-2 rounded-full ${
            filter === 'upcoming' ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Text className={filter === 'upcoming' ? 'text-white font-bold' : 'text-gray-700'}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setFilter('all')}
          className={`px-6 py-2 rounded-full ${
            filter === 'all' ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Text className={filter === 'all' ? 'text-white font-bold' : 'text-gray-700'}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setFilter('past')}
          className={`px-6 py-2 rounded-full ${
            filter === 'past' ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Text className={filter === 'past' ? 'text-white font-bold' : 'text-gray-700'}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onCancel={handleCancelBooking}
            showCancelButton={filter === 'upcoming'}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-10">
            <Text className="text-gray-500 text-center text-lg">
              {filter === 'upcoming' && 'No upcoming appointments'}
              {filter === 'past' && 'No past appointments'}
              {filter === 'all' && 'No bookings yet'}
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Book your first appointment!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default MyBookingsScreen;
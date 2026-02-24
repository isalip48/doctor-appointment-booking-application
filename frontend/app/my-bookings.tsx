import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGuestBookings, useUpcomingGuestBookings } from '@/hooks/queries/useBookings';
import { useCancelBooking } from '@/hooks/mutations/useCancelBooking';
import BookingCard from '@/components/booking/BookingCard';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { Booking } from '@/api/types';

export default function MyBookingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Pre-fill from params if coming from booking flow
  const [phoneNumber, setPhoneNumber] = useState(
    (params.phoneNumber as string) || ''
  );
  const [nic, setNic] = useState((params.nic as string) || '');
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming'>('upcoming');

  // Only fetch when user has entered credentials
  const shouldFetch = phoneNumber.length >= 10 && nic.length >= 9 && hasSearched;

  const { data: allBookings, isLoading: loadingAll, error: errorAll } = useGuestBookings(
    phoneNumber,
    nic
  );
  
  const { data: upcomingBookings, isLoading: loadingUpcoming, error: errorUpcoming } = 
    useUpcomingGuestBookings(phoneNumber, nic);

  const { mutate: cancel } = useCancelBooking();

  const bookings = filter === 'upcoming' ? upcomingBookings : allBookings;
  const isLoading = filter === 'upcoming' ? loadingUpcoming : loadingAll;
  const error = filter === 'upcoming' ? errorUpcoming : errorAll;

  const handleSearch = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }
    if (nic.length < 9) {
      Alert.alert('Invalid NIC', 'Please enter a valid NIC number');
      return;
    }
    setHasSearched(true);
  };

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
            cancel({ bookingId: booking.id, phoneNumber, nic });
          },
        },
      ]
    );
  };

  // If not searched yet, show lookup form
  if (!hasSearched) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-indigo-600 p-6 rounded-b-3xl mt-12 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-3">
            <Text className="text-white text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">My Appointments</Text>
          <Text className="text-white/80 text-sm mt-1">
            Enter your details to view bookings
          </Text>
        </View>

        <View className="px-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Enter Your Details
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Phone Number
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="0771234567"
                keyboardType="phone-pad"
                className="bg-gray-50 p-4 rounded-xl text-gray-800"
                maxLength={10}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">
                NIC Number
              </Text>
              <TextInput
                value={nic}
                onChangeText={setNic}
                placeholder="123456789V or 199012345678"
                className="bg-gray-50 p-4 rounded-xl text-gray-800"
                maxLength={12}
              />
            </View>

            <TouchableOpacity
              onPress={handleSearch}
              className="bg-indigo-600 p-4 rounded-xl"
            >
              <Text className="text-white text-center font-bold text-base">
                View My Bookings
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-blue-50 p-4 rounded-xl mt-4">
            <Text className="text-blue-900 font-semibold mb-1">
              ℹ️ Privacy Note
            </Text>
            <Text className="text-blue-800 text-sm">
              Your phone number and NIC are used only to retrieve your bookings.
              We don't store or share this information.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Show loading
  if (isLoading && shouldFetch) {
    return <Loader message="Loading your bookings..." />;
  }

  // Show error
  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-6">
        <Text className="text-6xl mb-4">😔</Text>
        <Text className="text-gray-800 font-bold text-lg mb-2 text-center">
          No Bookings Found
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          No bookings found for this phone number and NIC combination.
        </Text>
        <TouchableOpacity
          onPress={() => setHasSearched(false)}
          className="bg-indigo-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show bookings
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-indigo-600 p-6 rounded-b-3xl mt-12">
        <TouchableOpacity 
          onPress={() => setHasSearched(false)} 
          className="mb-3"
        >
          <Text className="text-white text-base">← Change Details</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">My Appointments</Text>
        <Text className="text-white/80 text-sm mt-1">
          Phone: {phoneNumber}
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
          <Text
            className={
              filter === 'upcoming' ? 'text-white font-bold' : 'text-gray-700'
            }
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('all')}
          className={`px-6 py-2 rounded-full ${
            filter === 'all' ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Text
            className={filter === 'all' ? 'text-white font-bold' : 'text-gray-700'}
          >
            All
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
          <EmptyState
            icon="📅"
            title={
              filter === 'upcoming'
                ? 'No upcoming appointments'
                : 'No bookings yet'
            }
            subtitle="Book your first appointment!"
          />
        }
      />
    </View>
  );
}
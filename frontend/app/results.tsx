import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { apiClient } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Slot } from "@/api/types";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isWeb } from "@/utils/platform";

const SlotResultsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const searchQuery = typeof params.searchQuery === 'string' ? params.searchQuery : '';
  const searchType = typeof params.searchType === 'string' ? params.searchType : 'name';
  const selectedDate = typeof params.selectedDate === 'string' ? params.selectedDate : '';

  // Fetch slots
  const { data: slots, isLoading } = useQuery({
    queryKey: ["slots", "search", searchQuery, searchType, selectedDate],
    queryFn: async () => {
      console.log('🔍 Searching slots:', { searchQuery, searchType, selectedDate });
      const response = await apiClient.get<Slot[]>("/slots/search", {
        params: {
          query: searchQuery,
          date: selectedDate,
          type: searchType,
        },
      });
      return response.data;
    },
    enabled: !!searchQuery && !!selectedDate,
  });

  // NEW: Navigate to booking form instead of direct booking
  const handleBookSlot = (slot: Slot) => {
    router.push({
      pathname: '/booking-details',
      params: {
        slot: JSON.stringify(slot),
      },
    });
  };

  if (isLoading) return <Loader message="Searching available slots..." />;

  // Web Layout
  if (isWeb) {
    return (
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          <View className="max-w-6xl mx-auto w-full px-6 py-8">
            {/* Header */}
            <View className="mb-6">
              <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Text className="text-indigo-600 text-lg font-semibold">
                  ← Back
                </Text>
              </TouchableOpacity>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Available Slots
              </h1>
              <p className="text-gray-600 text-lg">
                {selectedDate} • {searchQuery}
              </p>
            </View>

            {/* Slots Grid */}
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots && slots.length > 0 ? (
                slots.map((slot) => (
                  <ModernSlotCard
                    key={slot.id}
                    slot={slot}
                    onBook={handleBookSlot}
                  />
                ))
              ) : (
                <View className="col-span-full">
                  <EmptyState
                    icon="😔"
                    title="No Slots Available"
                    subtitle="Try searching for a different date or doctor"
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Mobile/Native Layout
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#4F46E5", "#7C3AED"]}
        className="p-6 rounded-b-3xl mb-4"
      >
        <TouchableOpacity onPress={() => router.back()} className="mb-3">
          <Text className="text-white text-base">← Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Available Slots</Text>
        <Text className="text-white/80 text-sm mt-1">
          {selectedDate} • {searchQuery}
        </Text>
      </LinearGradient>

      {/* Slots List */}
      <FlatList
        data={slots || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ModernSlotCard slot={item} onBook={handleBookSlot} />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <EmptyState
            icon="😔"
            title="No Slots Available"
            subtitle="Try searching for a different date or doctor"
          />
        }
      />
    </SafeAreaView>
  );
};

/**
 * Modern Slot Card Component - UPDATED
 * 
 * REMOVED: isBooking prop (no longer booking directly)
 * CHANGED: Button navigates to booking form
 */
const ModernSlotCard = ({
  slot,
  onBook,
}: {
  slot: Slot;
  onBook: (slot: Slot) => void;
}) => {
  const isAvailable = slot.isAvailable && slot.remainingSlots > 0;

  return (
    <View className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
      <View className={`h-2 ${isAvailable ? "bg-green-500" : "bg-red-500"}`} />

      <View className="p-5">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {slot.doctor.name}
            </Text>
            <Text className="text-indigo-600 font-medium mb-2">
              {slot.doctor.specialization}
            </Text>
            <Text className="text-gray-600 text-sm">
              📍 {slot.hospital.name}
            </Text>
          </View>

          <View
            className={`px-3 py-1 rounded-full ${
              isAvailable ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Text
              className={`font-bold text-sm ${
                isAvailable ? "text-green-700" : "text-red-700"
              }`}
            >
              {isAvailable ? `${slot.remainingSlots} left` : "Full"}
            </Text>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600 text-sm">Next Available:</Text>
            <Text className="text-gray-800 font-bold text-lg">
              {slot.nextAvailableTime}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600 text-sm">Consultation Time:</Text>
            <Text className="text-gray-800 font-medium">
              {slot.minutesPerPatient} minutes
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="items-center">
            <Text className="text-gray-500 text-xs">Start Time</Text>
            <Text className="text-gray-800 font-bold">
              {slot.consultationStartTime}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-gray-500 text-xs">Bookings</Text>
            <Text className="text-gray-800 font-bold">
              {slot.currentBookings}/{slot.maxBookingsPerDay}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-gray-500 text-xs">Est. End</Text>
            <Text className="text-gray-800 font-bold">
              {slot.estimatedEndTime}
            </Text>
          </View>
        </View>

        {/* Updated Button - Navigates to form instead of direct booking */}
        {isAvailable ? (
          <TouchableOpacity
            onPress={() => onBook(slot)}
            className="bg-indigo-600 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-base">
              Book Appointment
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-200 p-4 rounded-xl">
            <Text className="text-gray-500 text-center font-bold">
              Fully Booked
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SlotResultsScreen;
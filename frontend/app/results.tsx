import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { apiClient } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Slot } from "@/api/types";
import Loader from "@/components/common/Loader";
import { useCreateBooking } from "@/hooks/mutations/useCreateBooking";
import { useLocalSearchParams, useRouter } from "expo-router";

const SlotResultsScreen = () => {
  const router = useRouter();
  const { searchQuery, searchType, selectedDate } = useLocalSearchParams();

  // Fetch slots
  const { data: slots, isLoading } = useQuery({
    queryKey: ["slots", "search", searchQuery, searchType, selectedDate],
    queryFn: async () => {
      const response = await apiClient.get<Slot[]>("/slots/search", {
        params: {
          query: searchQuery,
          date: selectedDate,
          type: searchType,
        },
      });
      return response.data;
    },
  });

  const { mutate: book, isPending: isBooking } = useCreateBooking();

  const handleBookSlot = (slot: Slot) => {
    Alert.alert(
      "Confirm Booking",
      `Book with ${slot.doctor.name} at ${slot.nextAvailableTime}?\n\n` +
        `Location: ${slot.hospital.name}\n` +
        `Date: ${slot.slotDate}\n` +
        `Estimated consultation: ${slot.minutesPerPatient} minutes`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Booking",
          onPress: () => {
            book(
              {
                slotId: slot.id,
                userId: 1, // TODO: Get from auth
                patientNotes: "",
              },
              {
                onSuccess: () => {
                  router.push("/my-bookings");
                },
              },
            );
          },
        },
      ],
    );
  };

  if (isLoading) return <Loader message="Searching available slots..." />;

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
          <ModernSlotCard
            slot={item}
            onBook={handleBookSlot}
            isBooking={isBooking}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="bg-white rounded-2xl p-8 items-center">
            <Text className="text-6xl mb-4">😔</Text>
            <Text className="text-gray-800 font-bold text-lg mb-2">
              No Slots Available
            </Text>
            <Text className="text-gray-600 text-center">
              Try searching for a different date or doctor
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

/**
 * Modern Slot Card Component
 */
const ModernSlotCard = ({
  slot,
  onBook,
  isBooking,
}: {
  slot: Slot;
  onBook: (slot: Slot) => void;
  isBooking: boolean;
}) => {
  const isAvailable = slot.isAvailable && slot.remainingSlots > 0;

  return (
    <View className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
      {/* Top colored bar */}
      <View className={`h-2 ${isAvailable ? "bg-green-500" : "bg-red-500"}`} />

      <View className="p-5">
        {/* Doctor & Hospital */}
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

          {/* Availability Badge */}
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

        {/* Time Info */}
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

        {/* Stats Row */}
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

        {/* Book Button */}
        {isAvailable ? (
          <TouchableOpacity
            onPress={() => onBook(slot)}
            disabled={isBooking}
            className={`bg-indigo-600 p-4 rounded-xl ${isBooking ? "opacity-50" : ""}`}
          >
            <Text className="text-white text-center font-bold text-base">
              {isBooking ? "Booking..." : "Book Appointment"}
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

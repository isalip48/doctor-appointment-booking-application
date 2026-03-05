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
import { Ionicons } from "@expo/vector-icons";
import { apiClient } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Slot } from "@/api/types";
import Loader from "@/components/common/Loader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "@/components/common/Logo";
import { PLATFORM } from "@/utils/platform";


const SlotResultsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const searchQuery = typeof params.searchQuery === "string" ? params.searchQuery : "";
  const searchType = typeof params.searchType === "string" ? params.searchType : "name";
  const selectedDate = typeof params.selectedDate === "string" ? params.selectedDate : "";

  // Fetch slots
  const { data: slots, isLoading } = useQuery({
    queryKey: ["slots", "search", searchQuery, searchType, selectedDate],
    queryFn: async () => {
      console.log("🔍 Searching slots:", { searchQuery, searchType, selectedDate });
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

  const handleBookSlot = (slot: Slot) => {
    router.push({
      pathname: "/booking-details",
      params: {
        slot: JSON.stringify(slot),
      },
    });
  };

  if (isLoading) return <Loader message="Finding available slots..." />;

  // WEB LAYOUT
  if (PLATFORM.ISWEB) {
    return (
      <View className="flex-1 bg-slate-50">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            className="relative overflow-hidden"
            style={{ paddingTop: 40 }}
          >
            <View className="max-w-6xl mx-auto w-full px-12 py-8">
              {/* Header Section */}
              <View className="mb-8">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex-row items-center mb-6"
                >
                  <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                  <Text className="text-indigo-600 font-bold ml-2 text-lg">
                    Back to Search
                  </Text>
                </TouchableOpacity>

                <View className="flex-row items-center mb-4">
                  <Logo size={80} />
                </View>

                <Text className="text-4xl font-black text-slate-900 mb-3">
                  Available Appointments
                </Text>
                <View className="flex-row items-center gap-3">
                  <View className="bg-indigo-100 px-3 py-1 rounded-full">
                    <Text className="text-indigo-600 font-semibold text-sm">
                      📅 {selectedDate}
                    </Text>
                  </View>
                  <View className="bg-slate-100 px-3 py-1 rounded-full">
                    <Text className="text-slate-600 font-semibold text-sm">
                      🔍 {searchQuery}
                    </Text>
                  </View>
                  {slots && slots.length > 0 && (
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-700 font-semibold text-sm">
                        ✓ {slots.length} slots found
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Slots Grid */}
              {slots && slots.length > 0 ? (
                <View className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {slots.map((slot) => (
                    <ModernSlotCard
                      key={slot.id}
                      slot={slot}
                      onBook={handleBookSlot}
                      isWeb={true}
                    />
                  ))}
                </View>
              ) : (
                <View className="flex-1 items-center justify-center py-20">
                  <View className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 max-w-md">
                    <Text className="text-6xl text-center mb-4">😔</Text>
                    <Text className="text-2xl font-bold text-slate-900 text-center mb-3">
                      No Slots Available
                    </Text>
                    <Text className="text-slate-600 text-center mb-6">
                      Try searching for a different date or doctor
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.back()}
                      className="bg-indigo-600 py-3 rounded-xl"
                    >
                      <Text className="text-white font-bold text-center">
                        Search Again
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* FOOTER */}
          <View className="mt-auto py-8 border-t border-slate-50 items-center">
            <Text className="text-slate-300 text-[10px] uppercase tracking-[2px] font-bold">
              © 2024 DocSync Digital Health
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // MOBILE LAYOUT
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 pt-4 pb-6 border-b border-slate-200">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
            <Text className="text-indigo-600 font-bold ml-2 text-base">
              Back
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-4">
            <Logo size={60} />
          </View>

          <Text className="text-2xl font-black text-slate-900 mb-3">
            Available Slots
          </Text>

          <View className="flex-row flex-wrap gap-2">
            <View className="bg-indigo-100 px-3 py-1 rounded-full">
              <Text className="text-indigo-600 font-semibold text-xs">
                📅 {selectedDate}
              </Text>
            </View>
            <View className="bg-slate-100 px-3 py-1 rounded-full">
              <Text className="text-slate-600 font-semibold text-xs">
                🔍 {searchQuery}
              </Text>
            </View>
            {slots && slots.length > 0 && (
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 font-semibold text-xs">
                  ✓ {slots.length} found
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Slots List */}
        {slots && slots.length > 0 ? (
          <FlatList
            data={slots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ModernSlotCard slot={item} onBook={handleBookSlot} isWeb={false} />
            )}
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-6xl mb-4">😔</Text>
            <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
              No Slots Available
            </Text>
            <Text className="text-slate-600 text-center mb-6">
              Try searching for a different date or doctor
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-indigo-600 px-8 py-4 rounded-2xl"
            >
              <Text className="text-white font-bold">Search Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

/**
 * Enhanced Slot Card Component
 */
const ModernSlotCard = ({
  slot,
  onBook,
  isWeb,
}: {
  slot: Slot;
  onBook: (slot: Slot) => void;
  isWeb: boolean;
}) => {
  const isAvailable = slot.isAvailable && slot.remainingSlots > 0;

  return (
    <View
      className={`bg-white rounded-3xl shadow-lg border-2 overflow-hidden mb-4 ${
        isAvailable ? "border-indigo-100" : "border-slate-200"
      }`}
    >
      {/* Status Bar */}
      <LinearGradient
        colors={isAvailable ? ["#10B981", "#059669"] : ["#EF4444", "#DC2626"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 4 }}
      />

      <View className="p-6">
        {/* Doctor Info */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 mr-4">
            <Text className={`font-black text-slate-900 mb-1 ${isWeb ? "text-2xl" : "text-xl"}`}>
              {slot.doctor.name}
            </Text>
            <Text className="text-indigo-600 font-bold mb-2">
              {slot.doctor.specialization}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#64748B" />
              <Text className="text-slate-600 text-sm ml-1">
                {slot.hospital.name}
              </Text>
            </View>
          </View>

          {/* Availability Badge */}
          <View
            style={{
              backgroundColor: isAvailable ? "#D1FAE5" : "#FEE2E2",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: isAvailable ? "#065F46" : "#991B1B",
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              {isAvailable ? `${slot.remainingSlots} left` : "Full"}
            </Text>
          </View>
        </View>

        {/* Time Info Card */}
        <View className="bg-slate-50 rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-600 text-sm font-medium">
              Next Available:
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="time" size={18} color="#4F46E5" />
              <Text className="text-slate-900 font-black text-lg ml-2">
                {slot.nextAvailableTime}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-slate-600 text-sm font-medium">
              Consultation Time:
            </Text>
            <Text className="text-slate-900 font-bold">
              {slot.minutesPerPatient} minutes
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between mb-5 px-2">
          <View className="items-center">
            <Text className="text-slate-500 text-xs mb-1">Start</Text>
            <Text className="text-slate-900 font-bold">
              {slot.consultationStartTime}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-slate-500 text-xs mb-1">Booked</Text>
            <Text className="text-slate-900 font-bold">
              {slot.currentBookings}/{slot.maxBookingsPerDay}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-slate-500 text-xs mb-1">Est. End</Text>
            <Text className="text-slate-900 font-bold">
              {slot.estimatedEndTime}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {isAvailable ? (
          <TouchableOpacity onPress={() => onBook(slot)} activeOpacity={0.9}>
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 16,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">
                Book Appointment
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              backgroundColor: "#F1F5F9",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text className="text-slate-500 font-bold text-base">
              Fully Booked
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SlotResultsScreen;
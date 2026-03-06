import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { apiClient } from "@/api/client";
import { Slot } from "@/api/types";
import Loader from "@/components/common/Loader";
import Logo from "@/components/common/Logo";
import { SlotCard } from "@/components/slot/SlotCard";
import { EmptySlots } from "@/components/slot/EmptySlot";

export default function NativeResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const searchQuery = typeof params.searchQuery === "string" ? params.searchQuery : "";
  const searchType = typeof params.searchType === "string" ? params.searchType : "name";
  const selectedDate = typeof params.selectedDate === "string" ? params.selectedDate : "";

  // Fetch slots
  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ["slots", searchQuery, searchType, selectedDate],
    queryFn: async () => {
      const response = await apiClient.get<Slot[]>("/slots/search", {
        params: { query: searchQuery, type: searchType, date: selectedDate },
      });
      return response.data;
    },
    enabled: !!searchQuery && !!selectedDate,
  });

  const handleBookSlot = (slot: Slot) => {
    router.push({
      pathname: "/booking-details",
      params: { slot: JSON.stringify(slot) },
    });
  };

  if (loadingSlots) return <Loader message="Finding available slots..." />;
  if (!slots || slots.length === 0) return <EmptySlots onBack={() => router.back()} />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="bg-white px-6 pt-4 pb-6 border-b border-slate-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          <Text className="text-indigo-600 font-bold ml-2 text-base">Back</Text>
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
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-semibold text-xs">
              ✓ {slots.length} found
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={slots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SlotCard slot={item} onBook={handleBookSlot} isWeb={false} />
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
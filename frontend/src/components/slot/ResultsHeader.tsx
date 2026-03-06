import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ResultsHeaderProps {
  selectedDate: string;
  searchQuery: string;
  slotsCount: number;
  onBack: () => void;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  selectedDate,
  searchQuery,
  slotsCount,
  onBack,
}) => {
  return (
    <View className="bg-white border-b border-slate-200 px-8 py-6">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={onBack} className="flex-row items-center">
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          <Text className="text-indigo-600 font-bold ml-2 text-lg">
            Back to Search
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-4xl font-black text-slate-900 mb-3">
        Available Appointments
      </Text>
      <View className="flex-row items-center gap-3">
        <View className="bg-indigo-100 px-4 py-2 rounded-full">
          <Text className="text-indigo-600 font-bold text-sm">
            📅 {selectedDate}
          </Text>
        </View>
        <View className="bg-slate-100 px-4 py-2 rounded-full">
          <Text className="text-slate-600 font-bold text-sm">
            🔍 {searchQuery}
          </Text>
        </View>
        <View className="bg-green-100 px-4 py-2 rounded-full">
          <Text className="text-green-700 font-bold text-sm">
            ✓ {slotsCount} {slotsCount === 1 ? "slot" : "slots"} found
          </Text>
        </View>
      </View>
    </View>
  );
};
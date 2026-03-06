import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface EmptySlotsProps {
  onBack: () => void;
}

export const EmptySlots: React.FC<EmptySlotsProps> = ({ onBack }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 max-w-md">
          <Text className="text-6xl text-center mb-4">😔</Text>
          <Text className="text-2xl font-bold text-slate-900 text-center mb-3">
            No Slots Available
          </Text>
          <Text className="text-slate-600 text-center mb-6">
            Try searching for a different date or doctor
          </Text>
          <TouchableOpacity onPress={onBack} activeOpacity={0.9}>
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text className="text-white font-bold">Search Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
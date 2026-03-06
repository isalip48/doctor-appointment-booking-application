import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Slot } from "@/api/types";

interface SlotCardProps {
  slot: Slot;
  onBook: (slot: Slot) => void;
  isWeb: boolean;
}

export const SlotCard: React.FC<SlotCardProps> = ({ slot, onBook, isWeb }) => {
  const isAvailable = slot.isAvailable && slot.remainingSlots > 0;

  return (
    <View
      className={`bg-white rounded-2xl shadow-md border overflow-hidden ${
        isWeb ? "mb-0" : "mb-4"
      } ${isAvailable ? "border-indigo-200" : "border-slate-200"}`}
    >
      <LinearGradient
        colors={isAvailable ? ["#10B981", "#059669"] : ["#EF4444", "#DC2626"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 3 }}
      />
      <View className={isWeb ? "p-4" : "p-5"}>
        {/* Doctor Info */}
        <View className="mb-3">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-2">
              <Text
                className={`font-black text-slate-900 mb-1 ${isWeb ? "text-base" : "text-xl"}`}
              >
                {slot.doctor.name}
              </Text>
              <Text
                className={`text-indigo-600 font-bold mb-1 ${isWeb ? "text-xs" : "text-sm"}`}
              >
                {slot.doctor.specialization}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: isAvailable ? "#D1FAE5" : "#FEE2E2",
                paddingHorizontal: isWeb ? 6 : 10,
                paddingVertical: isWeb ? 3 : 5,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: isAvailable ? "#065F46" : "#991B1B",
                  fontWeight: "bold",
                  fontSize: isWeb ? 9 : 11,
                }}
              >
                {isAvailable ? `${slot.remainingSlots} left` : "Full"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="location" size={isWeb ? 12 : 14} color="#64748B" />
            <Text
              className={`text-slate-600 ml-1 ${isWeb ? "text-[10px]" : "text-xs"}`}
              numberOfLines={1}
            >
              {slot.hospital.name}
            </Text>
          </View>
        </View>

        {/* Time Info */}
        <View
          className={`bg-slate-50 rounded-lg mb-3 ${isWeb ? "p-2.5" : "p-3"}`}
        >
          <View className="flex-row justify-between items-center mb-1.5">
            <Text
              className={`text-slate-600 font-medium ${isWeb ? "text-[10px]" : "text-xs"}`}
            >
              Next Available:
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="time" size={isWeb ? 14 : 16} color="#4F46E5" />
              <Text
                className={`text-slate-900 font-black ml-1 ${isWeb ? "text-sm" : "text-base"}`}
              >
                {slot.nextAvailableTime}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <Text
              className={`text-slate-600 font-medium ${isWeb ? "text-[10px]" : "text-xs"}`}
            >
              Duration:
            </Text>
            <Text
              className={`text-slate-900 font-bold ${isWeb ? "text-xs" : "text-sm"}`}
            >
              {slot.minutesPerPatient} min
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        {isWeb && (
          <View className="flex-row justify-between mb-3">
            <View className="items-center flex-1">
              <Text className="text-slate-500 text-[9px] mb-0.5">Start</Text>
              <Text className="text-slate-900 font-bold text-[10px]">
                {slot.consultationStartTime}
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-slate-500 text-[9px] mb-0.5">Booked</Text>
              <Text className="text-slate-900 font-bold text-[10px]">
                {slot.currentBookings}/{slot.maxBookingsPerDay}
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-slate-500 text-[9px] mb-0.5">End</Text>
              <Text className="text-slate-900 font-bold text-[10px]">
                {slot.estimatedEndTime}
              </Text>
            </View>
          </View>
        )}

        {/* Mobile Stats */}
        {!isWeb && (
          <View className="flex-row justify-between mb-4 px-1">
            <View className="items-center">
              <Text className="text-slate-500 text-[10px] mb-1">Start</Text>
              <Text className="text-slate-900 font-bold text-xs">
                {slot.consultationStartTime}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-slate-500 text-[10px] mb-1">Booked</Text>
              <Text className="text-slate-900 font-bold text-xs">
                {slot.currentBookings}/{slot.maxBookingsPerDay}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-slate-500 text-[10px] mb-1">Est. End</Text>
              <Text className="text-slate-900 font-bold text-xs">
                {slot.estimatedEndTime}
              </Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        {isAvailable ? (
          <TouchableOpacity onPress={() => onBook(slot)} activeOpacity={0.9}>
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: isWeb ? 10 : 12,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="calendar" size={isWeb ? 14 : 18} color="white" />
              <Text
                className={`text-white font-bold ml-1.5 ${isWeb ? "text-xs" : "text-sm"}`}
              >
                Book Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              backgroundColor: "#F1F5F9",
              paddingVertical: isWeb ? 10 : 12,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              className={`text-slate-500 font-bold ${isWeb ? "text-xs" : "text-sm"}`}
            >
              Fully Booked
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
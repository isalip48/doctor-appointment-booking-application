import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const WebIllustration = () => {
  return (
    <View className="hidden lg:flex flex-1 items-end relative pr-10">
      {/* Main Container / Mock Phone Screen */}
      <View
        className="bg-white w-full max-w-[380px] h-[500px] rounded-[56px] border border-slate-100 shadow-2xl overflow-hidden relative"
        style={{ shadowColor: "#6366f1", shadowOpacity: 0.1, shadowRadius: 30 }}
      >
        <LinearGradient colors={["#FFFFFF", "#F5F7FF"]} className="flex-1 p-8">
          {/* Header Mock */}
          <View className="flex-row justify-between items-center mb-10">
            <View className="h-2 w-12 bg-slate-200 rounded-full" />
            <View className="h-6 w-6 rounded-full bg-slate-100" />
          </View>

          {/* Specialist Profile Card */}
          <View className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-14 h-14 bg-indigo-50 rounded-2xl items-center justify-center">
                <Ionicons name="person" size={28} color="#4F46E5" />
              </View>
              <View className="ml-4">
                <Text className="font-black text-slate-900 text-lg">
                  Dr. Sarah Chen
                </Text>
                <Text className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
                  Cardiologist
                </Text>
              </View>
            </View>
            <View className="h-2 w-full bg-slate-50 rounded-full mb-2" />
            <View className="h-2 w-3/4 bg-slate-50 rounded-full" />
          </View>

          {/* Booking Calendar Mock */}
          <Text className="text-slate-900 font-bold mb-4 ml-1">
            Select Time
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                className={`h-12 w-[45%] rounded-2xl border ${i === 2 ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-100"} items-center justify-center`}
              >
                <Text
                  className={`text-xs font-bold ${i === 2 ? "text-white" : "text-slate-400"}`}
                >
                  {i + 8}:30 AM
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* FLOATING ELEMENT 1: Booking Confirmed (Now Pops Out) */}
      <View
        style={{ position: "absolute", bottom: -22, left: 65, zIndex: 50 }}
        className="bg-white p-5 rounded-[24px] shadow-2xl border border-slate-50 flex-row items-center"
      >
        <View className="bg-emerald-500 p-2.5 rounded-xl mr-4">
          <Ionicons name="checkmark-circle" size={24} color="white" />
        </View>
        <View>
          <Text className="text-slate-900 font-black text-sm">
            Booking Confirmed
          </Text>
          <Text className="text-slate-400 text-[10px]">
            Your slot is secured
          </Text>
        </View>
      </View>

      {/* FLOATING ELEMENT 2: Video Call */}
      <View
        style={{ position: "absolute", top: 80, right: -20, zIndex: 50 }}
        className="bg-white p-4 rounded-[20px] shadow-xl border border-slate-50 flex-row items-center"
      >
        <View className="bg-orange-100 p-2 rounded-lg mr-3">
          <Ionicons name="videocam" size={20} color="#F59E0B" />
        </View>
        <Text className="text-slate-700 font-bold text-xs">HD Video Call</Text>
      </View>
    </View>
  );
};

export default WebIllustration;

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PLATFORM } from "@/utils/platform";

type ActionCardProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor?: string;
  gradient?: readonly [string, string, ...string[]];
  badgeText?: string;
  onPress?: () => void;
};

export default function ActionCard({
  title,
  description,
  icon,
  iconColor,
  iconBgColor = "#F1F5F9",
  gradient,
  badgeText,
  onPress,
}: ActionCardProps) {
  const content = (
    <View
      className="p-6 rounded-[28px] flex-row items-center"
      style={{
        backgroundColor: gradient ? undefined : "#FFFFFF",
      }}
    >
      {/* Background Gradient (if provided) */}
      {gradient && (
        <LinearGradient
          colors={gradient as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 28,
          }}
        />
      )}

      {/* Icon */}
      <View
        className="p-4 rounded-2xl mr-4"
        style={{ backgroundColor: iconBgColor }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      {/* Text */}
      <View>
        <Text
          className={`text-lg font-bold ${
            gradient ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-sm mt-1 ${
            gradient ? "text-slate-300" : "text-slate-400"
          }`}
        >
          {description}
        </Text>
      </View>

      {/* Badge */}
      {badgeText && (
        <View className="bg-indigo-600 px-3 py-1 rounded-full">
          <Text className="text-[10px] text-white font-black tracking-wider">
            {badgeText}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`${
        PLATFORM.ISWEB
          ? "hover:scale-[1.02] transition-all duration-200 justify-center"
          : "w-full"
      }`}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 4,
      }}
    >
      {content}
    </TouchableOpacity>
  );
}
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@/components/common/Logo";
import WebIllustration from "@/components/common/WebIllustration";
import { PLATFORM } from "@/utils/platform";
import ActionCard from "@/components/common/ActionCard";

export default function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="absolute top-4 right-4 z-10">
          <TouchableOpacity
            onPress={() => router.push("/admin/login")}
            className="bg-slate-900 px-4 py-2 rounded-xl flex-row items-center"
          >
            <Ionicons name="shield-checkmark" size={16} color="white" />
            <Text className="text-white font-semibold ml-2 text-sm">Admin</Text>
          </TouchableOpacity>
        </View>
        {/* HERO SECTION */}
        <View
          className="relative overflow-hidden"
          style={{ paddingTop: insets.top + (PLATFORM.ISWEB ? 40 : 20) }}
        >
          <View
            className={
              PLATFORM.ISWEB ? "max-w-6xl mx-auto w-full px-12" : "px-6"
            }
          >
            <View
              className={
                PLATFORM.ISWEB
                  ? "flex-row items-center py-8"
                  : "items-center pt-4 pb-10"
              }
            >
              {/* LEFT CONTENT */}
              <View
                className={
                  PLATFORM.ISWEB ? "flex-1 pr-12" : "w-full items-center"
                }
              >
                <View className={`${!PLATFORM.ISWEB && "items-center -mt-20"}`}>
                  <Logo size={PLATFORM.ISWEB ? 320 : 200} />
                </View>

                {/* BADGE */}
                <View
                  className={`bg-indigo-100 px-4 py-1.5 rounded-full mb-4 -mt-6 ${
                    PLATFORM.ISWEB ? "self-start" : "self-center"
                  }`}
                >
                  <Text className="text-indigo-600 font-bold text-[10px] tracking-widest uppercase">
                    Next-Gen Healthcare
                  </Text>
                </View>

                {/* HEADLINE */}
                <Text
                  style={{ fontSize: PLATFORM.ISWEB ? 56 : 34 }}
                  className={`font-black text-slate-900 leading-tight mb-6 ${
                    !PLATFORM.ISWEB && "text-center"
                  }`}
                >
                  Healthcare that{"\n"}
                  <Text className="text-indigo-600">moves with you.</Text>
                </Text>

                {/* DESCRIPTION */}
                <Text
                  className={`text-slate-500 text-lg mb-8 leading-relaxed ${
                    !PLATFORM.ISWEB && "text-center px-2"
                  }`}
                >
                  Skip the waiting room. Connect with specialists instantly
                  through our secure platform.
                </Text>

                <TouchableOpacity
                  onPress={() => router.push("/search")}
                  activeOpacity={0.8}
                  className={PLATFORM.ISWEB ? "" : "w-full px-4"}
                >
                  <LinearGradient
                    colors={["#4F46E5", "#3730A3"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: 16,
                      paddingVertical: 16,
                      paddingHorizontal: PLATFORM.ISWEB ? 32 : 24,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="calendar" size={20} color="white" />
                    <Text className="text-white font-bold text-lg ml-3">
                      Book Appointment
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* RIGHT ILLUSTRATION (WEB ONLY) */}
              {PLATFORM.ISWEB && <WebIllustration />}
            </View>
            {/* ACTION SECTION */}
            <View
              className={PLATFORM.ISWEB ? "flex-row gap-6 mt-8" : "gap-4 mt-6"}
            >
              {/* MY BOOKINGS - Fresh Emerald Theme */}
              <ActionCard
                title="My Bookings"
                description="View, manage or cancel your appointments"
                icon="document-text"
                iconColor="#059669" // Emerald 600
                iconBgColor="#ECFDF5" // Emerald 50
                onPress={() => router.push("/my-bookings")}
              />

              {/* AI ASSISTANT - Dark Premium Theme */}
              <ActionCard
                title="AI Assistant"
                description="Instantly find the right specialist"
                icon="sparkles"
                iconColor="#F59E0B" // Amber 500
                iconBgColor="#334155" // Slate 700
                gradient={["#1E293B", "#0F172A"]} // Slate 800 to 900
                badgeText="BETA"
                onPress={() => router.push("/ai-assistant")}
              />

              {/* MEDICAL REPORTS - Modern Violet Theme */}
              <ActionCard
                title="Medical Reports"
                description="Upload and analyze lab results with AI"
                icon="document-text"
                iconColor="#7C3AED"
                iconBgColor="#EDE9FE"
                onPress={() => router.push("/medical-reports")}
              />
            </View>
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

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
  const [viewMode, setViewMode] = useState<"home" | "lookup">("home");
  const [identifier, setIdentifier] = useState("");

  const handleCheckAppointments = () => {
    if (!identifier || identifier.trim().length < 9) {
      alert("Please enter a valid NIC or Phone Number");
      return;
    }
    const trimmed = identifier.trim();
    const isPhone = /^0\d{9}$/.test(trimmed);

    router.push({
      pathname: "/my-bookings",
      params: isPhone
        ? { phoneNumber: trimmed, fromLanding: "true" }
        : { nic: trimmed, fromLanding: "true" },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* WRAPPER FOR ALIGNMENT */}
        <View className={PLATFORM.ISWEB ? "max-w-6xl mx-auto w-full px-12" : "w-full"}>
          
          {/* HERO SECTION */}
          <View
            className="relative overflow-hidden"
            style={{ paddingTop: insets.top + (PLATFORM.ISWEB ? 40 : 20) }}
          >
            <View className={PLATFORM.ISWEB ? "flex-row items-center py-8" : "items-center px-6 pt-4 pb-10"}>
              
              {/* LEFT CONTENT */}
              <View className={PLATFORM.ISWEB ? "flex-1 pr-12" : "w-full items-center"}>
                <View className={`${!PLATFORM.ISWEB && "items-center mb-4"}`}>
                  <Logo size={PLATFORM.ISWEB ? 320 : 200} />
                </View>

                <View className={`bg-indigo-100 px-4 py-1.5 rounded-full mb-4 ${PLATFORM.ISWEB ? "self-start" : "self-center"}`}>
                  <Text className="text-indigo-600 font-bold text-[10px] tracking-widest uppercase">
                    Next-Gen Healthcare
                  </Text>
                </View>

                <Text
                  style={{ fontSize: PLATFORM.ISWEB ? 56 : 34 }}
                  className={`font-black text-slate-900 leading-tight mb-6 ${!PLATFORM.ISWEB && "text-center"}`}
                >
                  Healthcare that{"\n"}
                  <Text className="text-indigo-600">moves with you.</Text>
                </Text>

                <Text className={`text-slate-500 text-lg mb-8 leading-relaxed ${!PLATFORM.ISWEB && "text-center px-2"}`}>
                  Skip the waiting room. Connect with specialists instantly
                  through our secure platform.
                </Text>

                {viewMode === "home" && (
                  <TouchableOpacity
                    onPress={() => router.push("/search")}
                    activeOpacity={0.8}
                    className={PLATFORM.ISWEB ? "self-start" : "w-full px-4"}
                  >
                    <LinearGradient
                      colors={["#4F46E5", "#3730A3"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: 16,
                        paddingVertical: 18,
                        paddingHorizontal: 40,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="calendar" size={20} color="white" />
                      <Text className="text-white font-bold text-lg ml-3">Book Appointment</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {/* RIGHT ILLUSTRATION */}
              {PLATFORM.ISWEB && <WebIllustration />}
            </View>
          </View>

          {/* ACTION SECTION - Now properly aligned under text */}
          <View className={`pb-20 ${!PLATFORM.ISWEB && "px-6"}`}>
            {viewMode === "home" ? (
              <View className={PLATFORM.ISWEB ? "flex-row gap-6 w-full" : "w-full"}>
                <ActionCard
                  title="My Bookings"
                  description="View or manage your status"
                  icon="document-text"
                  iconColor="#10B981"
                  iconBgColor="#ECFDF5"
                  onPress={() => setViewMode("lookup")}
                />

                <ActionCard
                  title="AI Assistant"
                  description="Find the right specialist"
                  icon="sparkles"
                  iconColor="#F59E0B"
                  iconBgColor="#334155"
                  gradient={["#0F172A", "#1E293B"]}
                  badgeText="BETA"
                />
              </View>
            ) : (
              /* LOOKUP VIEW */
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-50 w-full max-w-lg">
                  <TouchableOpacity onPress={() => setViewMode("home")} className="mb-6 flex-row items-center">
                    <Ionicons name="arrow-back" size={20} color="#6366f1" />
                    <Text className="ml-2 text-indigo-600 font-bold">Return Home</Text>
                  </TouchableOpacity>
                  <Text className="text-2xl font-black text-slate-900 mb-4">Find Appointment</Text>
                  <View className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 mb-6">
                    <TextInput
                      value={identifier}
                      onChangeText={setIdentifier}
                      placeholder="NIC or Phone Number"
                      className="text-base text-slate-900"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <TouchableOpacity onPress={handleCheckAppointments}>
                    <LinearGradient colors={["#4F46E5", "#3730A3"]} style={{ paddingVertical: 16, borderRadius: 12, alignItems: "center" }}>
                      <Text className="text-white font-bold">Search My Bookings</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
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
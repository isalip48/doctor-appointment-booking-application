import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import Logo from "@/components/common/Logo";
import { PLATFORM } from "@/utils/platform";
import DatePicker from "@/components/common/DatePicker";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { specialty } = useLocalSearchParams<{ specialty?: string }>();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "specialization">(
    "name",
  );
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  useEffect(() => {
    if (specialty) {
      setSearchType("specialization");
      setSearchQuery(specialty);
      
      // Optional: Automatically trigger the search if you want
      // handleSearch(); 
    }
  }, [specialty]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a doctor name or specialization");
      return;
    }

    router.push({
      pathname: "/results",
      params: {
        searchQuery,
        searchType,
        selectedDate,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HERO SECTION */}
          <View
            className="relative overflow-hidden"
            style={{ paddingTop: PLATFORM.ISWEB ? 40 : 0 }}
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
                  <View className={`${!PLATFORM.ISWEB && "items-center -mt-10 -mb-10"}`}>
                    <Logo size={PLATFORM.ISWEB ? 320 : 200} />
                  </View>

                  {/* HEADLINE */}
                  <Text
                    style={{ fontSize: PLATFORM.ISWEB ? 56 : 34 }}
                    className={`font-black text-slate-900 leading-tight mb-6 ${
                      !PLATFORM.ISWEB && "text-center"
                    }`}
                  >
                    Find Your{"\n"}
                    <Text className="text-indigo-600">Perfect Doctor</Text>
                  </Text>

                  {/* DESCRIPTION */}
                  <Text
                    className={`text-slate-500 text-lg mb-8 leading-relaxed ${
                      !PLATFORM.ISWEB && "text-center px-2"
                    }`}
                  >
                    View real-time availability and book instantly with our
                    certified healthcare professionals.
                  </Text>

                  {/* WEB FEATURES */}
                  {PLATFORM.ISWEB && (
                    <View className="gap-4 mb-8">
                      {[
                        { icon: "flash", text: "Real-time availability" },
                        {
                          icon: "shield-checkmark",
                          text: "Verified specialists",
                        },
                        { icon: "time", text: "Instant confirmation" },
                      ].map((item, index) => (
                        <View key={index} className="flex-row items-center">
                          <View className="bg-indigo-100 p-3 rounded-xl mr-4">
                            <Ionicons
                              name={item.icon as any}
                              size={24}
                              color="#4F46E5"
                            />
                          </View>
                          <Text className="text-slate-700 font-semibold text-lg">
                            {item.text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* BACK BUTTON - WEB ONLY */}
                  {PLATFORM.ISWEB && (
                    <TouchableOpacity
                      onPress={() => router.back()}
                      className="flex-row items-center"
                    >
                      <Ionicons name="arrow-back" size={20} color="#64748B" />
                      <Text className="text-slate-600 font-semibold ml-2">
                        Back to Home
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* SEARCH CARD */}
                <View
                  className={PLATFORM.ISWEB ? "flex-1 mt-20" : "w-full mt-4"}
                >
                  <View className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                    {/* SEARCH TYPE */}
                    <View className="flex-row bg-slate-100 rounded-2xl p-1 mb-4">
                      <TouchableOpacity
                        onPress={() => setSearchType("name")}
                        activeOpacity={0.7}
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          borderRadius: 12,
                          backgroundColor:
                            searchType === "name" ? "white" : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color:
                              searchType === "name" ? "#4F46E5" : "#64748B",
                          }}
                        >
                          By Name
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSearchType("specialization")}
                        activeOpacity={0.7}
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          borderRadius: 12,
                          backgroundColor:
                            searchType === "specialization"
                              ? "white"
                              : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color:
                              searchType === "specialization"
                                ? "#4F46E5"
                                : "#64748B",
                          }}
                        >
                          By Specialty
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* SEARCH INPUT */}
                    <View className="mb-4">
                      <Text className="text-slate-700 font-semibold mb-2 text-sm">
                        {searchType === "name"
                          ? "Doctor's Name"
                          : "Specialization"}
                      </Text>

                      <View className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 flex-row items-center">
                        <Ionicons name="search" size={20} color="#64748B" />
                        <TextInput
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          placeholder={
                            searchType === "name"
                              ? "e.g., Dr. Fernando"
                              : "e.g., Cardiology"
                          }
                          placeholderTextColor="#94A3B8"
                          className="flex-1 ml-3 text-base text-slate-900"
                          returnKeyType="search"
                          onSubmitEditing={handleSearch}
                        />
                      </View>
                    </View>

                    {/* DATE PICKER */}
                    <View className="mb-4">
                      <Text className="text-slate-700 font-semibold mb-2 text-sm">
                        Appointment Date
                      </Text>

                      <DatePicker
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        isWeb={PLATFORM.ISWEB}
                      />
                    </View>

                    {/* SEARCH BUTTON */}
                    <TouchableOpacity
                      onPress={handleSearch}
                      activeOpacity={0.9}
                      className="mt-6"
                    >
                      <LinearGradient
                        colors={["#4F46E5", "#7C3AED"]}
                        style={{
                          paddingVertical: 16,
                          borderRadius: 16,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="search" size={20} color="white" />
                        <Text className="text-white font-bold text-lg ml-2">
                          {PLATFORM.ISWEB
                            ? "Search Available Slots"
                            : "Search Slots"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* BACK BUTTON - MOBILE ONLY */}
                    {!PLATFORM.ISWEB && (
                      <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-row items-center justify-center mt-4 py-3"
                      >
                        <Ionicons name="arrow-back" size={18} color="#64748B" />
                        <Text className="text-slate-600 font-semibold ml-2 text-sm">
                          Back to Home
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
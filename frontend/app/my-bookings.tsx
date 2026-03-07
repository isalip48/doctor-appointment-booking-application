import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
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
import {
  useGuestBookings,
  useUpcomingGuestBookings,
} from "@/hooks/queries/useBookings";
import { useCancelBooking } from "@/hooks/mutations/useCancelBooking";
import BookingCard from "@/components/booking/BookingCard";
import Loader from "@/components/common/Loader";
import { Booking } from "@/api/types";
import Logo from "@/components/common/Logo";
import { PLATFORM } from "@/utils/platform";

export default function MyBookingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [phoneNumber, setPhoneNumber] = useState(
    (params.phoneNumber as string) || "",
  );
  const [nic, setNic] = useState((params.nic as string) || "");
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming">("upcoming");

  const shouldFetch =
    phoneNumber.length >= 10 && nic.length >= 9 && hasSearched;

  const {
    data: allBookings,
    isLoading: loadingAll,
    error: errorAll,
  } = useGuestBookings(phoneNumber, nic);

  const {
    data: upcomingBookings,
    isLoading: loadingUpcoming,
    error: errorUpcoming,
  } = useUpcomingGuestBookings(phoneNumber, nic);

  const { mutate: cancel } = useCancelBooking();

  const bookings = filter === "upcoming" ? upcomingBookings : allBookings;
  const isLoading = filter === "upcoming" ? loadingUpcoming : loadingAll;
  const error = filter === "upcoming" ? errorUpcoming : errorAll;

  const handleSearch = () => {
    if (phoneNumber.length < 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    if (nic.length < 9) {
      alert("Please enter a valid NIC number");
      return;
    }
    setHasSearched(true);
  };

  const handleCancelBooking = (booking: Booking) => {
    if (
      confirm(
        `Are you sure you want to cancel your appointment on ${booking.appointmentDate} at ${booking.appointmentTime}?`,
      )
    ) {
      cancel({ bookingId: booking.id, phoneNumber, nic });
    }
  };

  // Show loading
  if (isLoading && shouldFetch) {
    return <Loader message="Loading your bookings..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={PLATFORM.ISIOS ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={PLATFORM.ISIOS ? 0 : 20}
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
                  <View
                    className={`${!PLATFORM.ISWEB && "items-center -mt-10 -mb-20"}`}
                  >
                    <Logo size={PLATFORM.ISWEB ? 320 : 200} />
                  </View>

                  {/* HEADLINE */}
                  <Text
                    style={{ fontSize: PLATFORM.ISWEB ? 56 : 34 }}
                    className={`font-black text-slate-900 leading-tight mb-6 ${
                      !PLATFORM.ISWEB && "text-center"
                    }`}
                  >
                    {hasSearched ? "Your" : "View Your"}
                    {"\n"}
                    <Text className="text-indigo-600">Appointments</Text>
                  </Text>

                  {/* DESCRIPTION */}
                  <Text
                    className={`text-slate-500 text-lg mb-8 leading-relaxed ${
                      !PLATFORM.ISWEB && "text-center px-2"
                    }`}
                  >
                    {hasSearched
                      ? "Manage your upcoming appointments and booking history."
                      : "Enter your credentials to view and manage your bookings."}
                  </Text>

                  {/* WEB FEATURES */}
                  {PLATFORM.ISWEB && !hasSearched && (
                    <View className="gap-4 mb-8">
                      {[
                        { icon: "calendar", text: "View all appointments" },
                        { icon: "time", text: "Check appointment times" },
                        { icon: "close-circle", text: "Cancel if needed" },
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

                {/* RIGHT CARD - LOOKUP FORM OR BOOKINGS */}
                <View
                  className={PLATFORM.ISWEB ? "flex-1 mt-20" : "w-full mt-4"}
                >
                  <View className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                    {!hasSearched ? (
                      <>
                        {/* LOOKUP FORM */}
                        <View className="flex-row items-center mb-6">
                          <View className="bg-emerald-100 p-3 rounded-xl mr-3">
                            <Ionicons name="search" size={24} color="#059669" />
                          </View>
                          <Text className="text-2xl font-bold text-slate-900">
                            Find My Bookings
                          </Text>
                        </View>

                        <View className="mb-4">
                          <Text className="text-slate-700 font-semibold mb-2 text-sm">
                            Phone Number
                          </Text>
                          <View className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 flex-row items-center">
                            <Ionicons name="call" size={20} color="#64748B" />
                            <TextInput
                              value={phoneNumber}
                              onChangeText={setPhoneNumber}
                              placeholder="0771234567"
                              keyboardType="phone-pad"
                              placeholderTextColor="#94A3B8"
                              className="flex-1 ml-3 text-base text-slate-900"
                              maxLength={10}
                            />
                          </View>
                        </View>

                        <View className="mb-6">
                          <Text className="text-slate-700 font-semibold mb-2 text-sm">
                            NIC Number
                          </Text>
                          <View className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 flex-row items-center">
                            <Ionicons name="card" size={20} color="#64748B" />
                            <TextInput
                              value={nic}
                              onChangeText={setNic}
                              placeholder="199912345678"
                              placeholderTextColor="#94A3B8"
                              className="flex-1 ml-3 text-base text-slate-900"
                              maxLength={12}
                            />
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={handleSearch}
                          activeOpacity={0.9}
                        >
                          <LinearGradient
                            colors={["#10B981", "#059669"]}
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
                            <Ionicons name="search" size={20} color="white" />
                            <Text className="text-white font-bold text-lg ml-2">
                              View My Bookings
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <View className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-100">
                          <View className="flex-row items-start">
                            <Ionicons
                              name="shield-checkmark"
                              size={18}
                              color="#3B82F6"
                            />
                            <Text className="text-blue-800 text-xs ml-3 flex-1 leading-5">
                              <Text className="font-bold">
                                Secure & Private:
                              </Text>{" "}
                              Your data is only used to retrieve bookings
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                        {/* BOOKINGS VIEW */}
                        <View className="flex-row items-center justify-between mb-6">
                          <View className="flex-row items-center flex-1">
                            <View className="bg-indigo-100 p-3 rounded-xl mr-3">
                              <Ionicons
                                name="calendar"
                                size={24}
                                color="#4F46E5"
                              />
                            </View>
                            <View className="flex-1">
                              <Text className="text-2xl font-bold text-slate-900">
                                My Bookings
                              </Text>
                              <Text className="text-slate-500 text-xs">
                                {phoneNumber}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => setHasSearched(false)}
                            className="bg-slate-100 px-3 py-2 rounded-xl"
                          >
                            <Ionicons name="search" size={18} color="#64748B" />
                          </TouchableOpacity>
                        </View>

                        {/* Filter Tabs */}
                        <View className="flex-row bg-slate-100 rounded-2xl p-1 mb-6">
                          <TouchableOpacity
                            onPress={() => setFilter("upcoming")}
                            activeOpacity={0.7}
                            style={{
                              flex: 1,
                              paddingVertical: 12,
                              borderRadius: 12,
                              backgroundColor:
                                filter === "upcoming" ? "white" : "transparent",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color:
                                  filter === "upcoming" ? "#4F46E5" : "#64748B",
                              }}
                            >
                              Upcoming
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => setFilter("all")}
                            activeOpacity={0.7}
                            style={{
                              flex: 1,
                              paddingVertical: 12,
                              borderRadius: 12,
                              backgroundColor:
                                filter === "all" ? "white" : "transparent",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: filter === "all" ? "#4F46E5" : "#64748B",
                              }}
                            >
                              All
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {/* Bookings List */}
                        <ScrollView
                          style={{
                            maxHeight: PLATFORM.ISWEB ? 500 : 400,
                          }}
                          showsVerticalScrollIndicator={false}
                        >
                          {error || !bookings || bookings.length === 0 ? (
                            <View className="py-12">
                              <Text className="text-6xl text-center mb-4">
                                📭
                              </Text>
                              <Text className="text-slate-900 font-bold text-center text-xl mb-2">
                                No Bookings Found
                              </Text>
                              <Text className="text-slate-600 text-center mb-6">
                                {filter === "upcoming"
                                  ? "No upcoming appointments"
                                  : "No bookings in your history"}
                              </Text>
                              <TouchableOpacity
                                onPress={() => router.push("/search")}
                                activeOpacity={0.9}
                              >
                                <LinearGradient
                                  colors={["#4F46E5", "#7C3AED"]}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={{
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text className="text-white font-bold">
                                    Book Appointment
                                  </Text>
                                </LinearGradient>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View className="gap-3">
                              {bookings.map((booking) => (
                                <BookingCard
                                  key={booking.id}
                                  booking={booking}
                                  onCancel={handleCancelBooking}
                                  showCancelButton={filter === "upcoming"}
                                />
                              ))}
                            </View>
                          )}
                        </ScrollView>
                      </>
                    )}

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
        </ScrollView>
        {/* FOOTER */}
        <View className="py-6 items-center">
          <Text className="text-slate-300 text-[10px] uppercase tracking-[2px] font-bold">
            © 2024 DocSync Digital Health
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

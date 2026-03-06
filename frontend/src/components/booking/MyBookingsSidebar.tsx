import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Booking } from "@/api/types";
import BookingCard from "@/components/booking/BookingCard";
import Logo from "@/components/common/Logo";

interface MyBookingsSidebarProps {
  phoneNumber: string;
  nic: string;
  hasSearched: boolean;
  filter: "all" | "upcoming";
  bookings: Booking[] | undefined;
  isLoadingBookings: boolean;
  errorBookings: any;
  onPhoneChange: (value: string) => void;
  onNicChange: (value: string) => void;
  onSearch: () => void;
  onFilterChange: (filter: "all" | "upcoming") => void;
  onNewSearch: () => void;
  onCancelBooking: (booking: Booking) => void;
}

export const MyBookingsSidebar: React.FC<MyBookingsSidebarProps> = ({
  phoneNumber,
  nic,
  hasSearched,
  filter,
  bookings,
  isLoadingBookings,
  errorBookings,
  onPhoneChange,
  onNicChange,
  onSearch,
  onFilterChange,
  onNewSearch,
  onCancelBooking,
}) => {
  return (
    <View style={{ width: 420, alignSelf: "flex-start" }}>
      {/* My Bookings Card */}
      <View className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-200 mb-6">
        <View className="flex-row items-center mb-6">
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 12,
              borderRadius: 12,
              marginRight: 12,
            }}
          >
            <Ionicons name="calendar-outline" size={24} color="white" />
          </LinearGradient>
          <View className="flex-1">
            <Text className="text-2xl font-black text-slate-900">
              My Bookings
            </Text>
            <Text className="text-slate-500 text-xs">
              View your appointments
            </Text>
          </View>
        </View>

        {!hasSearched ? (
          <>
            <View className="mb-4">
              <Text className="text-slate-700 font-bold mb-2 text-sm">
                Phone Number
              </Text>
              <View className="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 flex-row items-center">
                <Ionicons name="call" size={18} color="#64748B" />
                <TextInput
                  value={phoneNumber}
                  onChangeText={onPhoneChange}
                  placeholder="0771234567"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-sm text-slate-900"
                  maxLength={10}
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-slate-700 font-bold mb-2 text-sm">
                NIC Number
              </Text>
              <View className="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 flex-row items-center">
                <Ionicons name="card" size={18} color="#64748B" />
                <TextInput
                  value={nic}
                  onChangeText={onNicChange}
                  placeholder="199912345678"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-sm text-slate-900"
                  maxLength={12}
                />
              </View>
            </View>

            <TouchableOpacity onPress={onSearch} activeOpacity={0.9}>
              <LinearGradient
                colors={["#10B981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 16,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="search" size={18} color="white" />
                <Text className="text-white font-bold ml-2">
                  Find My Bookings
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-100">
              <View className="flex-row items-start">
                <Ionicons name="shield-checkmark" size={18} color="#3B82F6" />
                <Text className="text-blue-800 text-xs ml-3 flex-1 leading-5">
                  <Text className="font-bold">Secure & Private:</Text> Your
                  data is only used to retrieve bookings
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={onNewSearch}
              className="flex-row items-center mb-6 py-2"
            >
              <Ionicons name="arrow-back" size={18} color="#4F46E5" />
              <Text className="text-indigo-600 font-bold ml-2 text-sm">
                New Search
              </Text>
            </TouchableOpacity>

            {/* Filter Tabs */}
            <View className="flex-row bg-slate-100 p-1 rounded-xl mb-6">
              <TouchableOpacity
                onPress={() => onFilterChange("upcoming")}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor:
                    filter === "upcoming" ? "white" : "transparent",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 13,
                    color: filter === "upcoming" ? "#4F46E5" : "#64748B",
                  }}
                >
                  Upcoming
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onFilterChange("all")}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: filter === "all" ? "white" : "transparent",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 13,
                    color: filter === "all" ? "#4F46E5" : "#64748B",
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bookings List */}
            <ScrollView
              style={{ maxHeight: 450 }}
              showsVerticalScrollIndicator={false}
            >
              {isLoadingBookings ? (
                <View className="py-12">
                  <Text className="text-slate-600 text-center text-sm">
                    Loading bookings...
                  </Text>
                </View>
              ) : errorBookings || !bookings || bookings.length === 0 ? (
                <View className="py-12">
                  <Text className="text-5xl text-center mb-3">📭</Text>
                  <Text className="text-slate-900 font-bold text-center mb-1">
                    No bookings found
                  </Text>
                  <Text className="text-slate-500 text-xs text-center">
                    {filter === "upcoming"
                      ? "No upcoming appointments"
                      : "No bookings yet"}
                  </Text>
                </View>
              ) : (
                <View className="gap-3">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={onCancelBooking}
                      showCancelButton={filter === "upcoming"}
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>

      {/* Logo Card */}
      <View className=" items-center">
        <Logo size={320} />
      </View>
    </View>
  );
};
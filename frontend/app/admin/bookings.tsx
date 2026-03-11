import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PLATFORM } from "@/utils/platform";
import { apiClient } from "@/api/client";

/**
 * TYPE DEFINITIONS
 * Define the shape of booking data
 */
interface Booking {
  id: number;
  // Change these to match your User entity structure
  user: {
    name: string;
    phoneNumber: string;
    nic: string;
    email?: string;
    gender?: string;
  };
  appointmentTime: string;
  notes?: string;
  slot: {
    id: number;
    slotDate: string;
    doctor: {
      name: string;
      specialization: string;
      hospital: { name: string };
    };
  };
}

/**
 * STATS INTERFACE
 * Structure for booking statistics
 */
interface BookingStats {
  total: number;
  upcoming: number;
  cancelled: number;
  completed: number;
}

export default function ViewBookings() {
  const router = useRouter();

  // ============ STATE MANAGEMENT ============

  const [bookings, setBookings] = useState<Booking[]>([]); // All bookings
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]); // Filtered list
  const [stats, setStats] = useState<BookingStats | null>(null); // Statistics
  const [loading, setLoading] = useState(true); // Loading state
  const [filter, setFilter] = useState<"all" | "today" | "upcoming">("all"); // Active filter
  const [searchQuery, setSearchQuery] = useState(""); // Search text

  /**
   * LIFECYCLE: Run once when component loads
   * Fetch bookings and statistics from backend
   */
  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  /**
   * FILTER BOOKINGS WHEN FILTER OR SEARCH CHANGES
   * Purpose: Re-filter bookings whenever filter type or search query changes
   * Dependencies: bookings, filter, searchQuery
   */
  useEffect(() => {
    applyFilters();
  }, [bookings, filter, searchQuery]);

  /**
   * FETCH ALL BOOKINGS
   * Purpose: Get all bookings from backend
   * API Endpoint: GET /admin/bookings
   */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/admin/bookings");

      console.log("Fetched bookings:", response.data);
      console.log(
        "FIRST BOOKING DATA:",
        JSON.stringify(response.data[0], null, 2),
      );
      console.log("RAW DATA FROM BACKEND:", JSON.stringify(response.data[0].slot.doctor, null, 2));

      // Ensure we have an array
      const bookingsData = Array.isArray(response.data) ? response.data : [];
      setBookings(bookingsData);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      Alert.alert("Error", "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * FETCH BOOKING STATISTICS
   * Purpose: Get counts of total, upcoming, cancelled, completed bookings
   * API Endpoint: GET /admin/bookings/stats
   * Used for: Dashboard overview cards
   */
  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/admin/bookings/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  /**
   * APPLY FILTERS
   * Purpose: Filter bookings based on selected filter and search query
   * Filters:
   * - "all": Show all bookings
   * - "today": Show only today's appointments
   * - "upcoming": Show future appointments
   * Search: Filter by patient name, phone, or NIC
   */
  const applyFilters = () => {
    let filtered = [...bookings];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Apply date filter
    if (filter === "today") {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.slot.slotDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      });
    } else if (filter === "upcoming") {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.slot.slotDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() >= today.getTime();
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.user.name.toLowerCase().includes(query) ||
          booking.user.phoneNumber.includes(query) ||
          booking.user.nic.toLowerCase().includes(query),
      );
    }

    setFilteredBookings(filtered);
  };

  /**
   * HANDLE CANCEL BOOKING
   * Purpose: Show confirmation dialog and cancel booking if confirmed
   * Process:
   * 1. Show confirmation alert
   * 2. If confirmed, call API to cancel
   * 3. Refresh bookings list
   * 4. Update statistics
   */
  const handleCancelBooking = (booking: Booking) => {
    const message = `Cancel appointment for ${booking.user.name} on ${formatDate(
      booking.slot.slotDate,
    )} at ${booking.appointmentTime}?`;

    if (PLATFORM.ISWEB) {
      if (confirm(message)) {
        cancelBooking(booking.id);
      }
    } else {
      Alert.alert("Cancel Booking", message, [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => cancelBooking(booking.id),
        },
      ]);
    }
  };

  /**
   * CANCEL BOOKING (Internal function)
   * Purpose: Actually perform the cancellation via API
   * API Endpoint: PUT /admin/bookings/{id}/cancel
   * Side effects:
   * - Slot becomes available again (backend handles this)
   * - Booking is removed from list
   */
  const cancelBooking = async (id: number) => {
    try {
      await apiClient.put(`/admin/bookings/${id}/cancel`);

      Alert.alert("Success", "Booking cancelled successfully");

      // Refresh data
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      Alert.alert("Error", "Failed to cancel booking");
    }
  };

  /**
   * FORMAT DATE FOR DISPLAY
   * Purpose: Convert date string to readable format
   * Example: "2024-03-15" → "Mar 15, 2024"
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return "No Date";
    // If the backend sends "2026-02-24", this handles it safely
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  /**
   * FORMAT PHONE NUMBER
   * Purpose: Format phone for display with safety check
   * Example: "0771234567" → "077 123 4567"
   * Fix: Handle undefined/null phone numbers
   */
  const formatPhone = (phone: string | undefined | null): string => {
    // Safety check - return empty string if phone is undefined/null
    if (!phone) {
      return "N/A";
    }

    // Format if valid 10-digit number
    if (phone.length === 10) {
      return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    }

    return phone;
  };

  /**
   * GET BOOKING STATUS COLOR
   * Purpose: Determine card color based on appointment date
   * Logic:
   * - Past appointments: Gray
   * - Today's appointments: Green
   * - Future appointments: Blue
   */
  const getBookingStatus = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(dateString);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate.getTime() < today.getTime()) {
      return {
        color: "slate",
        label: "Past",
        bg: "bg-slate-100",
        text: "text-slate-700",
      };
    } else if (bookingDate.getTime() === today.getTime()) {
      return {
        color: "green",
        label: "Today",
        bg: "bg-green-100",
        text: "text-green-700",
      };
    } else {
      return {
        color: "blue",
        label: "Upcoming",
        bg: "bg-blue-100",
        text: "text-blue-700",
      };
    }
  };

  // ============ LOADING STATE ============
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-slate-600 mt-4">Loading bookings...</Text>
      </View>
    );
  }

  // ============ MAIN UI RENDER ============
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ============ HEADER ============ */}
        <View className="bg-white border-b border-slate-200 px-6 py-4">
          <View className="flex-row items-center justify-between">
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
            </TouchableOpacity>

            {/* Title */}
            <Text className="text-xl font-bold text-slate-900">Bookings</Text>

            {/* Refresh Button */}
            <TouchableOpacity
              onPress={() => {
                fetchBookings();
                fetchStats();
              }}
              className="bg-indigo-100 p-2 rounded-xl"
            >
              <Ionicons name="refresh" size={20} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============ STATISTICS CARDS ============ */}
        {stats && (
          <View className="px-4 py-4">
            <View className="flex-row flex-wrap gap-3">
              {/* Total Bookings */}
              <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 border border-slate-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-500 text-xs">Total</Text>
                    <Text className="text-slate-900 text-2xl font-black mt-1">
                      {stats.total}
                    </Text>
                  </View>
                  <View className="bg-indigo-100 p-3 rounded-xl">
                    <Ionicons name="calendar" size={20} color="#4F46E5" />
                  </View>
                </View>
              </View>

              {/* Upcoming Bookings */}
              <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 border border-slate-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-500 text-xs">Upcoming</Text>
                    <Text className="text-green-600 text-2xl font-black mt-1">
                      {stats.upcoming}
                    </Text>
                  </View>
                  <View className="bg-green-100 p-3 rounded-xl">
                    <Ionicons name="time" size={20} color="#10B981" />
                  </View>
                </View>
              </View>

              {/* Cancelled Bookings */}
              <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 border border-slate-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-500 text-xs">Cancelled</Text>
                    <Text className="text-red-600 text-2xl font-black mt-1">
                      {stats.cancelled}
                    </Text>
                  </View>
                  <View className="bg-red-100 p-3 rounded-xl">
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </View>
                </View>
              </View>

              {/* Completed Bookings */}
              <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 border border-slate-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-500 text-xs">Completed</Text>
                    <Text className="text-slate-900 text-2xl font-black mt-1">
                      {stats.completed}
                    </Text>
                  </View>
                  <View className="bg-slate-100 p-3 rounded-xl">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#64748B"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ============ FILTER TABS ============ */}
        <View className="px-4">
          <View className="flex-row bg-white rounded-2xl p-1 border border-slate-200">
            {/* All Filter */}
            <TouchableOpacity
              onPress={() => setFilter("all")}
              className={`flex-1 py-3 rounded-xl ${
                filter === "all" ? "bg-indigo-600" : ""
              }`}
            >
              <Text
                className={`text-center font-bold text-sm ${
                  filter === "all" ? "text-white" : "text-slate-600"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>

            {/* Today Filter */}
            <TouchableOpacity
              onPress={() => setFilter("today")}
              className={`flex-1 py-3 rounded-xl ${
                filter === "today" ? "bg-indigo-600" : ""
              }`}
            >
              <Text
                className={`text-center font-bold text-sm ${
                  filter === "today" ? "text-white" : "text-slate-600"
                }`}
              >
                Today
              </Text>
            </TouchableOpacity>

            {/* Upcoming Filter */}
            <TouchableOpacity
              onPress={() => setFilter("upcoming")}
              className={`flex-1 py-3 rounded-xl ${
                filter === "upcoming" ? "bg-indigo-600" : ""
              }`}
            >
              <Text
                className={`text-center font-bold text-sm ${
                  filter === "upcoming" ? "text-white" : "text-slate-600"
                }`}
              >
                Upcoming
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============ SEARCH BAR ============ */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl border-2 border-slate-200 px-4 py-3 flex-row items-center">
            <Ionicons name="search" size={20} color="#64748B" />
            <TextInput
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)} // Use onChangeText for RN
              placeholder="Search by name, phone, or NIC..."
              className="flex-1 ml-3 text-slate-900 bg-transparent"
              placeholderTextColor="#94A3B8"
            />
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ============ BOOKINGS LIST ============ */}
        <View className="px-4 py-4">
          {filteredBookings.length === 0 ? (
            // Empty State
            <View className="bg-white rounded-2xl p-8 items-center">
              <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
              <Text className="text-slate-900 font-bold mt-4 text-lg">
                No Bookings Found
              </Text>
              <Text className="text-slate-500 text-center mt-2">
                {searchQuery
                  ? "Try a different search term"
                  : "No bookings match the selected filter"}
              </Text>
            </View>
          ) : (
            // Bookings List
            filteredBookings.map((booking) => {
              const status = getBookingStatus(booking.slot.slotDate);

              return (
                <View
                  key={booking.id}
                  className="bg-white rounded-2xl mb-3 border border-slate-200 overflow-hidden"
                >
                  {/* Status Bar */}
                  <View className={`h-1 ${status.bg}`} />

                  <View className="p-4">
                    {/* Patient Info Header */}
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-slate-900">
                          {booking.user.name}
                        </Text>
                        <Text className="text-slate-600 text-sm">
                          {formatPhone(booking.user.phoneNumber)}
                        </Text>
                        <Text className="text-slate-500 text-xs mt-1">
                          NIC: {booking.user.nic}
                        </Text>
                      </View>

                      {/* Status Badge */}
                      <View className={`px-3 py-1 rounded-full ${status.bg}`}>
                        <Text className={`text-xs font-bold ${status.text}`}>
                          {status.label}
                        </Text>
                      </View>
                    </View>

                    {/* Appointment Details */}
                    <View className="border-t border-slate-100 pt-3">
                      {/* Doctor */}
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="medical" size={16} color="#4F46E5" />
                        <Text className="text-slate-900 ml-2 font-semibold">
                          {booking.slot?.doctor?.name || "Unknown Doctor"}
                        </Text>
                      </View>

                      {/* Specialization */}
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="heart" size={16} color="#64748B" />
                        <Text className="text-slate-600 ml-2 text-sm">
                          {booking.slot?.doctor?.specialization || "N/A"}
                        </Text>
                      </View>

                      {/* Hospital */}
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="business" size={16} color="#64748B" />
                        <Text className="text-slate-600 ml-2 text-sm">
                          {booking.slot?.doctor?.hospital?.name || "N/A"}
                        </Text>
                      </View>

                      {/* Date & Time */}
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="calendar" size={16} color="#64748B" />
                        <Text className="text-slate-600 ml-2 text-sm">
                          {formatDate(booking.slot.slotDate)} at{" "}
                          {booking.appointmentTime}
                        </Text>
                      </View>

                      {/* Additional Info */}
                      {booking.user.email && (
                        <View className="flex-row items-center mb-2">
                          <Ionicons name="mail" size={16} color="#64748B" />
                          <Text className="text-slate-600 ml-2 text-sm">
                            {booking.user.email}
                          </Text>
                        </View>
                      )}

                      {booking.user.gender && (
                        <View className="flex-row items-center mb-2">
                          <Ionicons name="person" size={16} color="#64748B" />
                          <Text className="text-slate-600 ml-2 text-sm">
                            {booking.user.gender && " • "}
                            {booking.user.gender}
                          </Text>
                        </View>
                      )}

                      {/* Notes */}
                      {booking.notes && (
                        <View className="bg-slate-50 rounded-xl p-3 mt-2">
                          <Text className="text-slate-500 text-xs font-semibold mb-1">
                            Notes:
                          </Text>
                          <Text className="text-slate-700 text-sm">
                            {booking.notes}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Cancel Button - Only show for upcoming bookings */}
                    {status.label !== "Past" && (
                      <TouchableOpacity
                        onPress={() => handleCancelBooking(booking)}
                        className="mt-4"
                        activeOpacity={0.9}
                      >
                        <LinearGradient
                          colors={["#EF4444", "#DC2626"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            paddingVertical: 12,
                            borderRadius: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name="close-circle"
                            size={18}
                            color="white"
                          />
                          <Text className="text-white font-bold ml-2">
                            Cancel Booking
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

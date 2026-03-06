import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Slot, Booking } from "@/api/types";
import Loader from "@/components/common/Loader";
import { SlotCard } from "@/components/slot/SlotCard";
import { MyBookingsSidebar } from "@/components/booking/MyBookingsSidebar";
import { ResultsHeader } from "@/components/slot/ResultsHeader";
import { EmptySlots } from "@/components/slot/EmptySlot";
import {
  useGuestBookings,
  useUpcomingGuestBookings,
} from "@/hooks/queries/useBookings";
import { useCancelBooking } from "@/hooks/mutations/useCancelBooking";

export default function WebResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const searchQuery = typeof params.searchQuery === "string" ? params.searchQuery : "";
  const searchType = typeof params.searchType === "string" ? params.searchType : "name";
  const selectedDate = typeof params.selectedDate === "string" ? params.selectedDate : "";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming">("upcoming");

  // Fetch slots
  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ["slots", searchQuery, searchType, selectedDate],
    queryFn: async () => {
      const response = await apiClient.get<Slot[]>("/slots/search", {
        params: { query: searchQuery, type: searchType, date: selectedDate },
      });
      return response.data;
    },
    enabled: !!searchQuery && !!selectedDate,
  });

  // Bookings queries
  const { data: allBookings, isLoading: loadingAll, error: errorAll } = useGuestBookings(phoneNumber, nic);
  const { data: upcomingBookings, isLoading: loadingUpcoming, error: errorUpcoming } = useUpcomingGuestBookings(phoneNumber, nic);
  const { mutate: cancel } = useCancelBooking();

  const bookings = filter === "upcoming" ? upcomingBookings : allBookings;
  const isLoadingBookings = filter === "upcoming" ? loadingUpcoming : loadingAll;
  const errorBookings = filter === "upcoming" ? errorUpcoming : errorAll;

  const handleBookSlot = (slot: Slot) => {
    router.push({
      pathname: "/booking-details",
      params: { slot: JSON.stringify(slot) },
    });
  };

  const handleSearch = () => {
    if (phoneNumber.length < 10 || nic.length < 9) {
      alert("Please enter valid credentials");
      return;
    }
    setHasSearched(true);
  };

  const handleCancelBooking = (booking: Booking) => {
    if (confirm(`Cancel appointment on ${booking.appointmentDate} at ${booking.appointmentTime}?`)) {
      cancel({ bookingId: booking.id, phoneNumber, nic });
    }
  };

  const handleNewSearch = () => {
    setHasSearched(false);
    setPhoneNumber("");
    setNic("");
  };

  if (loadingSlots) return <Loader message="Finding available slots..." />;
  if (!slots || slots.length === 0) return <EmptySlots onBack={() => router.back()} />;

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ResultsHeader
          selectedDate={selectedDate}
          searchQuery={searchQuery}
          slotsCount={slots.length}
          onBack={() => router.back()}
        />

        {/* Content */}
        <View className="flex-1 px-8 py-8">
          <View className="flex-row gap-8">
            {/* Left: Slots Grid */}
            <View className="flex-1">
              <View className="grid grid-cols-3 gap-4">
                {slots.map((slot) => (
                  <SlotCard key={slot.id} slot={slot} onBook={handleBookSlot} isWeb />
                ))}
              </View>
            </View>

            {/* Right: My Bookings Sidebar */}
            <MyBookingsSidebar
              phoneNumber={phoneNumber}
              nic={nic}
              hasSearched={hasSearched}
              filter={filter}
              bookings={bookings}
              isLoadingBookings={isLoadingBookings}
              errorBookings={errorBookings}
              onPhoneChange={setPhoneNumber}
              onNicChange={setNic}
              onSearch={handleSearch}
              onFilterChange={setFilter}
              onNewSearch={handleNewSearch}
              onCancelBooking={handleCancelBooking}
            />
          </View>
        </View>

        {/* Footer */}
        <View className="mt-auto py-8 border-t border-slate-200 items-center bg-white">
          <Text className="text-slate-400 text-[10px] uppercase tracking-[2px] font-bold">
            © 2024 DocSync Digital Health
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
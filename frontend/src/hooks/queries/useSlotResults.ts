import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Slot, Booking } from "@/api/types";
import { useGuestBookings, useUpcomingGuestBookings } from "@/hooks/queries/useBookings";
import { useCancelBooking } from "@/hooks/mutations/useCancelBooking";

export function useSlotResults(searchQuery: string, searchType: string, selectedDate: string) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming">("upcoming");

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

  const {
    data: allBookings,
    isLoading: loadingAll,
  } = useGuestBookings(phoneNumber, nic);

  const {
    data: upcomingBookings,
    isLoading: loadingUpcoming,
  } = useUpcomingGuestBookings(phoneNumber, nic);

  const { mutate: cancel } = useCancelBooking();

  const bookings = filter === "upcoming" ? upcomingBookings : allBookings;

  const handleSearch = () => {
    if (phoneNumber.length < 10 || nic.length < 9) {
      alert("Please enter valid credentials");
      return;
    }
    setHasSearched(true);
  };

  const handleCancelBooking = (booking: Booking) => {
    if (
      confirm(
        `Cancel appointment on ${booking.appointmentDate} at ${booking.appointmentTime}?`
      )
    ) {
      cancel({ bookingId: booking.id, phoneNumber, nic });
    }
  };

  return {
    slots,
    loadingSlots,
    phoneNumber,
    setPhoneNumber,
    nic,
    setNic,
    hasSearched,
    setHasSearched,
    filter,
    setFilter,
    bookings,
    handleSearch,
    handleCancelBooking,
  };
}
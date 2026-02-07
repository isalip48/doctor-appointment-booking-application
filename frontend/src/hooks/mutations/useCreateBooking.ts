import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/api/bookings.api";
import { BookingRequest } from "@/api/types";
import { Alert } from "react-native";

/**
 * Create Booking Mutation
 *
 * WHY MUTATION:
 * - Changes server state (creates booking)
 * - Invalidates queries to refetch fresh data
 * - Handles success/error states
 *
 * USAGE:
 * const { mutate: book, isLoading } = useCreateBooking();
 *
 * book({ slotId: 123, userId: 45 }, {
 *   onSuccess: (booking) => {
 *     Alert.alert('Success', 'Booking confirmed!');
 *   }
 * });
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookingRequest) => {
      console.log("🚀 Creating booking:", request);
      return createBooking(request);
    },

    onSuccess: (data, variables) => {
      console.log("✅ Booking created:", data);

      // Invalidate all slot queries (availability changed)
      queryClient.invalidateQueries({
        queryKey: ["slots"],
      });

      // Invalidate user's bookings
      queryClient.invalidateQueries({
        queryKey: ["bookings", "user", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookings", "upcoming", variables.userId],
      });

      Alert.alert(
        "Booking Confirmed! 🎉",
        `Your appointment is confirmed for ${data.appointmentDate} at ${data.appointmentTime}\n\n` +
          `Doctor: ${data.doctor.name}\n` +
          `Hospital: ${data.hospital.name}`,
        [{ text: "OK" }],
      );
    },

    onError: (error: any) => {
      console.error("❌ Booking failed:", error);
      const errorMessage =
        error.response?.data || error.message || "Booking failed";
      Alert.alert("Booking Failed", errorMessage);
    },
  });
};

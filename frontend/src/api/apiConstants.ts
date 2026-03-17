export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  HOSPITALS: "/hospitals",
  DOCTORS: "/doctors",
  SLOTS: "/slots", // For searching available times
  BOOKINGS: "/bookings", // For the actual booking process
  USERS: "/users",
};

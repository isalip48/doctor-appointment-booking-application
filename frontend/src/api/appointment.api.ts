import { API_ENDPOINTS } from "./apiConstants";
import { Slot, Booking, Hospital, Doctor } from "@/types/appointment";
import apiClient from "./index";

export const appointmentApi = {
  // 1. HOSPITAL & DOCTOR DATA
  getAllHospitals: async (): Promise<Hospital[]> => {
    const response = await apiClient.get(API_ENDPOINTS.HOSPITALS);
    return response.data;
  },

  getSpecializations: async (): Promise<string[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.DOCTORS}/specializations`,
    );
    return response.data;
  },

  // 2. SLOT SEARCHING (Matches your POST /api/slots/search)
  searchSlots: async (searchCriteria: {
    hospitalId?: number;
    specialization?: string;
    date: string;
  }): Promise<Slot[]> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.SLOTS}/search`,
      searchCriteria,
    );
    return response.data;
  },

  // 3. BOOKING ACTIONS
  createBooking: async (bookingRequest: {
    slotId: number;
    userId: number;
    patientNotes: string;
  }): Promise<Booking> => {
    const response = await apiClient.post(
      API_ENDPOINTS.BOOKINGS,
      bookingRequest,
    );
    return response.data;
  },

  // 4. USER HISTORY (Matches GET /api/bookings/user/{userId})
  getUserBookings: async (userId: number): Promise<Booking[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.BOOKINGS}/user/${userId}`,
    );
    return response.data;
  },
};

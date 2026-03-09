import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PLATFORM } from "@/utils/platform";
import { apiClient } from "@/api/client";

/**
 * TYPE DEFINITIONS
 * Define the shape of our data objects
 */
interface Doctor {
  id: number;
  name: string;
  specialization: string;
  hospitalName: string;
}

interface Slot {
  id: number;
  slotDate: string;
  consultationStartTime: string;
  maxBookingsPerDay: number;
  currentBookings: number;
  minutesPerPatient: number;
  isAvailable: boolean;
  doctor: {
    id: number;
    name: string;
    specialization: string;
  };
}

export default function ManageSlots() {
  const router = useRouter();

  // ============ STATE MANAGEMENT ============
  // State holds the current data and UI status
  
  const [doctors, setDoctors] = useState<Doctor[]>([]); // List of all doctors
  const [slots, setSlots] = useState<Slot[]>([]); // List of all slots
  const [loading, setLoading] = useState(true); // Loading indicator
  const [showForm, setShowForm] = useState(false); // Show/hide slot generation form
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null); // Filter slots by doctor
  const [generating, setGenerating] = useState(false); // Generating slots in progress

  // Form data for generating new slots
  const [formData, setFormData] = useState({
    doctorId: "",
    startDate: "",
    endDate: "",
    consultationStartTime: "09:00",
    maxBookingsPerDay: "30",
    minutesPerPatient: "10",
  });

  /**
   * LIFECYCLE: Run once when component loads
   * Fetch initial data from backend
   */
  useEffect(() => {
    fetchDoctors();
    fetchSlots();
  }, []);

  /**
   * FETCH DOCTORS
   * Purpose: Get list of all doctors from backend
   * Used for: Dropdown selection and filtering
   */
  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get("/admin/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      Alert.alert("Error", "Failed to load doctors");
    }
  };

  /**
   * FETCH SLOTS
   * Purpose: Get all slots from backend, optionally filtered by doctor
   * Parameters: doctorId (optional) - if provided, only get slots for that doctor
   */
  const fetchSlots = async (doctorId?: number) => {
    try {
      setLoading(true);
      const url = doctorId
        ? `/admin/slots?doctorId=${doctorId}`
        : "/admin/slots";
      const response = await apiClient.get(url);
      setSlots(response.data);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      Alert.alert("Error", "Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLE DOCTOR FILTER CHANGE
   * Purpose: When user selects a doctor from dropdown, fetch only their slots
   * Why: Improves performance and user experience by showing relevant data
   */
  const handleDoctorFilterChange = (doctorId: string) => {
    if (doctorId === "") {
      setSelectedDoctor(null);
      fetchSlots(); // Fetch all slots
    } else {
      const id = parseInt(doctorId);
      setSelectedDoctor(id);
      fetchSlots(id); // Fetch only slots for selected doctor
    }
  };

  /**
   * RESET FORM
   * Purpose: Clear form data and close the form
   * When: After successful slot generation or when user cancels
   */
  const resetForm = () => {
    setFormData({
      doctorId: "",
      startDate: "",
      endDate: "",
      consultationStartTime: "09:00",
      maxBookingsPerDay: "30",
      minutesPerPatient: "10",
    });
    setShowForm(false);
  };

  /**
   * VALIDATE FORM DATA
   * Purpose: Check if all required fields are filled correctly
   * Returns: true if valid, false if invalid
   * Why: Prevent sending incomplete data to backend
   */
  const validateForm = (): boolean => {
    if (!formData.doctorId) {
      Alert.alert("Error", "Please select a doctor");
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      Alert.alert("Error", "Please select start and end dates");
      return false;
    }

    // Check if end date is before start date
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      Alert.alert("Error", "End date must be after start date");
      return false;
    }

    return true;
  };

  /**
   * HANDLE GENERATE SLOTS
   * Purpose: Send request to backend to generate slots for a doctor
   * Process:
   * 1. Validate form data
   * 2. Send POST request to backend
   * 3. Backend creates one slot per day for date range
   * 4. Show success message with count
   * 5. Refresh slot list
   */
  const handleGenerateSlots = async () => {
    if (!validateForm()) return;

    try {
      setGenerating(true);

      // Prepare payload for backend
      const payload = {
        doctorId: parseInt(formData.doctorId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        consultationStartTime: formData.consultationStartTime,
        maxBookingsPerDay: parseInt(formData.maxBookingsPerDay),
        minutesPerPatient: parseInt(formData.minutesPerPatient),
      };

      // Send to backend
      const response = await apiClient.post("/admin/slots/generate", payload);

      // Show success message
      Alert.alert(
        "Success",
        `Generated ${response.data.slotsGenerated} slots for ${response.data.doctor}`
      );

      // Clean up and refresh
      resetForm();
      fetchSlots(selectedDoctor || undefined);
    } catch (error: any) {
      console.error("Failed to generate slots:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to generate slots";
      Alert.alert("Error", errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  /**
   * HANDLE DELETE SLOT
   * Purpose: Delete a single slot
   * Process:
   * 1. Show confirmation dialog
   * 2. If confirmed, send DELETE request
   * 3. Refresh slot list
   * Why: Allow admin to remove slots if doctor is unavailable
   */
  const handleDeleteSlot = (slot: Slot) => {
    const message = `Delete slot for ${slot.doctor.name} on ${new Date(
      slot.slotDate
    ).toLocaleDateString()}?`;

    if (PLATFORM.ISWEB) {
      if (confirm(message)) {
        deleteSlot(slot.id);
      }
    } else {
      Alert.alert("Delete Slot", message, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteSlot(slot.id),
        },
      ]);
    }
  };

  /**
   * DELETE SLOT (Internal function)
   * Purpose: Actually perform the deletion via API call
   * Called by: handleDeleteSlot after confirmation
   */
  const deleteSlot = async (id: number) => {
    try {
      await apiClient.delete(`/admin/slots/${id}`);
      Alert.alert("Success", "Slot deleted successfully");
      fetchSlots(selectedDoctor || undefined);
    } catch (error) {
      console.error("Failed to delete slot:", error);
      Alert.alert("Error", "Failed to delete slot");
    }
  };

  /**
   * FORMAT DATE FOR DISPLAY
   * Purpose: Convert date string to readable format
   * Example: "2024-03-15" → "Mar 15, 2024"
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * GET TODAY'S DATE IN YYYY-MM-DD FORMAT
   * Purpose: Set minimum date for slot generation (can't create slots in past)
   * Returns: String in format "2024-03-15"
   */
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ============ LOADING STATE ============
  // Show spinner while fetching data
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-slate-600 mt-4">Loading slots...</Text>
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
            <Text className="text-xl font-bold text-slate-900">
              Manage Slots
            </Text>

            {/* Add Button - Opens slot generation form */}
            <TouchableOpacity
              onPress={() => setShowForm(!showForm)}
              className="bg-green-100 p-2 rounded-xl"
            >
              <Ionicons
                name={showForm ? "close" : "add"}
                size={20}
                color="#10B981"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============ SLOT GENERATION FORM ============ */}
        {/* Only visible when showForm is true */}
        {showForm && (
          <View className="bg-white m-4 p-6 rounded-2xl border border-slate-200">
            <Text className="text-lg font-bold text-slate-900 mb-4">
              Generate Slots
            </Text>

            {/* Doctor Selection Dropdown */}
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Select Doctor *
              </Text>
              <View className="bg-slate-50 rounded-2xl border-2 border-slate-200">
                <select
                  value={formData.doctorId}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-transparent text-slate-900"
                  style={{ outline: "none" }}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </View>
            </View>

            {/* Date Range Selection */}
            <View className="flex-row gap-3 mb-4">
              {/* Start Date */}
              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 text-sm">
                  Start Date *
                </Text>
                <input
                  type="date"
                  value={formData.startDate}
                  min={getTodayDate()}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
                  style={{ outline: "none" }}
                />
              </View>

              {/* End Date */}
              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 text-sm">
                  End Date *
                </Text>
                <input
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate || getTodayDate()}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
                  style={{ outline: "none" }}
                />
              </View>
            </View>

            {/* Consultation Start Time */}
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Consultation Start Time
              </Text>
              <input
                type="time"
                value={formData.consultationStartTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultationStartTime: e.target.value,
                  })
                }
                className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
                style={{ outline: "none" }}
              />
              <Text className="text-slate-500 text-xs mt-1">
                Time when doctor starts consultations (e.g., 09:00 AM)
              </Text>
            </View>

            {/* Slot Configuration */}
            <View className="flex-row gap-3 mb-4">
              {/* Max Bookings Per Day */}
              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 text-sm">
                  Bookings/Day
                </Text>
                <TextInput
                  value={formData.maxBookingsPerDay}
                  onChangeText={(text) =>
                    setFormData({ ...formData, maxBookingsPerDay: text })
                  }
                  placeholder="30"
                  keyboardType="numeric"
                  className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
                />
              </View>

              {/* Minutes Per Patient */}
              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 text-sm">
                  Minutes/Patient
                </Text>
                <TextInput
                  value={formData.minutesPerPatient}
                  onChangeText={(text) =>
                    setFormData({ ...formData, minutesPerPatient: text })
                  }
                  placeholder="10"
                  keyboardType="numeric"
                  className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
                />
              </View>
            </View>

            {/* Info Box - Explains the slot system */}
            <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
              <Text className="text-blue-900 font-semibold text-sm mb-1">
                ℹ️ How It Works
              </Text>
              <Text className="text-blue-800 text-xs leading-5">
                One slot per day will be created. Each slot can handle{" "}
                {formData.maxBookingsPerDay} patients, with{" "}
                {formData.minutesPerPatient} minutes per patient.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              {/* Cancel Button */}
              <TouchableOpacity
                onPress={resetForm}
                className="flex-1 bg-slate-100 py-4 rounded-2xl"
                disabled={generating}
              >
                <Text className="text-slate-700 font-bold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Generate Button */}
              <TouchableOpacity
                onPress={handleGenerateSlots}
                className="flex-1"
                activeOpacity={0.9}
                disabled={generating}
              >
                <LinearGradient
                  colors={
                    generating
                      ? ["#94A3B8", "#94A3B8"]
                      : ["#10B981", "#059669"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-white font-bold">
                    {generating ? "Generating..." : "Generate Slots"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============ FILTER BY DOCTOR ============ */}
        <View className="px-4 mt-4">
          <Text className="text-slate-700 font-semibold mb-2">
            Filter by Doctor
          </Text>
          <View className="bg-white rounded-2xl border-2 border-slate-200">
            <select
              value={selectedDoctor?.toString() || ""}
              onChange={(e) => handleDoctorFilterChange(e.target.value)}
              className="w-full px-4 py-3 bg-transparent text-slate-900"
              style={{ outline: "none" }}
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </View>
        </View>

        {/* ============ SLOTS LIST ============ */}
        <View className="px-4 py-4">
          {slots.length === 0 ? (
            // Empty State - No slots found
            <View className="bg-white rounded-2xl p-8 items-center">
              <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
              <Text className="text-slate-900 font-bold mt-4 text-lg">
                No Slots Yet
              </Text>
              <Text className="text-slate-500 text-center mt-2">
                Generate slots for doctors to enable bookings
              </Text>
            </View>
          ) : (
            // Slots Grid - Display all slots
            slots.map((slot) => (
              <View
                key={slot.id}
                className="bg-white p-4 rounded-2xl mb-3 border border-slate-200"
              >
                {/* Slot Header - Doctor name and delete button */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-900">
                      {slot.doctor.name}
                    </Text>
                    <Text className="text-indigo-600 font-semibold text-sm">
                      {slot.doctor.specialization}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteSlot(slot)}
                    className="bg-red-100 p-2 rounded-lg"
                  >
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {/* Slot Details */}
                <View className="border-t border-slate-100 pt-3">
                  {/* Date */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar" size={16} color="#64748B" />
                    <Text className="text-slate-700 ml-2 font-semibold">
                      {formatDate(slot.slotDate)}
                    </Text>
                  </View>

                  {/* Start Time */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="time" size={16} color="#64748B" />
                    <Text className="text-slate-600 ml-2 text-sm">
                      Starts at {slot.consultationStartTime}
                    </Text>
                  </View>

                  {/* Availability Stats */}
                  <View className="flex-row items-center justify-between mt-3 bg-slate-50 rounded-xl p-3">
                    <View>
                      <Text className="text-slate-500 text-xs">Capacity</Text>
                      <Text className="text-slate-900 font-bold">
                        {slot.currentBookings} / {slot.maxBookingsPerDay}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-slate-500 text-xs">Duration</Text>
                      <Text className="text-slate-900 font-bold">
                        {slot.minutesPerPatient} min
                      </Text>
                    </View>
                    <View>
                      <Text className="text-slate-500 text-xs">Status</Text>
                      <View
                        className={`px-3 py-1 rounded-full ${
                          slot.isAvailable ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            slot.isAvailable
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {slot.isAvailable ? "Available" : "Full"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
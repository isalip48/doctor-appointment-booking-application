import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/api/appointment.api';
import SlotCard from '@/components/appointment/SlotCard';
import SearchHeader from '@/components/common/SearchHeader'; 
import Loader from '@/components/common/Loader';

const AppointmentListScreen = () => {
  const queryClient = useQueryClient();

  // 1. Local State
  const [doctorName, setDoctorName] = useState("");
  const [dateObject, setDateObject] = useState(new Date());

  // Helper: Format Date to 'YYYY-MM-DD' for Spring Boot API
  const formattedDate = dateObject.toISOString().split('T')[0];

  // 2. Fetch Data (useQuery)
  const { data: slots, isLoading, refetch } = useQuery({
    queryKey: ['slots', formattedDate], 
    queryFn: () => appointmentApi.searchSlots({ date: formattedDate }),
  });

  // 3. Booking Logic (useMutation)
  const bookingMutation = useMutation({
    mutationFn: (slotId: number) => appointmentApi.createBooking({
      slotId,
      userId: 1, // Currently hardcoded; later this comes from Auth
      patientNotes: "General Checkup"
    }),
    onSuccess: () => {
      // Refresh the list from the server to update 'isBooked' status
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      Alert.alert("Success", "Appointment booked successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Booking Failed", error.message || "Something went wrong");
    }
  });

  // 4. Performance Optimization: Local Filtering
  // useMemo ensures we only filter when 'slots' or 'doctorName' changes
  const filteredSlots = useMemo(() => {
    if (!slots) return [];
    return slots.filter(slot => 
      slot.doctor.name.toLowerCase().includes(doctorName.toLowerCase())
    );
  }, [slots, doctorName]);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Search Section */}
      <SearchHeader 
        doctorName={doctorName}
        setDoctorName={setDoctorName}
        selectedDate={dateObject}
        onDateChange={(newDate) => setDateObject(newDate)}
        onSearch={refetch}
      />

      {/* Results Section */}
      <View className="flex-1 px-4">
        <Text className="mt-6 mb-4 font-bold text-slate-900 text-lg">
          {doctorName ? `Results for "Dr. ${doctorName}"` : "Available Slots"}
        </Text>

        {isLoading ? (
          <Loader />
        ) : (
          <FlatList
            data={filteredSlots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SlotCard 
                slot={item} 
                onPress={() => bookingMutation.mutate(item.id)}
                isLoading={bookingMutation.isPending} // Show spinner on card
              />
            )}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="text-slate-400">No appointments found for this selection.</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </View>
  );
};

export default AppointmentListScreen;
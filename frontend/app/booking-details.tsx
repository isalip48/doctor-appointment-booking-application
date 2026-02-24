import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Slot } from '@/api/types';
import BookingForm from '@/components/booking/BookingForm';
import { useCreateBooking } from '@/hooks/mutations/useCreateBooking';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse slot data from params
  const slot: Slot = params.slot ? JSON.parse(params.slot as string) : null;
  
  const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

  if (!slot) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-lg">Error: No slot data found</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 bg-indigo-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSubmit = (userData: {
    name: string;
    phoneNumber: string;
    nic: string;
    email?: string;
    age?: number;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    patientNotes?: string;
  }) => {
    createBooking(
      {
        slotId: slot.id,
        ...userData,
      },
      {
        onSuccess: () => {
          // Navigate to booking lookup with pre-filled credentials
          router.replace({
            pathname: '/my-bookings',
            params: {
              phoneNumber: userData.phoneNumber,
              nic: userData.nic,
            },
          });
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header - Slot Summary */}
      <View className="bg-indigo-600 p-6 rounded-b-3xl mt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-3">
          <Text className="text-white text-base">← Back</Text>
        </TouchableOpacity>
        
        <Text className="text-white text-2xl font-bold mb-2">
          Confirm Appointment
        </Text>
        
        <View className="bg-white/20 rounded-xl p-4 mt-2">
          <Text className="text-white font-bold text-lg">
            {slot.doctor.name}
          </Text>
          <Text className="text-white/80 text-sm">
            {slot.doctor.specialization}
          </Text>
          <Text className="text-white/80 text-sm mt-2">
            📅 {slot.slotDate} • ⏰ {slot.nextAvailableTime}
          </Text>
          <Text className="text-white/80 text-sm">
            📍 {slot.hospital.name}
          </Text>
        </View>
      </View>

      {/* Booking Form */}
      <BookingForm onSubmit={handleSubmit} isSubmitting={isBooking} />
    </View>
  );
}
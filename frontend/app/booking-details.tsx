import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Slot } from '@/api/types';
import BookingForm from '@/components/booking/BookingForm';
import { useCreateBooking } from '@/hooks/mutations/useCreateBooking';
import Logo from '@/components/common/Logo';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse slot data from params
  const slot: Slot = params.slot ? JSON.parse(params.slot as string) : null;

  const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

  if (!slot) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="flex-1 justify-center items-center p-6">
          <View className="bg-red-50 p-6 rounded-3xl border border-red-200 mb-6">
            <Ionicons name="alert-circle" size={64} color="#EF4444" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Booking Error
          </Text>
          <Text className="text-slate-600 text-center mb-6">
            No appointment details found. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 16,
              }}
            >
              <Text className="text-white font-bold text-base">Go Back</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
          router.replace({
            pathname: '/my-bookings',
            params: {
              phoneNumber: userData.phoneNumber,
              nic: userData.nic,
              fromLanding: 'true',
            },
          });
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Enhanced Header */}
        <View className="bg-white px-6 pb-6 border-b border-slate-200">
          {/* Back Button & Logo */}
          <View className="flex-row items-center justify-between -mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center"
            >
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
              <Text className="text-indigo-600 font-bold ml-2 text-base">
                Back
              </Text>
            </TouchableOpacity>
            <Logo size={80} />
          </View>

          {/* Title */}
          <Text className="text-2xl font-black text-slate-900 mb-1">
            Confirm Your Appointment
          </Text>
          <Text className="text-slate-600 text-sm mb-6">
            Review details and complete booking
          </Text>

          {/* Appointment Details Card */}
          <View className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-100">
            {/* Doctor Info */}
            <View className="flex-row items-start mb-4">
              <View className="bg-white p-3 rounded-2xl mr-4">
                <Ionicons name="person" size={24} color="#4F46E5" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-900 mb-1">
                  {slot.doctor.name}
                </Text>
                <Text className="text-indigo-600 font-semibold text-sm">
                  {slot.doctor.specialization}
                </Text>
              </View>
            </View>

            {/* Details Grid */}
            <View className="bg-white/60 rounded-2xl p-4 gap-3">
              {/* Date & Time */}
              <View className="flex-row items-center">
                <View className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <Ionicons name="calendar" size={18} color="#4F46E5" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-500 text-xs font-medium">
                    Date & Time
                  </Text>
                  <Text className="text-slate-900 font-bold">
                    {slot.slotDate} • {slot.nextAvailableTime}
                  </Text>
                </View>
              </View>

              {/* Hospital */}
              <View className="flex-row items-center">
                <View className="bg-emerald-100 p-2 rounded-lg mr-3">
                  <Ionicons name="location" size={18} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-500 text-xs font-medium">
                    Hospital
                  </Text>
                  <Text className="text-slate-900 font-bold">
                    {slot.hospital.name}
                  </Text>
                </View>
              </View>

              {/* Duration */}
              <View className="flex-row items-center">
                <View className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Ionicons name="time" size={18} color="#7C3AED" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-500 text-xs font-medium">
                    Consultation Duration
                  </Text>
                  <Text className="text-slate-900 font-bold">
                    {slot.minutesPerPatient} minutes
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Booking Form */}
        <BookingForm onSubmit={handleSubmit} isSubmitting={isBooking} />
      </ScrollView>
    </SafeAreaView>
  );
}
import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDoctors } from '@/hooks/queries/useDoctors';
import { useSpecializations } from '@/hooks/queries/useDoctors';
import DoctorCard from '@/components/doctor/DoctorCard';
import Loader from '@/components/common/Loader';
import { Doctor } from '@/api/types';

/**
 * Doctor List Screen
 * 
 * FEATURES:
 * - Lists doctors (optionally filtered by hospital)
 * - Filter by specialization
 * - Navigate to slot search on doctor select
 */
const DoctorListScreen = ({ route, navigation }: any) => {
  const { hospitalId, hospitalName } = route.params || {};
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | undefined>();
  
  // Fetch doctors with filters
  const { data: doctors, isLoading } = useDoctors({
    hospitalId,
    specialization: selectedSpecialization,
  });
  
  // Fetch specializations for filter
  const { data: specializations } = useSpecializations();
  
  /**
   * Handle doctor selection
   * Navigate to slot search for this doctor
   */
  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate('SlotSearch', {
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalId: doctor.hospital.id,
      hospitalName: doctor.hospital.name,
    });
  };

  if (isLoading) return <Loader message="Loading doctors..." />;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">
          {hospitalName || 'All Doctors'}
        </Text>
        <Text className="text-gray-600">Select a doctor to view available slots</Text>
      </View>

      {/* Specialization Filter */}
      <View className="bg-white p-3 m-2 rounded-lg">
        <Text className="text-sm font-bold text-gray-700 mb-2">
          Filter by Specialization:
        </Text>
        <View className="flex-row flex-wrap">
          {/* All button */}
          <TouchableOpacity
            onPress={() => setSelectedSpecialization(undefined)}
            className={`px-4 py-2 rounded-full m-1 ${
              !selectedSpecialization ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <Text className={!selectedSpecialization ? 'text-white font-bold' : 'text-gray-700'}>
              All
            </Text>
          </TouchableOpacity>
          
          {/* Specialization buttons */}
          {specializations?.map((spec) => (
            <TouchableOpacity
              key={spec}
              onPress={() => setSelectedSpecialization(spec)}
              className={`px-4 py-2 rounded-full m-1 ${
                selectedSpecialization === spec ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <Text className={selectedSpecialization === spec ? 'text-white font-bold' : 'text-gray-700'}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Doctor List */}
      <FlatList
        data={doctors || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={handleDoctorPress} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-10">
            <Text className="text-gray-500 text-center">
              No doctors found with selected filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default DoctorListScreen;
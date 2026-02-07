import React, { useState } from "react";
import { FlatList, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useDoctors, useSpecializations } from "@/hooks/queries/useDoctors";
import DoctorCard from "@/components/doctor/DoctorCard";
import Loader from "@/components/common/Loader";
import Header from "@/components/common/Header";
import EmptyState from "@/components/common/EmptyState";
import SpecializationFilter from "@/components/doctor/SpecializationFilter";
import { Doctor } from "@/api/types";
import { isWeb } from "@/utils/platform";

/**
 * Doctor List Screen
 *
 * FEATURES:
 * - Lists doctors (optionally filtered by hospital)
 * - Filter by specialization
 * - Navigate to slot search on doctor select
 */
const DoctorListScreen = () => {
  const { hospitalId, hospitalName } = useLocalSearchParams();
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | undefined
  >();

  const hospitalIdNum =
    typeof hospitalId === "string" ? Number(hospitalId) : undefined;

  const { data: doctors, isLoading } = useDoctors({
    hospitalId: hospitalIdNum,
    specialization: selectedSpecialization,
  });

  // Fetch specializations for filter
  const { data: specializations } = useSpecializations();

  /**
   * Handle doctor selection
   * Navigate to slot search for this doctor
   */
  const handleDoctorPress = (doctor: Doctor) => {
    router.push({
      pathname: "/slot-search",
      params: {
        doctorId: doctor.id.toString(),
        doctorName: doctor.name,
        hospitalId: doctor.hospital.id.toString(),
        hospitalName: doctor.hospital.name,
      },
    });
  };

  if (isLoading) return <Loader message="Loading doctors..." />;

  // Web Layout
  if (isWeb) {
    return (
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          <View className="max-w-6xl mx-auto w-full px-6 py-8">
            {/* Web Header */}
            <View className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {hospitalName || "All Doctors"}
              </h1>
              <p className="text-gray-600 text-lg">
                Select a doctor to view available slots
              </p>
            </View>

            <SpecializationFilter
              specializations={specializations}
              selectedSpecialization={selectedSpecialization}
              onSelect={setSelectedSpecialization}
            />

            {/* Grid Layout for Web */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onPress={handleDoctorPress}
                  />
                ))
              ) : (
                <View className="col-span-full">
                  <EmptyState
                    icon="👨‍⚕️"
                    title="No doctors found"
                    subtitle="Try adjusting your filters"
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Mobile/Native Layout
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header
        title={hospitalName?.toString() || "All Doctors"}
        subtitle="Select a doctor to view available slots"
      />

      <SpecializationFilter
        specializations={specializations}
        selectedSpecialization={selectedSpecialization}
        onSelect={setSelectedSpecialization}
      />

      <FlatList
        data={doctors || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={handleDoctorPress} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <EmptyState
            icon="👨‍⚕️"
            title="No doctors found"
            subtitle="Try adjusting your filters"
          />
        }
      />
    </SafeAreaView>
  );
};

export default DoctorListScreen;

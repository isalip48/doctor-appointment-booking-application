import React, { useState } from "react";
import { View, FlatList, Text, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHospitals, useSearchHospitals } from "@/hooks/queries/useHospitals";
import HospitalCard from "@/components/hospital/HospitalCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { Hospital } from "@/api/types";
import { useRouter } from "expo-router";
import { isWeb } from "@/utils/platform";

/**
 * Hospital List Screen
 *
 * FEATURES:
 * - Lists all hospitals
 * - Search functionality
 * - Navigate to doctor list on hospital select
 */
const HospitalListScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch all hospitals
  const { data: allHospitals, isLoading: loadingAll } = useHospitals();

  // Search hospitals (only if searchTerm >= 2 chars)
  const { data: searchResults, isLoading: loadingSearch } =
    useSearchHospitals(searchTerm);

  // Determine which data to show
  const hospitals = searchTerm.length >= 2 ? searchResults : allHospitals;
  const isLoading = searchTerm.length >= 2 ? loadingSearch : loadingAll;

  /**
   * Handle hospital selection
   * Navigate to doctor list filtered by this hospital
   */
  const handleHospitalPress = (hospital: Hospital) => {
    router.push({
      pathname: "/doctors",
      params: {
        hospitalId: hospital.id.toString(),
        hospitalName: hospital.name,
      },
    });
  };

  if (isLoading) return <Loader message="Loading hospitals..." />;

  // Web Layout
  if (isWeb) {
    return (
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          <View className="max-w-6xl mx-auto w-full px-6 py-8">
            {/* Web Header */}
            <View className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Select Hospital
              </h1>

              {/* Search Bar */}
              <TextInput
                placeholder="Search hospitals..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="bg-white p-4 rounded-xl text-gray-800 shadow-sm border border-gray-200"
              />
            </View>

            {/* Grid Layout for Web */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals && hospitals.length > 0 ? (
                hospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    onPress={handleHospitalPress}
                  />
                ))
              ) : (
                <View className="col-span-full">
                  <EmptyState
                    icon="🏥"
                    title={
                      searchTerm
                        ? "No hospitals found"
                        : "No hospitals available"
                    }
                    subtitle="Try a different search term"
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
      {/* Header */}
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Select Hospital
        </Text>

        {/* Search Bar */}
        <TextInput
          placeholder="Search hospitals..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="bg-gray-100 p-3 rounded-lg text-gray-800"
        />
      </View>

      {/* Hospital List */}
      <FlatList
        data={hospitals || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HospitalCard hospital={item} onPress={handleHospitalPress} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <EmptyState
            icon="🏥"
            title={searchTerm ? "No hospitals found" : "No hospitals available"}
            subtitle="Try a different search term"
          />
        }
      />
    </SafeAreaView>
  );
};

export default HospitalListScreen;

import React, { useState } from "react";
import { View, FlatList, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHospitals, useSearchHospitals } from "@/hooks/queries/useHospitals";
import HospitalCard from "@/components/hospital/HospitalCard";
import Loader from "@/components/common/Loader";
import { Hospital } from "@/api/types";
import { useLocalSearchParams, useRouter } from "expo-router";

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
      pathname: "/doctor-list",
      params: {
        hospitalId: hospital.id.toString(),
        hospitalName: hospital.name,
      },
    });
  };

  if (isLoading) return <Loader message="Loading hospitals..." />;

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
          <View className="flex-1 justify-center items-center p-10">
            <Text className="text-gray-500 text-center">
              {searchTerm ? "No hospitals found" : "No hospitals available"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HospitalListScreen;

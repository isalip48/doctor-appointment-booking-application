import React, { useState } from "react";
import { useRouter } from "expo-router"; // IMPORTANT
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, addDays } from "date-fns";
import { useSpecializations } from "@/hooks/queries/useDoctors";

const SearchLandingScreen = () => {
  const router = useRouter(); // Replacement for 'navigation'
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "specialization">(
    "name",
  );
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const { data: specializations } = useSpecializations();

  const handleSearch = () => {
    const query =
      searchType === "specialization" ? selectedSpecialization : searchQuery;
    if (!query) {
      alert("Please select a doctor or specialization");
      return;
    }

    // Navigation via push
    router.push({
      pathname: "/results",
      params: { searchQuery: query, searchType, selectedDate },
    });
  };
  const getNext30Days = () => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = addDays(new Date(), i);
      days.push({
        date: format(date, "yyyy-MM-dd"),
        day: format(date, "EEE"),
        dateNum: format(date, "d"),
        month: format(date, "MMM"),
        isToday: i === 0,
      });
    }
    return days;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Header with Gradient */}
        <Text className="text-black text-3xl font-bold mb-2">
          Find Your Doctor
        </Text>
        <Text className="text-black/80 text-base">
          Search by name or specialization
        </Text>

        {/* Search Type Toggle */}
        <View className="p-4">
          <View className="flex-row bg-white rounded-full p-1 shadow-sm">
            <TouchableOpacity
              onPress={() => setSearchType("name")}
              className={`flex-1 py-4 rounded-full ${
                searchType === "name" ? "bg-indigo-600" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  searchType === "name" ? "text-white" : "text-gray-600"
                }`}
              >
                By Name
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSearchType("specialization")}
              className={`flex-1 py-3 rounded-xl ${
                searchType === "specialization"
                  ? "bg-indigo-600"
                  : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  searchType === "specialization"
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                By Specialty
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Input / Specialization Selector */}
        <View className="px-4 mb-6">
          {searchType === "name" ? (
            <View className="bg-white rounded-2xl shadow-sm p-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Doctor's Name
              </Text>
              <TextInput
                placeholder="Enter doctor's name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="bg-gray-50 p-4 rounded-xl text-gray-800 text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ) : (
            <View className="bg-white rounded-2xl shadow-sm p-4">
              <Text className="text-gray-700 font-semibold mb-3">
                Select Specialization
              </Text>
              <View className="flex-row flex-wrap">
                {specializations?.map((spec) => (
                  <TouchableOpacity
                    key={spec}
                    onPress={() => setSelectedSpecialization(spec)}
                    className={`px-4 py-2 rounded-full m-1 ${
                      selectedSpecialization === spec
                        ? "bg-indigo-600"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        selectedSpecialization === spec
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {spec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Date Selection */}
        <View className="px-4 mb-6">
          <View className="bg-white rounded-2xl shadow-sm p-4">
            <Text className="text-gray-700 font-semibold mb-3">
              Select Date
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {getNext30Days().map((day) => (
                <TouchableOpacity
                  key={day.date}
                  onPress={() => setSelectedDate(day.date)}
                  className={`mr-3 p-4 rounded-2xl w-20 items-center ${
                    selectedDate === day.date
                      ? "bg-indigo-600 shadow-lg"
                      : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedDate === day.date ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {day.day}
                  </Text>
                  <Text
                    className={`text-2xl font-bold my-1 ${
                      selectedDate === day.date ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {day.dateNum}
                  </Text>
                  <Text
                    className={`text-xs ${
                      selectedDate === day.date
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    {day.month}
                  </Text>
                  {day.isToday && (
                    <View className="mt-1 px-2 py-0.5 rounded-full bg-yellow-400">
                      <Text className="text-xs font-bold text-gray-800">
                        Today
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Search Button */}
        <View className="px-4 mb-8">
          <TouchableOpacity
            onPress={handleSearch}
            className="bg-indigo-600 p-5 rounded-2xl shadow-lg"
          >
            <Text className="text-white text-center text-lg font-bold">
              Search Available Slots
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Info */}
        <View className="px-4 mb-6">
          <View className="bg-blue-50 p-4 rounded-2xl">
            <Text className="text-blue-900 font-semibold mb-1">
              ℹ️ How it works
            </Text>
            <Text className="text-blue-800 text-sm">
              • Each doctor has 30 slots per day{"\n"}• 10 minutes per
              consultation{"\n"}• Book the next available time slot
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchLandingScreen;

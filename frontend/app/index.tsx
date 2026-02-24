import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { useSpecializations } from "@/hooks/queries/useDoctors";
import SearchTypeToggle from "@/components/search/SearchTypeToggle";
import NameSearch from "@/components/search/NameSearch";
import SpecializationSelector from "@/components/search/SpecializationSelector";
import DateSelector from "@/components/search/DateSelector";
import { isWeb } from "@/utils/platform";
import { Ionicons } from "@expo/vector-icons"; // Assuming you use Expo icons

const SearchLandingScreen = () => {
  const router = useRouter();
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

    router.push({
      pathname: "/results",
      params: { searchQuery: query, searchType, selectedDate },
    });
  };

  // --- SHARED UI COMPONENTS ---
  const SearchContent = () => (
    <>
      <SearchTypeToggle searchType={searchType} onToggle={setSearchType} />

      <View className="mt-6">
        {searchType === "name" ? (
          <NameSearch value={searchQuery} onChangeText={setSearchQuery} />
        ) : (
          <SpecializationSelector
            specializations={specializations}
            selectedSpecialization={selectedSpecialization}
            onSelect={setSelectedSpecialization}
          />
        )}
      </View>

      <View className="mt-8">
        <Text className="text-gray-500 font-semibold mb-3 ml-1 uppercase text-xs tracking-widest">
          Select Appointment Date
        </Text>
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          daysToShow={isWeb ? 30 : 14}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSearch}
        className="bg-indigo-600 mt-10 py-5 rounded-2xl shadow-xl shadow-indigo-300 items-center justify-center flex-row"
      >
        <Ionicons
          name="search"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-white text-center text-lg font-bold">
          Search Available Slots
        </Text>
      </TouchableOpacity>
    </>
  );

  // --- WEB LAYOUT ---
  if (isWeb) {
    return (
      <View className="flex-1 bg-slate-50">
        <ScrollView >
          <View className="max-w-full mx-auto w-full px-6 py-16 flex-row gap-12">
            {/* Left Column: Branding & Info */}
            <View className="flex-1 justify-center">
              <View className="bg-indigo-100 self-start px-4 py-1 rounded-full mb-4">
                <Text className="text-indigo-700 font-bold text-sm">
                  Top Rated Healthcare
                </Text>
              </View>
              <Text className="text-slate-900 text-6xl font-extrabold leading-tight mb-6">
                Find and Book the{" "}
                <Text className="text-indigo-600">Best Doctors</Text> Near You
              </Text>
              <Text className="text-slate-600 text-xl leading-relaxed mb-8 max-w-lg">
                Schedule appointments instantly with our certified specialists.
                Simple, fast, and secure booking for your health.
              </Text>
            </View>

            {/* Right Column: Search Card */}
            <View className="flex-1">
              <View className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10">
                <SearchContent />

                <View className="mt-8 pt-8 border-t border-slate-100">
                  <TouchableOpacity
                    onPress={() => router.push("/my-bookings")}
                    className="flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    <View className="flex-row items-center">
                      <View className="bg-white p-2 rounded-lg mr-4 shadow-sm">
                        <Ionicons
                          name="calendar-outline"
                          size={24}
                          color="#4F46E5"
                        />
                      </View>
                      <View>
                        <Text className="text-slate-800 font-bold">
                          View My Bookings
                        </Text>
                        <Text className="text-slate-500 text-sm">
                          Manage your schedule
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#6366F1"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // --- MOBILE LAYOUT ---
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-6">
          <Text className="text-slate-900 text-3xl font-extrabold tracking-tight">
            Find Your Doctor
          </Text>
          <Text className="text-slate-500 text-base mt-1">
            Book an appointment in seconds
          </Text>
        </View>

        <View className="px-6">
          <SearchContent />
        </View>

        <View className="px-6 mt-10">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/my-bookings")}
            className="mt-6 mb-10 bg-indigo-50 p-5 rounded-3xl border border-indigo-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-4">
              <View className="bg-indigo-600 p-2 rounded-xl">
                <Ionicons name="calendar" size={20} color="white" />
              </View>
              <Text className="text-indigo-900 font-bold text-lg">
                My Appointments
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#4338CA" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchLandingScreen;

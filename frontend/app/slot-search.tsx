import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSlotSearch } from "@/hooks/queries/useSlots";
import { useCreateBooking } from "@/hooks/mutations/useCreateBooking";
import SlotCard from "@/components/slot/SlotCard";
import Loader from "@/components/common/Loader";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import EmptyState from "@/components/common/EmptyState";
import { Slot } from "@/api/types";
import { format, addDays } from "date-fns";
import { useState, useMemo } from "react";
import { isWeb } from "@/utils/platform";
/**
 * Slot Search Screen
 *
 * FEATURES:
 * - Search slots by date
 * - Filter by doctor/hospital (passed from previous screen)
 * - Book slot with confirmation
 * - Date selector (next 7 days)
 */
const SlotSearchScreen = () => {
  const router = useRouter();
  const { doctorId, doctorName, hospitalId, hospitalName } =
    useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  const doctorIdNum =
    typeof doctorId === "string" ? Number(doctorId) : undefined;
  const hospitalIdNum =
    typeof hospitalId === "string" ? Number(hospitalId) : undefined;
    
  // Fetch slots
  const { data: slots, isLoading } = useSlotSearch({
    doctorId: doctorIdNum,
    hospitalId: hospitalIdNum,
    date: selectedDate,
  });

  const { mutate: book, isPending: isBooking } = useCreateBooking();

  /**
   * Handle slot booking
   *
   * TODO: Get actual user ID (from auth context)
   * For now, hardcode user ID 1
   */
  const handleSlotPress = (slot: Slot) => {
    Alert.alert(
      "Confirm Booking",
      `Book appointment with ${slot.doctor.name} at ${slot.nextAvailableTime} on ${slot.slotDate}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Book",
          onPress: () => {
            book(
              {
                slotId: slot.id,
                userId: 1,
                patientNotes: "",
              },
              {
                onSuccess: () => {
                  router.push("/bookings");
                },
              },
            );
          },
        },
      ],
    );
  };

  const next7Days = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      days.push({
        date: format(date, "yyyy-MM-dd"),
        display: format(date, "EEE, MMM d"),
        isToday: i === 0,
      });
    }
    return days;
  }, []);

  if (isLoading) return <Loader message="Searching slots..." />;

  // Web Layout
  if (isWeb) {
    return (
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          <View className="max-w-6xl mx-auto w-full px-6 py-8">
            {/* Header */}
            <View className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {doctorName || "All Doctors"}
              </h1>
              {hospitalName && (
                <p className="text-gray-600 text-lg">{hospitalName}</p>
              )}
            </View>

            {/* Date Selector - Grid for Web */}
            <View className="bg-white p-4 mb-6 rounded-lg shadow-sm">
              <Text className="text-lg font-bold text-gray-700 mb-3">
                Select Date:
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {next7Days.map((item) => (
                  <TouchableOpacity
                    key={item.date}
                    onPress={() => setSelectedDate(item.date)}
                    className={`px-6 py-3 rounded-lg ${
                      selectedDate === item.date
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-center font-bold ${
                        selectedDate === item.date
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {item.display}
                    </Text>
                    {item.isToday && (
                      <Text
                        className={`text-xs text-center mt-1 ${
                          selectedDate === item.date
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        Today
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Slots Grid */}
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots && slots.length > 0 ? (
                slots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    onPress={handleSlotPress}
                  />
                ))
              ) : (
                <View className="col-span-full">
                  <EmptyState
                    icon="📅"
                    title={`No available slots for ${selectedDate}`}
                    subtitle="Try selecting a different date"
                  />
                </View>
              )}
            </View>

            {/* View Bookings Button */}
            <View className="mt-6">
              <Button
                title="View My Bookings"
                onPress={() => router.push("/bookings")}
                variant="secondary"
              />
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
        title={doctorName?.toString() || "All Doctors"}
        subtitle={hospitalName?.toString()}
      />

      {/* Date Selector - Horizontal Scroll for Mobile */}
      <View className="bg-white p-3 m-2 rounded-lg">
        <Text className="text-sm font-bold text-gray-700 mb-2">
          Select Date:
        </Text>
        <FlatList
          horizontal
          data={next7Days}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedDate(item.date)}
              className={`px-4 py-3 rounded-lg m-1 ${
                selectedDate === item.date ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  selectedDate === item.date ? "text-white" : "text-gray-700"
                }`}
              >
                {item.display}
              </Text>
              {item.isToday && (
                <Text
                  className={`text-xs text-center ${
                    selectedDate === item.date ? "text-white" : "text-gray-500"
                  }`}
                >
                  Today
                </Text>
              )}
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Slot List */}
      <FlatList
        data={slots || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SlotCard slot={item} onPress={handleSlotPress} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <EmptyState
            icon="📅"
            title={`No available slots for ${selectedDate}`}
            subtitle="Try selecting a different date"
          />
        }
      />

      <Button
        title="View My Bookings"
        onPress={() => router.push("/bookings")}
        variant="secondary"
      />
    </SafeAreaView>
  );
};

export default SlotSearchScreen;

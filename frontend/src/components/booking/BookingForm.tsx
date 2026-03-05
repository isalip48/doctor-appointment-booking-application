import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface BookingFormProps {
  onSubmit: (data: {
    name: string;
    phoneNumber: string;
    nic: string;
    email?: string;
    age?: number;
    gender?: "MALE" | "FEMALE" | "OTHER";
    patientNotes?: string;
  }) => void;
  isSubmitting: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<
    "MALE" | "FEMALE" | "OTHER" | undefined
  >();
  const [patientNotes, setPatientNotes] = useState("");

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter your full name");
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid 10-digit phone number",
      );
      return;
    }
    if (!nic.trim() || nic.length < 9) {
      Alert.alert(
        "Invalid NIC",
        "Please enter a valid NIC number (9-12 digits)",
      );
      return;
    }

    onSubmit({
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      nic: nic.trim(),
      email: email.trim() || undefined,
      age: age ? parseInt(age) : undefined,
      gender,
      patientNotes: patientNotes.trim() || undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-6">
          {/* Header */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-6">
            <View className="flex-row items-center mb-2">
              <View className="bg-indigo-100 p-2 rounded-xl mr-3">
                <Ionicons name="person" size={24} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-black text-slate-900">
                Patient Information
              </Text>
            </View>
            <Text className="text-slate-600">
              Please fill in your details to complete the booking
            </Text>
          </View>

          {/* Required Section */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text className="text-slate-700 font-bold ml-2">
                Required Information
              </Text>
            </View>

            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Full Name <Text className="text-red-500">*</Text>
              </Text>
              <View className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 flex-row items-center">
                <Ionicons name="person-outline" size={20} color="#64748B" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-slate-900"
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Phone Number <Text className="text-red-500">*</Text>
              </Text>
              <View className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 flex-row items-center">
                <Ionicons name="call-outline" size={20} color="#64748B" />
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="0771234567"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-slate-900"
                  editable={!isSubmitting}
                  maxLength={10}
                />
              </View>
              <View className="flex-row items-center mt-2">
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color="#64748B"
                />
                <Text className="text-slate-500 text-xs ml-1">
                  Used to view and manage your bookings
                </Text>
              </View>
            </View>

            {/* NIC Number */}
            <View className="mb-0">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                NIC Number <Text className="text-red-500">*</Text>
              </Text>
              <View className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 flex-row items-center">
                <Ionicons name="card-outline" size={20} color="#64748B" />
                <TextInput
                  value={nic}
                  onChangeText={setNic}
                  placeholder="199912345678 or 123456789V"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-slate-900"
                  editable={!isSubmitting}
                  maxLength={12}
                />
              </View>
              <View className="flex-row items-center mt-2">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={14}
                  color="#64748B"
                />
                <Text className="text-slate-500 text-xs ml-1">
                  Required for verification
                </Text>
              </View>
            </View>
          </View>

          {/* Optional Section */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="add-circle-outline" size={18} color="#64748B" />
              <Text className="text-slate-700 font-bold ml-2">
                Additional Information (Optional)
              </Text>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Email Address
              </Text>
              <View className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="#64748B" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-slate-900"
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Age */}
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Age
              </Text>
              <View className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  placeholder="Enter your age"
                  keyboardType="number-pad"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-slate-900"
                  editable={!isSubmitting}
                  maxLength={3}
                />
              </View>
            </View>

            {/* Gender */}
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-3 text-sm">
                Gender
              </Text>
              <View className="flex-row gap-2">
                {[
                  { value: "MALE", label: "Male", icon: "male" },
                  { value: "FEMALE", label: "Female", icon: "female" },
                  { value: "OTHER", label: "Other", icon: "transgender" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() =>
                      setGender(option.value as "MALE" | "FEMALE" | "OTHER")
                    }
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      borderRadius: 16,
                      backgroundColor:
                        gender === option.value ? "#4F46E5" : "#F8FAFC",
                      borderWidth: 2,
                      borderColor:
                        gender === option.value ? "#4F46E5" : "#E2E8F0",
                    }}
                  >
                    <View className="items-center">
                      <Ionicons
                        name={option.icon as any}
                        size={20}
                        color={gender === option.value ? "white" : "#64748B"}
                      />
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          marginTop: 4,
                          fontSize: 12,
                          color: gender === option.value ? "white" : "#334155",
                        }}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Patient Notes */}
            <View className="mb-0">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Notes for Doctor
              </Text>
              <View className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3">
                <TextInput
                  value={patientNotes}
                  onChangeText={setPatientNotes}
                  placeholder="Any specific concerns or symptoms..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  className="text-base text-slate-900"
                  editable={!isSubmitting}
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={
                isSubmitting ? ["#94A3B8", "#94A3B8"] : ["#4F46E5", "#7C3AED"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 18,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSubmitting ? (
                <>
                  <Ionicons name="hourglass-outline" size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Confirming Booking...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Confirm Booking
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Info Footer */}
          <View className="mt-6 bg-blue-50 rounded-2xl p-4 flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text className="text-slate-700 text-xs ml-3 flex-1 leading-5">
              <Text className="font-bold">Privacy Note:</Text> Your information
              is secure and will only be used for appointment management. Fields
              marked with * are required.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookingForm;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

interface BookingFormProps {
  onSubmit: (data: {
    name: string;
    phoneNumber: string;
    nic: string;
    email?: string;
    age?: number;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    patientNotes?: string;
  }) => void;
  isSubmitting: boolean;
}

/**
 * Booking Form Component
 * 
 * Collects user information for guest booking
 */
const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nic, setNic] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | undefined>();
  const [patientNotes, setPatientNotes] = useState('');

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      Alert.alert('Required', 'Please enter a valid phone number');
      return;
    }
    if (!nic.trim() || nic.length < 9) {
      Alert.alert('Required', 'Please enter a valid NIC');
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
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Patient Information
        </Text>

        {/* Required Fields */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">
            Full Name <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            className="bg-gray-50 p-4 rounded-xl text-gray-800"
            editable={!isSubmitting}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">
            Phone Number <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="0771234567"
            keyboardType="phone-pad"
            className="bg-gray-50 p-4 rounded-xl text-gray-800"
            editable={!isSubmitting}
            maxLength={10}
          />
          <Text className="text-gray-500 text-xs mt-1">
            Used to view your bookings
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">
            NIC Number <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={nic}
            onChangeText={setNic}
            placeholder="123456789V or 199012345678"
            className="bg-gray-50 p-4 rounded-xl text-gray-800"
            editable={!isSubmitting}
            maxLength={12}
          />
          <Text className="text-gray-500 text-xs mt-1">
            Required for verification
          </Text>
        </View>

        {/* Optional Fields */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">
            Email (Optional)
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-gray-50 p-4 rounded-xl text-gray-800"
            editable={!isSubmitting}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">
            Age (Optional)
          </Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="30"
            keyboardType="number-pad"
            className="bg-gray-50 p-4 rounded-xl text-gray-800"
            editable={!isSubmitting}
            maxLength={3}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-3">
            Gender (Optional)
          </Text>
          <View className="flex-row gap-2">
            {['MALE', 'FEMALE', 'OTHER'].map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g as 'MALE' | 'FEMALE' | 'OTHER')}
                disabled={isSubmitting}
                className={`flex-1 p-3 rounded-xl ${
                  gender === g ? 'bg-indigo-600' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    gender === g ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">
            Notes for Doctor (Optional)
          </Text>
          <TextInput
            value={patientNotes}
            onChangeText={setPatientNotes}
            placeholder="Any specific concerns or symptoms..."
            multiline
            numberOfLines={4}
            className="bg-gray-50 p-4 rounded-xl text-gray-800"
            editable={!isSubmitting}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`bg-indigo-600 p-5 rounded-xl ${isSubmitting ? 'opacity-50' : ''}`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-xs text-center mt-4">
          * Required fields
        </Text>
      </View>
    </ScrollView>
  );
};

export default BookingForm;
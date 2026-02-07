import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useSpecializations } from '@/hooks/queries/useDoctors';
import SearchTypeToggle from '@/components/search/SearchTypeToggle';
import NameSearch from '@/components/search/NameSearch';
import SpecializationSelector from '@/components/search/SpecializationSelector';
import DateSelector from '@/components/search/DateSelector';
import InfoCard from '@/components/search/InfoCard';
import { isWeb } from '@/utils/platform';

const SearchLandingScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'specialization'>('name');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const { data: specializations } = useSpecializations();

  const handleSearch = () => {
    const query = searchType === 'specialization' ? selectedSpecialization : searchQuery;
    if (!query) {
      alert('Please select a doctor or specialization');
      return;
    }

    router.push({
      pathname: '/results',
      params: { searchQuery: query, searchType, selectedDate },
    });
  };

  // Web Layout
  if (isWeb) {
    return (
      <View className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50">
        <ScrollView className="flex-1">
          <View className="max-w-4xl mx-auto w-full px-6 py-12">
            {/* Web Header - Large and centered */}
            <View className="text-center mb-8">
              <Text className="text-black text-5xl font-bold mb-3">
                Find Your Doctor
              </Text>
              <Text className="text-black/70 text-xl">
                Search by name or specialization
              </Text>
            </View>

            <View className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
              <SearchTypeToggle searchType={searchType} onToggle={setSearchType} />

              {searchType === 'name' ? (
                <NameSearch value={searchQuery} onChangeText={setSearchQuery} />
              ) : (
                <SpecializationSelector
                  specializations={specializations}
                  selectedSpecialization={selectedSpecialization}
                  onSelect={setSelectedSpecialization}
                />
              )}

              <DateSelector
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                daysToShow={30}
              />

              {/* Search Button */}
              <View className="px-4 mb-4">
                <TouchableOpacity
                  onPress={handleSearch}
                  className="bg-indigo-600 hover:bg-indigo-700 p-6 rounded-2xl shadow-lg transition-all"
                >
                  <Text className="text-white text-center text-xl font-bold">
                    Search Available Slots
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <InfoCard />
          </View>
        </ScrollView>
      </View>
    );
  }

  // Mobile/Native Layout
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Mobile Header - Compact */}
        <View className="px-4 pt-2 pb-4">
          <Text className="text-black text-2xl font-bold mb-1">Find Your Doctor</Text>
          <Text className="text-black/70 text-sm">Search by name or specialization</Text>
        </View>

        <SearchTypeToggle searchType={searchType} onToggle={setSearchType} />

        {searchType === 'name' ? (
          <NameSearch value={searchQuery} onChangeText={setSearchQuery} />
        ) : (
          <SpecializationSelector
            specializations={specializations}
            selectedSpecialization={selectedSpecialization}
            onSelect={setSelectedSpecialization}
          />
        )}

        <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

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

        <InfoCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchLandingScreen;
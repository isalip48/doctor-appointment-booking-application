import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HospitalListScreen from '@/screens/HospitalList/HospitalList.screen';
import DoctorListScreen from '@/screens/DoctorList/DoctorList.screen';
import SlotSearchScreen from '@/screens/slotSearch/SlotSearch.screen';
import MyBookingsScreen from '@/screens/MyBookings/MyBookings.screen';

/**
 * Navigation Types
 * 
 * WHY: Type safety for navigation params
 */
export type RootStackParamList = {
  HospitalList: undefined;
  DoctorList: { 
    hospitalId?: number; 
    hospitalName?: string;
  };
  SlotSearch: {
    doctorId?: number;
    doctorName?: string;
    hospitalId?: number;
    hospitalName?: string;
  };
  MyBookings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * App Navigator
 * 
 * FLOW:
 * 1. Hospital List (start)
 * 2. Doctor List (filtered by hospital)
 * 3. Slot Search (filtered by doctor)
 * 4. My Bookings (view/cancel bookings)
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="HospitalList"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="HospitalList" 
          component={HospitalListScreen} 
        />
        <Stack.Screen 
          name="DoctorList" 
          component={DoctorListScreen} 
        />
        <Stack.Screen 
          name="SlotSearch" 
          component={SlotSearchScreen} 
        />
        <Stack.Screen 
          name="MyBookings" 
          component={MyBookingsScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
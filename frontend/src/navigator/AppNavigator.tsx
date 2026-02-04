import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppointmentListScreen from "@/screens/AppointmentList/AppointmentList.screen";
import MyBookingsScreen from "@/screens/MyBookings/MyBookings.screen";

// 1. Define the types for your routes
export type RootStackParamList = {
  AppointmentList: undefined;
  MyBookings: undefined;
};

// 2. Pass the ParamList to the Stack creator
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      {/* 3. Ensure your screens match the names in RootStackParamList */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="AppointmentList"
          component={AppointmentListScreen}
        />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

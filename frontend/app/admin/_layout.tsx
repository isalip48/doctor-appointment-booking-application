import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="doctors" />
      <Stack.Screen name="slots" />
      <Stack.Screen name="bookings" />
    </Stack>
  );
}
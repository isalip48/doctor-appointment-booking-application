import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from 'react';
import "../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Load Ionicons from CDN for web
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/@expo/vector-icons@13.0.0/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf';
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/ttf';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
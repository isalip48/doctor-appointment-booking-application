import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "@/components/common/Logo";
import { PLATFORM } from "@/utils/platform";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "@/api/client";

interface DashboardStats {
  totalDoctors: number;
  totalHospitals: number;
  totalSlots: number;
  availableSlots: number;
  totalBookings: number;
  upcomingBookings?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/admin/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      Alert.alert("Error", "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("adminToken");
    router.replace("/admin/login");
  };

  const adminCards = [
    {
      title: "Manage Doctors",
      description: "Add, edit, or remove doctors",
      icon: "medical",
      color: ["#4F46E5", "#7C3AED"],
      route: "/admin/doctors",
      stat: stats?.totalDoctors || 0,
      statLabel: "Doctors",
    },
    {
      title: "Manage Slots",
      description: "Generate availability schedules",
      icon: "calendar",
      color: ["#10B981", "#059669"],
      route: "/admin/slots",
      stat: stats?.availableSlots || 0,
      statLabel: "Available",
    },
    {
      title: "View Bookings",
      description: "Monitor appointments",
      icon: "list",
      color: ["#F59E0B", "#D97706"],
      route: "/admin/bookings",
      stat: stats?.totalBookings || 0,
      statLabel: "Total",
    },
    {
      title: "Hospitals",
      description: "Manage hospital information",
      icon: "business",
      color: ["#EF4444", "#DC2626"],
      route: "/admin/hospitals",
      stat: stats?.totalHospitals || 0,
      statLabel: "Hospitals",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white border-b border-slate-200 px-6 py-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-900">
                Admin Dashboard
              </Text>
              <Text className="text-slate-500 mt-1">
                DocSync Hospital Management
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Logo size={60} />
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-100 p-3 rounded-xl"
              >
                <Ionicons name="log-out" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-slate-900 mb-4">
            Quick Stats
          </Text>
          <View
            className={`flex-row flex-wrap ${PLATFORM.ISWEB ? "gap-4" : "gap-3"}`}
          >
            {adminCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(card.route as any)}
                activeOpacity={0.9}
                className={`${
                  PLATFORM.ISWEB ? "w-[calc(50%-8px)]" : "w-[48%]"
                } bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200`}
              >
                <LinearGradient
                  colors={card.color as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-4"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="bg-white/20 p-3 rounded-xl">
                      <Ionicons
                        name={card.icon as any}
                        size={24}
                        color="white"
                      />
                    </View>
                    <View className="items-end">
                      <Text className="text-white text-2xl font-black">
                        {loading ? "..." : card.stat}
                      </Text>
                      <Text className="text-white/80 text-xs font-semibold">
                        {card.statLabel}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white font-bold text-base mb-1">
                    {card.title}
                  </Text>
                  <Text className="text-white/80 text-xs">
                    {card.description}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-slate-900 mb-4">
            Quick Actions
          </Text>
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => router.push("/admin/doctors")}
              className="bg-white rounded-2xl p-4 border border-slate-200 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="bg-indigo-100 p-3 rounded-xl mr-3">
                  <Ionicons name="add" size={20} color="#4F46E5" />
                </View>
                <Text className="text-slate-900 font-semibold">
                  Add New Doctor
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/admin/slots")}
              className="bg-white rounded-2xl p-4 border border-slate-200 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="bg-green-100 p-3 rounded-xl mr-3">
                  <Ionicons name="calendar" size={20} color="#10B981" />
                </View>
                <Text className="text-slate-900 font-semibold">
                  Generate Slots
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 py-4">
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="flex-row items-center justify-center py-3"
          >
            <Ionicons name="arrow-back" size={18} color="#64748B" />
            <Text className="text-slate-600 font-semibold ml-2">
              Back to Main App
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
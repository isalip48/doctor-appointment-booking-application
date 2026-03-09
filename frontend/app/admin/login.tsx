import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@/components/common/Logo";
import { PLATFORM } from "@/utils/platform";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Simple hardcoded auth for now (you can connect to backend later)
    if (username === "admin" && password === "admin123") {
      setLoading(true);
      await AsyncStorage.setItem("adminToken", "logged-in");
      setTimeout(() => {
        setLoading(false);
        router.replace("/admin/dashboard");
      }, 500);
    } else {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="flex-1 justify-center px-6">
        <View className={PLATFORM.ISWEB ? "max-w-md mx-auto w-full" : "w-full"}>
          {/* Logo */}
          <View className="items-center mb-8">
            <Logo size={120} />
            <Text className="text-3xl font-black text-slate-900 mt-4">
              Admin Portal
            </Text>
            <Text className="text-slate-500 mt-2">
              DocSync Hospital Management
            </Text>
          </View>

          {/* Login Card */}
          <View className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <Text className="text-2xl font-bold text-slate-900 mb-6">
              Sign In
            </Text>

            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Username
              </Text>
              <View className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 flex-row items-center">
                <Ionicons name="person" size={20} color="#64748B" />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="admin"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-slate-900"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Password
              </Text>
              <View className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 flex-row items-center">
                <Ionicons name="lock-closed" size={20} color="#64748B" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-slate-900"
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={loading ? ["#94A3B8", "#94A3B8"] : ["#4F46E5", "#7C3AED"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 16,
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="log-in" size={20} color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View className="bg-amber-50 rounded-xl p-4 mt-6 border border-amber-200">
              <Text className="text-amber-800 text-xs">
                <Text className="font-bold">Demo Credentials:</Text> admin / admin123
              </Text>
            </View>
          </View>

          {/* Back to Main App */}
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="flex-row items-center justify-center mt-6 py-3"
          >
            <Ionicons name="arrow-back" size={18} color="#64748B" />
            <Text className="text-slate-600 font-semibold ml-2">
              Back to Main App
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { PLATFORM } from "@/utils/platform";
import Logo from "@/components/common/Logo";
import { analyzeMedicalReport } from "@/services/aiService";

export default function MedicalReportsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    message: string;
    specialty: string | null;
  } | null>(null);
  const [fileName, setFileName] = useState("");

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });

      if (!result.canceled) {
        setLoading(true);
        setFileName(result.assets[0].name);

        const base64 = await FileSystem.readAsStringAsync(
          result.assets[0].uri,
          {
            encoding: "base64",
          },
        );

        const res = await analyzeMedicalReport(
          base64,
          result.assets[0].mimeType || "image/jpeg",
        );
        setAnalysis(res);
      }
    } catch (err) {
      Alert.alert("Error", "Could not analyze the document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION - MATCHING AI ASSISTANT */}
        <View className="px-6 items-center pt-4 pb-6">
          <View className="-mt-10 -mb-10">
            <Logo size={PLATFORM.ISWEB ? 320 : 200} />
          </View>

          <View className="bg-violet-100 px-4 py-1.5 rounded-full mb-4">
            <Text className="text-violet-600 font-bold text-[10px] tracking-widest uppercase">
              Smart Analysis
            </Text>
          </View>

          <Text className="text-3xl font-black text-slate-900 text-center leading-tight mb-4">
            Report <Text className="text-violet-600">Analyzer</Text>
          </Text>

          <Text className="text-slate-500 text-center text-base mb-6 px-2 leading-relaxed">
            Upload your lab results or medical scans. DocSync AI will summarize
            them and find the right specialist for you.
          </Text>
        </View>

        <View className="px-6 flex-1">
          {!analysis && !loading ? (
            /* UPLOAD BUTTON AREA */
            <TouchableOpacity
              onPress={pickDocument}
              activeOpacity={0.8}
              className="w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl items-center justify-center bg-slate-50"
            >
              <View className="bg-violet-600 p-4 rounded-full mb-3 shadow-lg shadow-violet-200">
                <Ionicons name="add" size={32} color="white" />
              </View>
              <Text className="text-slate-900 font-bold text-lg">
                Upload Report
              </Text>
              <Text className="text-slate-400 text-xs mt-1">
                PDF, JPEG, or PNG supported
              </Text>
            </TouchableOpacity>
          ) : (
            /* RESULTS AREA */
            <View>
              <View className="bg-slate-100 p-4 rounded-2xl flex-row items-center mb-6">
                <Ionicons name="document-attach" size={24} color="#7C3AED" />
                <Text
                  className="ml-3 text-slate-700 font-semibold flex-1"
                  numberOfLines={1}
                >
                  {fileName}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAnalysis(null);
                    setFileName("");
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {loading ? (
                <View className="py-12 items-center">
                  <ActivityIndicator size="large" color="#7C3AED" />
                  <Text className="mt-4 text-slate-500 font-medium italic">
                    DocSync AI is reading your report...
                  </Text>
                </View>
              ) : (
                <View className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 mb-10">
                  <View className="flex-row items-center mb-4">
                    <Ionicons name="sparkles" size={20} color="#7C3AED" />
                    <Text className="ml-2 text-slate-900 font-black text-lg">
                      AI Summary
                    </Text>
                  </View>

                  <Text className="text-slate-600 leading-6 text-[15px] mb-8">
                    {analysis?.message}
                  </Text>

                  {analysis?.specialty && (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/search",
                          params: { specialty: analysis.specialty },
                        })
                      }
                      className="overflow-hidden rounded-2xl shadow-md"
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={["#7C3AED", "#5B21B6"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="py-4 flex-row items-center justify-center"
                      >
                        <Ionicons name="calendar" size={20} color="white" />
                        <Text className="text-white font-bold text-lg ml-3">
                          Book {analysis.specialty}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        </View>

        {/* HOME BUTTON */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center justify-center py-4"
        >
          <Ionicons name="arrow-back" size={18} color="#64748B" />
          <Text className="text-slate-600 font-semibold ml-2">
            Back to Home
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <View className="py-8 items-center border-t border-slate-50">
          <Text className="text-slate-300 text-[10px] uppercase tracking-[2px] font-bold">
            © 2024 DocSync Digital Health
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

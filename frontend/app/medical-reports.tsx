import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { PLATFORM } from "@/utils/platform";
import Logo from "@/components/common/Logo";
import { analyzeMedicalReport } from "@/services/aiService";

/**
 * HELPER: fileToBase64
 * Purpose: Converts a Web browser 'File' object into a Base64 string.
 * Why: AI models usually can't "read" a file path from your computer;
 * they need the raw data encoded as a long string of text (Base64).
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // When the file is finished being read...
    reader.onload = () => {
      const result = reader.result as string;
      // result looks like "data:image/png;base64,iVBORw..."
      // We split by the comma and take the second part [1] to get just the raw data.
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file); // Starts the reading process
  });
};

export default function MedicalReportsPage() {
  const router = useRouter();

  // -- STATE MANAGEMENT --
  const [loading, setLoading] = useState(false); // Shows/hides the spinner
  const [analysis, setAnalysis] = useState<{
    // Stores the AI's response
    message: string;
    specialty: string | null;
  } | null>(null);
  const [fileName, setFileName] = useState(""); // Stores the name of the picked file
  const [error, setError] = useState(""); // Stores error messages to show the user

  /**
   * FUNCTION: handleImagePick
   * Purpose: Specifically for Mobile users to open their Photo Gallery.
   */
  const handleImagePick = async () => {
    try {
      setError("");

      // 1. Request Permission: Mobile devices require explicit user "OK" to see photos
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant photo library access");
        return;
      }

      // 2. Open Gallery: launchImageLibraryAsync opens the system UI
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true, // IMPORTANT: Tells Expo to convert the image to base64 immediately
      });

      // 3. Process Result: Check if the user didn't cancel and actually picked something
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setFileName(asset.fileName || "medical-report.jpg");
        setLoading(true);

        if (!asset.base64) throw new Error("No base64 data available");

        // 4. Send to AI: Use the base64 string provided by the picker
        const res = await analyzeMedicalReport(asset.base64, "image/jpeg");
        setAnalysis(res);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setLoading(false); // Stop the spinner regardless of success or failure
    }
  };

  /**
   * FUNCTION: handleDocumentPick
   * Purpose: Allows picking PDFs or Images from the system file browser (Mobile & Web).
   */
  const handleDocumentPick = async () => {
    try {
      setError("");

      // 1. Open File Browser: Allows PDF and Image types
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setFileName(asset.name);
        setLoading(true);

        let base64: string;

        // 2. Platform Logic: Browsers and Phones handle files very differently
        if (PLATFORM.ISWEB) {
          // On Web: result.output contains the actual browser File object
          if (result.output && result.output[0]) {
            base64 = await fileToBase64(result.output[0]);
          } else {
            throw new Error("No file output available");
          }
        } else {
          // On Mobile: Files live in a file system. We must read the file
          // from its URI (location) and convert it to Base64 manually.
          const FileSystem = require("expo-file-system/legacy");
          base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        // 3. Send to AI: Pass the converted string and the file type (MIME)
        const res = await analyzeMedicalReport(
          base64,
          asset.mimeType || "image/jpeg",
        );

        setAnalysis(res);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  /**
   * FUNCTION: resetAnalysis
   * Purpose: Clears all states so the user can "Start Over" with a new file.
   */
  const resetAnalysis = () => {
    setAnalysis(null);
    setFileName("");
    setError("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* HERO SECTION */}
        <View
          className="relative overflow-hidden"
          style={{ paddingTop: PLATFORM.ISWEB ? 40 : 0 }}
        >
          <View
            className={
              PLATFORM.ISWEB ? "max-w-6xl mx-auto w-full px-12" : "px-6"
            }
          >
            <View
              className={
                PLATFORM.ISWEB
                  ? "flex-row items-center py-8"
                  : "items-center pt-4 pb-10"
              }
            >
              {/* LEFT CONTENT */}
              <View
                className={
                  PLATFORM.ISWEB ? "flex-1 pr-12" : "w-full items-center"
                }
              >
                <View
                  className={`${!PLATFORM.ISWEB && "items-center -mt-10 -mb-10"}`}
                >
                  <Logo size={PLATFORM.ISWEB ? 320 : 200} />
                </View>

                {/* HEADLINE */}
                <Text
                  style={{ fontSize: PLATFORM.ISWEB ? 56 : 34 }}
                  className={`font-black text-slate-900 leading-tight mb-6 ${
                    !PLATFORM.ISWEB && "text-center"
                  }`}
                >
                  Medical Report{"\n"}
                  <Text className="text-violet-600">Analyzer</Text>
                </Text>

                {/* DESCRIPTION */}
                <Text
                  className={`text-slate-500 text-lg mb-8 leading-relaxed ${
                    !PLATFORM.ISWEB && "text-center px-2"
                  }`}
                >
                  Upload your lab results or medical scans. AI will analyze them
                  and recommend the right specialist.
                </Text>

                {/* WEB FEATURES */}
                {PLATFORM.ISWEB && (
                  <View className="gap-4 mb-8">
                    {[
                      { icon: "document-text", text: "PDF & image support" },
                      { icon: "analytics", text: "AI-powered analysis" },
                      { icon: "medical", text: "Specialist recommendations" },
                    ].map((item, index) => (
                      <View key={index} className="flex-row items-center">
                        <View className="bg-violet-100 p-3 rounded-xl mr-4">
                          <Ionicons
                            name={item.icon as any}
                            size={24}
                            color="#7C3AED"
                          />
                        </View>
                        <Text className="text-slate-700 font-semibold text-lg">
                          {item.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* BACK BUTTON - WEB ONLY */}
                {PLATFORM.ISWEB && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    className="flex-row items-center"
                  >
                    <Ionicons name="arrow-back" size={20} color="#64748B" />
                    <Text className="text-slate-600 font-semibold ml-2">
                      Back to Home
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* RIGHT CARD - UPLOAD/RESULTS */}
              <View
                className={PLATFORM.ISWEB ? "flex-[1.5] mt-20" : "w-full mt-4"}
              >
                <View className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                  {/* Error Message */}
                  {error && (
                    <View className="bg-red-50 p-4 rounded-2xl mb-4 border border-red-200">
                      <Text className="text-red-700 text-sm">{error}</Text>
                    </View>
                  )}

                  {!analysis && !loading ? (
                    /* UPLOAD OPTIONS */
                    <View>
                      <Text className="text-2xl font-bold text-slate-900 mb-6">
                        Upload Medical Report
                      </Text>

                      {/* Upload from Gallery - Mobile Only */}
                      {!PLATFORM.ISWEB && (
                        <TouchableOpacity
                          onPress={handleImagePick}
                          activeOpacity={0.8}
                          className="mb-4"
                        >
                          <View className="border-2 border-dashed border-violet-200 rounded-2xl p-6 bg-violet-50">
                            <View className="flex-row items-center">
                              <View className="bg-violet-600 p-3 rounded-xl mr-4">
                                <Ionicons
                                  name="images"
                                  size={24}
                                  color="white"
                                />
                              </View>
                              <View className="flex-1">
                                <Text className="text-slate-900 font-bold text-base mb-1">
                                  From Gallery
                                </Text>
                                <Text className="text-slate-500 text-xs">
                                  Select an image from your device
                                </Text>
                              </View>
                              <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#7C3AED"
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}

                      {/* Upload from Files */}
                      <TouchableOpacity
                        onPress={handleDocumentPick}
                        activeOpacity={0.8}
                      >
                        <View className="border-2 border-dashed border-violet-200 rounded-2xl p-6 bg-violet-50">
                          <View className="flex-row items-center">
                            <View className="bg-violet-600 p-3 rounded-xl mr-4">
                              <Ionicons
                                name="document"
                                size={24}
                                color="white"
                              />
                            </View>
                            <View className="flex-1">
                              <Text className="text-slate-900 font-bold text-base mb-1">
                                {PLATFORM.ISWEB ? "Upload File" : "From Files"}
                              </Text>
                              <Text className="text-slate-500 text-xs">
                                PDF, JPEG, or PNG supported
                              </Text>
                            </View>
                            <Ionicons
                              name="chevron-forward"
                              size={20}
                              color="#7C3AED"
                            />
                          </View>
                        </View>
                      </TouchableOpacity>

                      <View className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-100">
                        <View className="flex-row items-start">
                          <Ionicons
                            name="information-circle"
                            size={18}
                            color="#3B82F6"
                          />
                          <Text className="text-blue-800 text-xs ml-3 flex-1 leading-5">
                            <Text className="font-bold">Privacy:</Text> Your
                            reports are analyzed securely and not stored on our
                            servers
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    /* RESULTS AREA */
                    <View>
                      {/* File Info */}
                      {fileName && (
                        <View className="bg-slate-100 p-4 rounded-2xl flex-row items-center mb-6">
                          <Ionicons
                            name="document-attach"
                            size={24}
                            color="#7C3AED"
                          />
                          <Text
                            className="ml-3 text-slate-700 font-semibold flex-1"
                            numberOfLines={1}
                          >
                            {fileName}
                          </Text>
                          {!loading && (
                            <TouchableOpacity onPress={resetAnalysis}>
                              <Ionicons
                                name="close-circle"
                                size={24}
                                color="#94A3B8"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}

                      {loading ? (
                        <View className="py-12 items-center">
                          <ActivityIndicator size="large" color="#7C3AED" />
                          <Text className="mt-4 text-slate-500 font-semibold">
                            Analyzing your report...
                          </Text>
                          <Text className="mt-2 text-slate-400 text-xs">
                            This may take a few seconds
                          </Text>
                        </View>
                      ) : analysis ? (
                        <View>
                          <View className="flex-row items-center mb-4">
                            <Ionicons
                              name="sparkles"
                              size={20}
                              color="#7C3AED"
                            />
                            <Text className="ml-2 text-slate-900 font-black text-lg">
                              AI Analysis Results
                            </Text>
                          </View>

                          <View className="bg-violet-50 rounded-2xl p-5 mb-6 border border-violet-100">
                            <Text className="text-slate-700 leading-6 text-[15px]">
                              {analysis.message}
                            </Text>
                          </View>

                          {analysis.specialty && (
                            <TouchableOpacity
                              onPress={() =>
                                router.push({
                                  pathname: "/search",
                                  params: { specialty: analysis.specialty },
                                })
                              }
                              activeOpacity={0.9}
                            >
                              <LinearGradient
                                colors={["#7C3AED", "#5B21B6"]}
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
                                <Ionicons
                                  name="calendar"
                                  size={20}
                                  color="white"
                                />
                                <Text className="text-white font-bold text-lg ml-3">
                                  Book {analysis.specialty}
                                </Text>
                                <Ionicons
                                  name="arrow-forward"
                                  size={16}
                                  color="white"
                                  style={{ marginLeft: 8 }}
                                />
                              </LinearGradient>
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity
                            onPress={resetAnalysis}
                            className="mt-4 py-3 items-center"
                          >
                            <Text className="text-violet-600 font-semibold">
                              Upload Another Report
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  )}

                  {/* BACK BUTTON - MOBILE ONLY */}
                  {!PLATFORM.ISWEB && !loading && (
                    <TouchableOpacity
                      onPress={() => router.replace("/")}
                      className="flex-row items-center justify-center mt-6 py-3 border-t border-slate-200"
                    >
                      <Ionicons name="arrow-back" size={18} color="#64748B" />
                      <Text className="text-slate-600 font-semibold ml-2 text-sm">
                        Back to Home
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View className="mt-auto py-8 border-t border-slate-50 items-center">
          <Text className="text-slate-300 text-[10px] uppercase tracking-[2px] font-bold">
            © 2024 DocSync Digital Health
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

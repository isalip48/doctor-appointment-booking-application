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

/*
---------------------------------------------------------
Helper function: Convert File to Base64 (Web only)
---------------------------------------------------------

The AI API expects files in base64 format.

On web platforms, the DocumentPicker returns a File object.
This helper converts that file into base64 using FileReader.

Steps:
1. Read file as data URL
2. Remove the prefix (data:image/jpeg;base64,)
3. Return only the base64 data
*/

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      // Remove prefix like "data:image/jpeg;base64,"
      const base64 = result.split(",")[1];

      resolve(base64);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

export default function MedicalReportsPage() {
  const router = useRouter();

  /*
  ---------------------------------------------------------
  State Variables
  ---------------------------------------------------------
  */

  // Shows loading spinner while AI analyzes report
  const [loading, setLoading] = useState(false);

  // Stores AI analysis response
  const [analysis, setAnalysis] = useState<{
    message: string;
    specialty: string | null;
  } | null>(null);

  // Stores uploaded file name to display to user
  const [fileName, setFileName] = useState("");

  // Stores error messages
  const [error, setError] = useState("");

  /*
  ---------------------------------------------------------
  Function: handleImagePick (Mobile Gallery Upload)
  ---------------------------------------------------------

  This function allows users to upload a report from
  their mobile gallery.

  Steps:
  1. Ask permission to access gallery
  2. Open image picker
  3. Convert selected image to base64
  4. Send it to AI service
  5. Store analysis results
  */

  const handleImagePick = async () => {
    try {
      setError("");

      // Request permission to access photo gallery
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant photo library access to upload reports",
        );

        return;
      }

      // Launch gallery picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,

        quality: 0.8,

        // Automatically generate base64 data
        base64: true,
      });

      // If user selected an image
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        setFileName(asset.fileName || "medical-report.jpg");

        setLoading(true);

        // Safety check
        if (!asset.base64) {
          throw new Error("No base64 data available");
        }

        /*
        Send the base64 image to AI for analysis
        */

        const res = await analyzeMedicalReport(asset.base64, "image/jpeg");

        // Store AI response
        setAnalysis(res);
      }
    } catch (err: any) {
      console.error("Image picker error:", err);

      setError(err.message || "Failed to upload image");

      Alert.alert(
        "Error",
        err.message || "Could not upload image. Please try again.",
      );
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  /*
  ---------------------------------------------------------
  Function: handleDocumentPick (Files / PDF Upload)
  ---------------------------------------------------------

  Allows users to upload:
  - PDFs
  - Images

  Works differently on:
  - Web
  - Mobile

  Web → convert File object to base64
  Mobile → read file from device storage
  */

  const handleDocumentPick = async () => {
    try {
      setError("");

      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],

        copyToCacheDirectory: true,
      });

      // If user selected a file
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        setFileName(asset.name);

        setLoading(true);

        let base64: string;

        /*
        Platform-specific handling
        */

        if (PLATFORM.ISWEB) {
          // On web we convert the File object
          if (result.output && result.output[0]) {
            base64 = await fileToBase64(result.output[0]);
          } else {
            throw new Error("No file output available");
          }
        } else {
          /*
          On mobile we read file from device storage
          */

          const FileSystem = require("expo-file-system/legacy");

          base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        // Send base64 file to AI for analysis
        const res = await analyzeMedicalReport(
          base64,
          asset.mimeType || "image/jpeg",
        );

        setAnalysis(res);
      }
    } catch (err: any) {
      console.error("Document picker error:", err);

      setError(err.message || "Failed to upload document");

      Alert.alert(
        "Error",
        err.message || "Could not analyze the document. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ---------------------------------------------------------
  Function: resetAnalysis
  ---------------------------------------------------------

  Clears all uploaded data and resets page
  so the user can upload another report.
  */

  const resetAnalysis = () => {
    setAnalysis(null);

    setFileName("");

    setError("");
  };

  /*
  ---------------------------------------------------------
  UI Layout
  ---------------------------------------------------------

  The page layout consists of:

  HERO SECTION
  - Logo
  - Title
  - Description

  RIGHT CARD
  - Upload UI
  - AI analysis results

  FOOTER
  */

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* HERO SECTION */}
        {/* This is the main landing section with logo and description */}

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
              {/* LEFT SIDE CONTENT
                  Logo + headline + explanation
              */}

              <View
                className={
                  PLATFORM.ISWEB ? "flex-1 pr-12" : "w-full items-center"
                }
              >
                {/* Application logo */}
                <View
                  className={`${!PLATFORM.ISWEB && "items-center -mt-10 -mb-10"}`}
                >
                  <Logo size={PLATFORM.ISWEB ? 320 : 200} />
                </View>

                {/* Page title */}
                <Text
                  style={{ fontSize: PLATFORM.ISWEB ? 56 : 34 }}
                  className={`font-black text-slate-900 leading-tight mb-6 ${
                    !PLATFORM.ISWEB && "text-center"
                  }`}
                >
                  Medical Report{"\n"}
                  <Text className="text-violet-600">Analyzer</Text>
                </Text>

                {/* Description explaining the feature */}
                <Text
                  className={`text-slate-500 text-lg mb-8 leading-relaxed ${
                    !PLATFORM.ISWEB && "text-center px-2"
                  }`}
                >
                  Upload your lab results or medical scans. AI will analyze them
                  and recommend the right specialist.
                </Text>
              </View>

              {/* RIGHT SIDE CARD */}
              {/* Contains upload UI and results */}

              <View
                className={PLATFORM.ISWEB ? "flex-[1.5] mt-20" : "w-full mt-4"}
              >
                <View className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                  {/* Display errors if any */}
                  {error && (
                    <View className="bg-red-50 p-4 rounded-2xl mb-4 border border-red-200">
                      <Text className="text-red-700 text-sm">{error}</Text>
                    </View>
                  )}

                  {/* UPLOAD AREA (shown when no analysis exists) */}

                  {!analysis && !loading ? (
                    <View>
                      <Text className="text-2xl font-bold text-slate-900 mb-6">
                        Upload Medical Report
                      </Text>

                      {/* Upload from device files */}
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
                                Upload File
                              </Text>

                              <Text className="text-slate-500 text-xs">
                                PDF, JPEG, or PNG supported
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        {/* Appears at the bottom of the page */}

        <View className="mt-auto py-8 border-t border-slate-50 items-center">
          <Text className="text-slate-300 text-[10px] uppercase tracking-[2px] font-bold">
            © 2024 DocSync Digital Health
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

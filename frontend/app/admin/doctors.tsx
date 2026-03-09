import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PLATFORM } from "@/utils/platform";
import { apiClient } from "@/api/client";
import * as DocumentPicker from "expo-document-picker";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: number;
  hospitalId: number;
  hospitalName: string;
}

interface Hospital {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
}

export default function ManageDoctors() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualifications: "",
    experienceYears: "",
    consultationFee: "",
    hospitalId: "",
  });

  useEffect(() => {
    fetchDoctors();
    fetchHospitals();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get("/admin/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      Alert.alert("Error", "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await apiClient.get("/admin/hospitals");
      setHospitals(response.data);
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialization: "",
      qualifications: "",
      experienceYears: "",
      consultationFee: "",
      hospitalId: "",
    });
    setEditingDoctor(null);
    setShowForm(false);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      qualifications: doctor.qualifications || "",
      experienceYears: doctor.experienceYears?.toString() || "",
      consultationFee: doctor.consultationFee?.toString() || "",
      hospitalId: doctor.hospitalId?.toString() || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.specialization || !formData.hospitalId) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        experienceYears: formData.experienceYears
          ? parseInt(formData.experienceYears)
          : null,
        consultationFee: formData.consultationFee
          ? parseFloat(formData.consultationFee)
          : null,
        hospitalId: parseInt(formData.hospitalId),
      };

      if (editingDoctor) {
        await apiClient.put(`/admin/doctors/${editingDoctor.id}`, payload);
        Alert.alert("Success", "Doctor updated successfully!");
      } else {
        await apiClient.post("/admin/doctors", payload);
        Alert.alert("Success", "Doctor added successfully!");
      }

      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error("Failed to save doctor:", error);
      Alert.alert("Error", "Failed to save doctor");
    }
  };

  const handleDelete = (doctor: Doctor) => {
    if (PLATFORM.ISWEB) {
      if (
        confirm(
          `Are you sure you want to delete ${doctor.name}? This action cannot be undone.`
        )
      ) {
        deleteDoctor(doctor.id);
      }
    } else {
      Alert.alert(
        "Delete Doctor",
        `Are you sure you want to delete ${doctor.name}? This action cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteDoctor(doctor.id),
          },
        ]
      );
    }
  };

  const deleteDoctor = async (id: number) => {
    try {
      await apiClient.delete(`/admin/doctors/${id}`);
      Alert.alert("Success", "Doctor deleted successfully!");
      fetchDoctors();
    } catch (error) {
      console.error("Failed to delete doctor:", error);
      Alert.alert("Error", "Failed to delete doctor");
    }
  };

  const handleCSVImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        // For web
        if (PLATFORM.ISWEB && result.output && result.output[0]) {
          const file = result.output[0];
          const text = await file.text();
          parseCSV(text);
        } else {
          // For mobile
          const FileSystem = require("expo-file-system/legacy");
          const text = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          parseCSV(text);
        }
      }
    } catch (error) {
      console.error("CSV import error:", error);
      Alert.alert("Error", "Failed to import CSV");
    }
  };

  const parseCSV = async (text: string) => {
    try {
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((h) => h.trim());

      // Validate headers
      const requiredHeaders = ["name", "specialization", "hospitalName"];
      const hasRequired = requiredHeaders.every((h) => headers.includes(h));

      if (!hasRequired) {
        Alert.alert(
          "Error",
          "CSV must have columns: name, specialization, hospitalName"
        );
        return;
      }

      const doctors = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const doctor: any = {};

        headers.forEach((header, index) => {
          doctor[header] = values[index];
        });

        doctors.push(doctor);
      }

      // Send to backend
      const response = await apiClient.post("/admin/doctors/bulk", { doctors });

      Alert.alert(
        "Import Complete",
        `Successfully imported ${response.data.success} doctors. ${
          response.data.failed > 0 ? `Failed: ${response.data.failed}` : ""
        }`
      );

      fetchDoctors();
    } catch (error) {
      console.error("Parse error:", error);
      Alert.alert("Error", "Failed to parse CSV file");
    }
  };

  const downloadCSVTemplate = () => {
    const template = `name,specialization,hospitalName,qualifications,experienceYears,consultationFee
Dr. John Doe,Cardiology,National Hospital,MBBS MD,15,5000.00
Dr. Jane Smith,Neurology,Asiri Hospital,MBBS DM,12,4500.00`;

    if (PLATFORM.ISWEB) {
      const blob = new Blob([template], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "doctors_template.csv";
      a.click();
    } else {
      Alert.alert(
        "Template",
        "CSV Format:\nname,specialization,hospitalName,qualifications,experienceYears,consultationFee"
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white border-b border-slate-200 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900">
              Manage Doctors
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={downloadCSVTemplate}
                className="bg-slate-100 p-2 rounded-xl"
              >
                <Ionicons name="download" size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCSVImport}
                className="bg-green-100 p-2 rounded-xl"
              >
                <Ionicons name="cloud-upload" size={20} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="bg-indigo-100 p-2 rounded-xl"
              >
                <Ionicons
                  name={showForm ? "close" : "add"}
                  size={20}
                  color="#4F46E5"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Add/Edit Form */}
        {showForm && (
          <View className="bg-white m-4 p-6 rounded-2xl border border-slate-200">
            <Text className="text-lg font-bold text-slate-900 mb-4">
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </Text>

            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Doctor Name *
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Dr. John Doe"
                className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
              />
            </View>

            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Specialization *
              </Text>
              <TextInput
                value={formData.specialization}
                onChangeText={(text) =>
                  setFormData({ ...formData, specialization: text })
                }
                placeholder="Cardiology"
                className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
              />
            </View>

            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Hospital *
              </Text>
              <View className="bg-slate-50 rounded-2xl border-2 border-slate-200">
                <select
                  value={formData.hospitalId}
                  onChange={(e) =>
                    setFormData({ ...formData, hospitalId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-transparent text-slate-900"
                  style={{ outline: "none" }}
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-sm">
                Qualifications
              </Text>
              <TextInput
                value={formData.qualifications}
                onChangeText={(text) =>
                  setFormData({ ...formData, qualifications: text })
                }
                placeholder="MBBS, MD"
                className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
              />
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 text-sm">
                  Experience (Years)
                </Text>
                <TextInput
                  value={formData.experienceYears}
                  onChangeText={(text) =>
                    setFormData({ ...formData, experienceYears: text })
                  }
                  placeholder="15"
                  keyboardType="numeric"
                  className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
                />
              </View>

              <View className="flex-1">
                <Text className="text-slate-700 font-semibold mb-2 text-sm">
                  Consultation Fee
                </Text>
                <TextInput
                  value={formData.consultationFee}
                  onChangeText={(text) =>
                    setFormData({ ...formData, consultationFee: text })
                  }
                  placeholder="5000.00"
                  keyboardType="numeric"
                  className="bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={resetForm}
                className="flex-1 bg-slate-100 py-4 rounded-2xl"
              >
                <Text className="text-slate-700 font-bold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1"
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#4F46E5", "#7C3AED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-white font-bold">
                    {editingDoctor ? "Update" : "Add"} Doctor
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Doctors List */}
        <View className="px-4 py-2">
          {doctors.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center">
              <Ionicons name="medical" size={48} color="#CBD5E1" />
              <Text className="text-slate-400 mt-4 text-center">
                No doctors yet. Add your first doctor!
              </Text>
            </View>
          ) : (
            doctors.map((doctor) => (
              <View
                key={doctor.id}
                className="bg-white p-4 rounded-2xl mb-3 border border-slate-200"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-900">
                      {doctor.name}
                    </Text>
                    <Text className="text-indigo-600 font-semibold text-sm">
                      {doctor.specialization}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEdit(doctor)}
                      className="bg-indigo-100 p-2 rounded-lg"
                    >
                      <Ionicons name="create" size={18} color="#4F46E5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(doctor)}
                      className="bg-red-100 p-2 rounded-lg"
                    >
                      <Ionicons name="trash" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="border-t border-slate-100 pt-2 mt-2">
                  <Text className="text-slate-600 text-sm mb-1">
                    <Text className="font-semibold">Hospital:</Text>{" "}
                    {doctor.hospitalName || "N/A"}
                  </Text>
                  {doctor.qualifications && (
                    <Text className="text-slate-600 text-sm mb-1">
                      <Text className="font-semibold">Qualifications:</Text>{" "}
                      {doctor.qualifications}
                    </Text>
                  )}
                  <View className="flex-row justify-between mt-2">
                    {doctor.experienceYears && (
                      <Text className="text-slate-500 text-xs">
                        {doctor.experienceYears} years exp.
                      </Text>
                    )}
                    {doctor.consultationFee && (
                      <Text className="text-green-600 font-semibold text-sm">
                        Rs. {doctor.consultationFee}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
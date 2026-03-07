import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getSpecialistRecommendation, ChatMessage } from "@/services/aiService";
import { LinearGradient } from "expo-linear-gradient"; // Ensure this is installed: npx expo install expo-linear-gradient
import { PLATFORM } from "@/utils/platform";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  specialty?: string | null;
}

export default function AIAssistantPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your DocSync AI. Describe your symptoms, and I'll help you find the right care.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiHistory, setApiHistory] = useState<ChatMessage[]>([]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    const updatedHistory: ChatMessage[] = [
      ...apiHistory,
      { role: "user", parts: [{ text: userText }] },
    ];
    setApiHistory(updatedHistory);
    setInput("");
    setIsTyping(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const result = await getSpecialistRecommendation(updatedHistory);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: result.message,
        sender: "ai",
        specialty: result.specialty,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setApiHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: result.rawText }] },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "I'm having a bit of trouble. Could you repeat that?",
          sender: "ai",
        },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Header unchanged */}
      <View className="px-6 py-4 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full"
        >
          <Ionicons name="chevron-back" size={28} color="#4f46e5" />
        </TouchableOpacity>
        <View className="ml-2">
          <Text className="text-lg font-bold text-slate-900">DocSync AI</Text>
          <View className="flex-row items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            <Text className="text-xs text-slate-500">Always active</Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View
            className={`mb-4 ${item.sender === "user" ? "items-end" : "items-start"}`}
          >
            <View
              className={`flex-row items-end ${item.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              {item.sender === "ai" && (
                <View className="w-8 h-8 rounded-full bg-indigo-50 items-center justify-center mr-2 mb-1 border border-indigo-100">
                  <Ionicons name="medical" size={14} color="#4f46e5" />
                </View>
              )}

              <View
                style={{ elevation: 1 }}
                className={`p-3 px-4 rounded-2xl shadow-sm ${
                  item.sender === "user"
                    ? "bg-indigo-600 rounded-br-none ml-12" // ml-12 ensures it doesn't hit the left side
                    : "bg-white rounded-bl-none border border-slate-100 mr-12" // mr-12 ensures it doesn't hit the right side
                }`}
              >
                <Text
                  className={`text-[15px] leading-5 ${item.sender === "user" ? "text-white" : "text-slate-800"}`}
                >
                  {item.text}
                </Text>
              </View>
            </View>

            {item.specialty && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/search",
                    params: { specialty: item.specialty },
                  })
                }
                className="mt-3 ml-10 self-start overflow-hidden rounded-xl shadow-sm shadow-indigo-200"
              >
                <LinearGradient
                  colors={["#4f46e5", "#6366f1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-2.5 px-5 flex-row items-center"
                >
                  <Text className="text-white font-bold mr-2 text-sm">
                    Book {item.specialty}
                  </Text>
                  <Ionicons name="calendar" size={14} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={PLATFORM.ISIOS ? "padding" : "height"}
        keyboardVerticalOffset={PLATFORM.ISIOS ? 8 : 0}
      >
        <View className="p-4 bg-white border-t border-slate-100 shadow-2xl">
          {isTyping && (
            <View className="flex-row items-center mb-3 ml-2">
              <ActivityIndicator size="small" color="#4f46e5" />
              <Text className="ml-2 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                AI analyzing...
              </Text>
            </View>
          )}
          <View className="flex-row items-center bg-slate-100 rounded-2xl px-3 py-1 border border-transparent">
            <TextInput
              style={PLATFORM.ISWEB ? ({ outlineStyle: "none" } as any) : {}}
              className="flex-1 text-slate-900 py-2.5 min-h-[40px] max-h-[100px] text-[16px]"
              placeholder="Describe symptoms..."
              placeholderTextColor="#94a3b8"
              value={input}
              onChangeText={setInput}
              multiline
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={isTyping || !input.trim()}
              className={`ml-2 w-10 h-10 rounded-xl items-center justify-center ${
                input.trim() ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getSpecialistRecommendation, ChatMessage } from "@/services/aiService";
import { LinearGradient } from "expo-linear-gradient";
import { PLATFORM } from "@/utils/platform";
import Logo from "@/components/common/Logo";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  specialty?: string | null;
}

export default function AIAssistantPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your DocSync AI Assistant. Describe your symptoms, and I'll help you find the right specialist.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiHistory, setApiHistory] = useState<ChatMessage[]>([]);

  const flatListRef = useRef<ScrollView>(null);

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
          text: "I'm having trouble connecting. Could you try again?",
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
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={PLATFORM.ISIOS ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={PLATFORM.ISIOS ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

                  {/* HEADLINE - WEB ONLY */}
                  {PLATFORM.ISWEB && (
                    <Text
                      style={{ fontSize: 56 }}
                      className="font-black text-slate-900 leading-tight mb-6"
                    >
                      AI Health{"\n"}
                      <Text className="text-indigo-600">Assistant</Text>
                    </Text>
                  )}

                  {/* DESCRIPTION */}
                  <Text
                    className={`text-slate-500 text-lg mb-8 leading-relaxed ${
                      !PLATFORM.ISWEB && "text-center px-2"
                    }`}
                  >
                    Describe your symptoms to{" "}
                    <Text className="text-black"> DocSync</Text>
                    <Text className="text-indigo-600"> AI</Text> and get instant
                    specialist recommendations powered by AI.
                  </Text>

                  {/* WEB FEATURES */}
                  {PLATFORM.ISWEB && (
                    <View className="gap-4 mb-8">
                      {[
                        {
                          icon: "sparkles",
                          text: "AI-powered recommendations",
                        },
                        { icon: "medical", text: "Specialist matching" },
                        { icon: "time", text: "Instant responses" },
                      ].map((item, index) => (
                        <View key={index} className="flex-row items-center">
                          <View className="bg-indigo-100 p-3 rounded-xl mr-4">
                            <Ionicons
                              name={item.icon as any}
                              size={24}
                              color="#4F46E5"
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

                {/* CHAT CARD */}
                <View
                  className={PLATFORM.ISWEB ? "flex-[1.5] mt-20" : "w-full"}
                >
                  <View
                    className={`${
                      PLATFORM.ISWEB
                        ? "bg-white rounded-3xl shadow-2xl border border-slate-200"
                        : ""
                    } overflow-hidden`}
                  >
                    {PLATFORM.ISWEB && (
                      <View className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                        <View className="flex-row items-center">
                          <View className="flex-1">
                            <Text className="text-lg font-bold text-slate-900">
                              DocSync AI
                            </Text>
                            <View className="flex-row items-center">
                              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                              <Text className="text-xs text-slate-500">
                                Always active
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Messages Area */}
                    <View
                      style={{
                        height: PLATFORM.ISWEB ? 500 : 450,
                        backgroundColor: PLATFORM.ISWEB ? "#FAFAFA" : "#FFFFFF",
                      }}
                    >
                      <ScrollView
                        ref={flatListRef}
                        contentContainerStyle={{
                          padding: PLATFORM.ISWEB ? 20 : 16,
                          paddingBottom: 20,
                        }}
                        showsVerticalScrollIndicator={false}
                      >
                        {messages.map((item) => (
                          <View
                            key={item.id}
                            className={`mb-4 ${
                              item.sender === "user"
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <View
                              className={`flex-row items-end ${
                                item.sender === "user" ? "flex-row-reverse" : ""
                              }`}
                              style={{
                                maxWidth: PLATFORM.ISWEB ? "70%" : "85%",
                              }}
                            >
                              <View
                                className={`p-4 rounded-2xl shadow-sm ${
                                  item.sender === "user"
                                    ? "bg-indigo-600 rounded-br-sm"
                                    : "bg-slate-50 rounded-bl-sm border border-slate-200"
                                }`}
                                style={{ flex: 1 }}
                              >
                                <Text
                                  className={`text-[15px] leading-6 ${
                                    item.sender === "user"
                                      ? "text-white"
                                      : "text-slate-800"
                                  }`}
                                >
                                  {item.text}
                                </Text>
                              </View>
                            </View>

                            {/* Specialty Recommendation Button */}
                            {item.specialty && (
                              <TouchableOpacity
                                onPress={() =>
                                  router.push({
                                    pathname: "/search",
                                    params: { specialty: item.specialty },
                                  })
                                }
                                className="mt-3 ml-10 overflow-hidden rounded-xl shadow-md"
                                activeOpacity={0.9}
                              >
                                <LinearGradient
                                  colors={["#10B981", "#059669"]}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons
                                    name="calendar"
                                    size={16}
                                    color="white"
                                  />
                                  <Text className="text-white font-bold ml-2 text-sm">
                                    Book {item.specialty}
                                  </Text>
                                  <Ionicons
                                    name="arrow-forward"
                                    size={14}
                                    color="white"
                                    style={{ marginLeft: 8 }}
                                  />
                                </LinearGradient>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Input Area */}
                    <View className="px-4 pt-3 pb-2 bg-white border-t border-slate-200">
                      {isTyping && (
                        <View className="flex-row items-center mb-3 px-2">
                          <ActivityIndicator size="small" color="#4F46E5" />
                          <Text className="ml-2 text-slate-500 text-xs font-semibold">
                            DocSync AI is thinking...
                          </Text>
                        </View>
                      )}
                      <View className="flex-row items-center bg-slate-50 rounded-2xl px-4 py-1 border-2 border-slate-200">
                        <TextInput
                          style={
                            PLATFORM.ISWEB
                              ? ({ outlineStyle: "none" } as any)
                              : {}
                          }
                          className="flex-1 text-slate-900 py-3 text-base"
                          placeholder="Describe your symptoms..."
                          placeholderTextColor="#94A3B8"
                          value={input}
                          onChangeText={setInput}
                          maxLength={500}
                          underlineColorAndroid="transparent"
                          returnKeyType="send"
                          onSubmitEditing={handleSend}
                        />
                        <TouchableOpacity
                          onPress={handleSend}
                          disabled={isTyping || !input.trim()}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="send" size={18} color="indigo" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View>
          {/* BACK BUTTON - MOBILE ONLY */}
          {!PLATFORM.ISWEB && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center justify-center border-slate-200 bg-white"
            >
              <Ionicons name="arrow-back" size={18} color="#64748B" />
              <Text className="text-slate-600 font-semibold ml-2 text-sm">
                Home
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FOOTER */}
        <View className="py-6 items-center">
          <Text className="text-slate-300 text-[10px] uppercase tracking-[2px] font-bold">
            © 2024 DocSync Digital Health
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import React, { useState, useRef } from "react";
import { 
  View, Text, TouchableOpacity, TextInput, FlatList, 
  KeyboardAvoidingView, Platform, ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getSpecialistRecommendation } from "@/services/aiService"; // Import your service

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  specialty?: string | null;
}

export default function AIAssistantPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your DocSync AI. Describe your symptoms, and I'll suggest the right specialist.", sender: 'ai' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg: Message = { id: Date.now().toString(), text: userText, sender: 'user' };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Scroll to bottom after user sends message
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // CALL THE AI SERVICE
      const result = await getSpecialistRecommendation(userText);
      
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: result.message, 
        sender: 'ai',
        specialty: result.specialty 
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: "I'm having trouble connecting right now. Please try again later.", 
        sender: 'ai' 
      }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-slate-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Health AI Assistant</Text>
        <View className="w-6" />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        renderItem={({ item }) => (
          <View className={`mb-4 max-w-[85%] ${item.sender === 'user' ? 'self-end' : 'self-start'}`}>
            <View className={`p-4 rounded-2xl ${
              item.sender === 'user' 
              ? 'bg-indigo-600 rounded-tr-none' 
              : 'bg-slate-100 rounded-tl-none'
            }`}>
              <Text className={item.sender === 'user' ? 'text-white' : 'text-slate-800'}>
                {item.text}
              </Text>
            </View>

            {/* ACTION BUTTON: Only show if AI suggests a specialty */}
            {item.specialty && (
              <TouchableOpacity 
                onPress={() => router.push({ pathname: "/search", params: { specialty: item.specialty } })}
                className="mt-2 bg-indigo-50 border border-indigo-100 py-3 px-4 rounded-xl flex-row items-center justify-between"
              >
                <Text className="text-indigo-600 font-bold">Book {item.specialty}</Text>
                <Ionicons name="calendar-outline" size={18} color="#4f46e5" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View className="px-6 py-2 flex-row items-center">
          <ActivityIndicator size="small" color="#4f46e5" />
          <Text className="ml-2 text-slate-400 italic text-xs">AI is analyzing symptoms...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="p-4 border-t border-slate-100 flex-row items-center bg-white mb-2">
          <TextInput
            className="flex-1 bg-slate-50 p-4 rounded-2xl text-slate-900 mr-3 max-h-32"
            placeholder="e.g. I have a persistent headache..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity 
            onPress={handleSend}
            disabled={isTyping}
            className={`p-4 rounded-2xl ${isTyping ? 'bg-slate-200' : 'bg-indigo-600'}`}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
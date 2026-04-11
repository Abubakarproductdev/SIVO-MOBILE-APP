import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech'; // ✅ IMPORTED SPEECH ENGINE
import {
  RotateCcw,
  Volume2,
  ArrowRight,
} from 'lucide-react-native';
import { useChat } from '../../ChatContext';
import COLORS from '../constants/colors';

// =============================================
// LIVE CONVERSATION SCREEN (Chat Module)
// =============================================
function LiveConversationScreen({ navigate }) {
  // ✅ FIX: Recieve 'navigate' prop

  const { messages, endConversation } = useChat();
  const scrollViewRef = useRef();

  // 1. AUTO-SPEAK LOGIC
  // Since we use custom nav, we just check the latest message in context
  useEffect(() => {
    if (messages.length > 0) {
      // Speak the most recent message when screen mounts
      const lastMsg = messages[messages.length - 1];
      speakText(lastMsg.text);
    }
  }, []); // Run once on mount

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const speakText = (text) => {
    try {
      Speech.stop();
      Speech.speak(text, { language: 'en', rate: 0.9 });
    } catch (e) { console.log("Speech Error:", e); }
  };

  const handleRepeat = () => {
    if (messages.length > 0) speakText(messages[messages.length - 1].text);
  };

  const handleNext = () => {
    // ✅ FIX: Use 'navigate' with 'SignToSpeech' string
    if (navigate) navigate('SpeechToSign');
  };

  const handleEndChat = () => {
    Alert.alert("End Chat", "Save conversation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save",
        onPress: () => {
          endConversation();
          if (navigate) navigate('History');
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgDark }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 20, paddingBottom: 5, borderBottomWidth: 1, borderColor: COLORS.border }}>
        <Text style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold' }}>Live Chat</Text>
        <TouchableOpacity onPress={handleEndChat} style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }}>
          <Text style={{ color: COLORS.error, fontSize: 12, fontWeight: 'bold' }}>End</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} style={{ flex: 1, paddingHorizontal: 20,paddingTop: 20 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg, index) => (
          <View key={index} style={{ alignItems: 'flex-end', marginBottom: 15 }}>
            <View style={{ backgroundColor: COLORS.bgElevated, padding: 15, borderRadius: 16, maxWidth: '85%' }}>
              <Text style={{ color: '#FFF', fontSize: 18 }}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FOOTER */}
      <View style={{ height: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: COLORS.bgCard, borderTopWidth: 1, borderColor: COLORS.border }}>

        {/* Retry */}
        <TouchableOpacity onPress={handleNext} style={{ alignItems: 'center', width: 80 }}>
          <RotateCcw color={COLORS.textSecondary} size={24} />
          <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 5 }}>Retry</Text>
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity onPress={handleRepeat} style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Volume2 color="#000" size={32} />
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={handleNext} style={{ alignItems: 'center', width: 80 }}>
          <ArrowRight color={COLORS.primary} size={28} />
          <Text style={{ color: COLORS.primary, fontSize: 12, marginTop: 5 }}>Next</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

export default LiveConversationScreen;

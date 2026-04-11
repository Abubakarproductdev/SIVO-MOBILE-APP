import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Speech from 'expo-speech'; 
import {
  RotateCcw,
  Volume2,
  ArrowRight,
} from 'lucide-react-native';
import { useChat } from '../../ChatContext';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

// =============================================
// LIVE CONVERSATION SCREEN (Chat Module)
// =============================================
function LiveConversationScreen({ navigate }) {
  const { messages, endConversation } = useChat();
  const scrollViewRef = useRef();

  // 1. AUTO-SPEAK LOGIC
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      speakText(lastMsg.text);
    }
  }, []);

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
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Chat</Text>
        <TouchableOpacity onPress={handleEndChat} style={styles.endButton}>
          <Text style={styles.endButtonText}>End</Text>
        </TouchableOpacity>
      </View>

      {/* CHAT AREA */}
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.chatContainer} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageWrapper}>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        {/* Retry */}
        <TouchableOpacity onPress={handleNext} style={styles.footerAction}>
          <RotateCcw color={COLORS.textSecondary} size={24} />
          <Text style={styles.footerLabel}>Retry</Text>
        </TouchableOpacity>

        {/* Repeat (Primary Action) */}
        <TouchableOpacity onPress={handleRepeat} style={styles.repeatButton}>
          <Volume2 color="#000" size={32} />
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={handleNext} style={styles.footerAction}>
          <ArrowRight color={COLORS.primary} size={28} />
          <Text style={[styles.footerLabel, { color: COLORS.primary }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 10, 
    paddingHorizontal: SPACING.xl, 
    paddingBottom: SPACING.sm, 
    borderBottomWidth: 1, 
    borderColor: COLORS.border 
  },
  headerTitle: { color: COLORS.textPrimary, fontSize: TYPOGRAPHY.size.header, fontWeight: TYPOGRAPHY.weight.bold },
  endButton: { 
    backgroundColor: 'rgba(239, 68, 68, 0.2)', 
    paddingVertical: 6, 
    paddingHorizontal: SPACING.md, 
    borderRadius: RADIUS.xxl 
  },
  endButtonText: { color: COLORS.error, fontSize: TYPOGRAPHY.size.small, fontWeight: TYPOGRAPHY.weight.bold },
  chatContainer: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  chatContent: { paddingBottom: SPACING.xl },
  messageWrapper: { alignItems: 'flex-end', marginBottom: SPACING.lg },
  messageBubble: { 
    backgroundColor: COLORS.bgElevated, 
    padding: SPACING.lg, 
    borderRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xs,
    maxWidth: '85%' 
  },
  messageText: { color: '#FFF', fontSize: TYPOGRAPHY.size.header },
  footer: { 
    height: 120, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-evenly', 
    backgroundColor: COLORS.bgCard, 
    borderTopWidth: 1, 
    borderColor: COLORS.border,
    paddingBottom: 20 
  },
  footerAction: { alignItems: 'center', width: 80 },
  footerLabel: { color: COLORS.textSecondary, fontSize: TYPOGRAPHY.size.small, marginTop: 5 },
  repeatButton: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: COLORS.accent, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
});

export default LiveConversationScreen;

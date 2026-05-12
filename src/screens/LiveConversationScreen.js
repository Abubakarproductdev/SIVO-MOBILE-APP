import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  RotateCcw,
  Volume2,
  ArrowRight,
} from 'lucide-react-native';
import { useChat } from '../../ChatContext';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

// =============================================
// LIVE CONVERSATION SCREEN (DEEP SPACE)
// =============================================
function LiveConversationScreen({ navigate }) {
  const { messages, endConversation } = useChat();
  const scrollViewRef = useRef();
  const [saving, setSaving] = useState(false);

  // 1. AUTO-SPEAK LOGIC
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.direction === 'sign-to-speech') {
        speakText(lastMsg.text);
      }
    }
  }, [messages]);

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

  const handleRetry = () => {
    if (navigate) navigate('SignToSpeech');
  };

  const handleEndChat = () => {
    Alert.alert("End Chat", "Save conversation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save",
        onPress: async () => {
          setSaving(true);
          try {
            await endConversation();
            if (navigate) navigate('History');
          } catch (error) {
            Alert.alert('Save Failed', error.message);
          } finally {
            setSaving(false);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Ambient glow */}
      <View style={styles.glowAccent} />

      {/* HEADER */}
      <BlurView intensity={30} tint="dark" style={styles.header}>
        <Text style={styles.headerTitle}>Live Chat</Text>
        <TouchableOpacity onPress={handleEndChat} style={styles.endButton} disabled={saving}>
          <Text style={styles.endButtonText}>{saving ? 'Saving' : 'End'}</Text>
        </TouchableOpacity>
      </BlurView>

      {/* CHAT AREA */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => {
          const isSpeechToSign = msg.direction === 'speech-to-sign';

          return (
          <View
            key={msg.id || index}
            style={[
              styles.messageWrapper,
              isSpeechToSign ? styles.messageWrapperRight : styles.messageWrapperLeft,
            ]}
          >
            <LinearGradient
              colors={isSpeechToSign ? [COLORS.primary, COLORS.primaryEnd] : [COLORS.accent, COLORS.accentEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.messageBubble,
                isSpeechToSign ? styles.messageBubbleRight : styles.messageBubbleLeft,
              ]}
            >
              <Text style={styles.messageMeta}>
                {isSpeechToSign ? 'Speech to Sign' : 'Sign to Speech'}
              </Text>
              <Text style={styles.messageText}>{msg.text}</Text>
              {!!msg.timestamp && <Text style={styles.messageTime}>{msg.timestamp}</Text>}
            </LinearGradient>
          </View>
          );
        })}
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <BlurView intensity={30} tint="dark" style={styles.footer}>
        {/* Retry */}
        <TouchableOpacity onPress={handleRetry} style={styles.footerAction}>
          <RotateCcw color={COLORS.textSecondary} size={24} />
          <Text style={styles.footerLabel}>Retry</Text>
        </TouchableOpacity>

        {/* Repeat (Primary Action) */}
        <TouchableOpacity onPress={handleRepeat} style={styles.repeatButtonWrapper}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.repeatButton}
          >
            <Volume2 color="#FFF" size={32} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={handleNext} style={styles.footerAction}>
          <ArrowRight color={COLORS.primaryEnd} size={28} />
          <Text style={[styles.footerLabel, { color: COLORS.primaryEnd }]}>Next</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  glowAccent: {
    position: 'absolute', bottom: 100, left: -80, width: 200, height: 200,
    borderRadius: 100, backgroundColor: COLORS.accent, opacity: 0.08,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(10,10,26,0.6)',
  },
  headerTitle: { fontFamily: TYPOGRAPHY.fontFamily.heading, color: '#FFF', fontSize: TYPOGRAPHY.size.header, letterSpacing: 1 },
  endButton: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(244,63,94,0.3)',
  },
  endButtonText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, color: COLORS.error, fontSize: TYPOGRAPHY.size.small },
  chatContainer: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  chatContent: { paddingBottom: SPACING.xl },
  messageWrapper: { marginBottom: SPACING.lg },
  messageWrapperLeft: { alignItems: 'flex-start' },
  messageWrapperRight: { alignItems: 'flex-end' },
  messageBubble: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    maxWidth: '85%',
  },
  messageBubbleLeft: { borderTopLeftRadius: RADIUS.sm },
  messageBubbleRight: { borderTopRightRadius: RADIUS.sm },
  messageMeta: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: 'rgba(255,255,255,0.78)',
    fontSize: TYPOGRAPHY.size.tiny,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  messageText: { fontFamily: TYPOGRAPHY.fontFamily.body, color: '#FFF', fontSize: TYPOGRAPHY.size.header },
  messageTime: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  footer: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(10,10,26,0.65)',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 20,
  },
  footerAction: { alignItems: 'center', width: 80 },
  footerLabel: { fontFamily: TYPOGRAPHY.fontFamily.body, color: COLORS.textSecondary, fontSize: TYPOGRAPHY.size.small, marginTop: 5 },
  repeatButtonWrapper: { ...SHADOWS.glowAccent },
  repeatButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LiveConversationScreen;

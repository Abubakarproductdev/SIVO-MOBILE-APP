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
import {
  RotateCcw,
  Volume2,
  ArrowRight,
} from 'lucide-react-native';
import { useChat } from '../../ChatContext';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

function LiveConversationScreen({ navigate }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Chat</Text>
        <TouchableOpacity onPress={handleEndChat} style={styles.endButton} disabled={saving}>
          <Text style={styles.endButtonText}>{saving ? 'Saving' : 'End'}</Text>
        </TouchableOpacity>
      </View>

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
            {isSpeechToSign ? (
              <View style={[styles.messageBubble, styles.messageBubbleRight, styles.speechToSignBubble]}>
                <Text style={styles.messageMeta}>Speech to Sign</Text>
                <Text style={styles.messageText}>{msg.text}</Text>
                {!!msg.timestamp && <Text style={styles.messageTime}>{msg.timestamp}</Text>}
              </View>
            ) : (
              <LinearGradient
                colors={[colors.accent, colors.accentEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.messageBubble, styles.messageBubbleLeft]}
              >
                <Text style={styles.messageMeta}>Sign to Speech</Text>
                <Text style={styles.messageText}>{msg.text}</Text>
                {!!msg.timestamp && <Text style={styles.messageTime}>{msg.timestamp}</Text>}
              </LinearGradient>
            )}
          </View>
          );
        })}
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        {/* Retry */}
        <TouchableOpacity onPress={handleRetry} style={styles.footerAction}>
          <RotateCcw color={colors.textSecondary} size={24} />
          <Text style={styles.footerLabel}>Retry</Text>
        </TouchableOpacity>

        {/* Repeat (Primary Action) */}
        <TouchableOpacity onPress={handleRepeat} style={styles.repeatButtonWrapper}>
          <LinearGradient
            colors={[colors.accent, colors.accentEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.repeatButton}
          >
            <Volume2 color={colors.onPrimary} size={32} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={handleNext} style={styles.footerAction}>
          <ArrowRight color={colors.accent} size={28} />
          <Text style={[styles.footerLabel, { color: colors.accent }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.bgCard,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: { fontFamily: TYPOGRAPHY.fontFamily.heading, color: colors.textPrimary, fontSize: 20 },
  endButton: {
    backgroundColor: colors.error,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xxl,
  },
  endButtonText: { fontFamily: TYPOGRAPHY.fontFamily.heading, color: colors.onPrimary, fontSize: 14 },
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
  speechToSignBubble: {
    backgroundColor: colors.bgElevated,
  },
  messageMeta: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: colors.textSecondary,
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  messageText: { fontFamily: TYPOGRAPHY.fontFamily.body, color: colors.textPrimary, fontSize: 16 },
  messageTime: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  footer: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingBottom: SPACING.md,
  },
  footerAction: { alignItems: 'center', width: 80 },
  footerLabel: { fontFamily: TYPOGRAPHY.fontFamily.body, color: colors.textSecondary, fontSize: 12, marginTop: 5 },
  repeatButtonWrapper: { ...SHADOWS.glowAccent, marginTop: -20 },
  repeatButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LiveConversationScreen;

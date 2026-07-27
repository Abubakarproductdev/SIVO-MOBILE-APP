import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ArrowLeft } from 'lucide-react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

// =============================================
// HISTORY DETAIL SCREEN (DEEP SPACE)
// =============================================
function HistoryDetailScreen({ item, navigate }) {
  if (!item) return null;

  const messagesToDisplay = item.messages || item.fullMessages || [{ text: item.previewText, timestamp: item.date }];
  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={['rgba(10,10,26,0.98)', 'rgba(10,10,26,0.85)']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigate('History', null, { replace: true })} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{item.type} Session</Text>
          <Text style={styles.headerSubtitle}>{formatDate(item.endedAt || item.date)}</Text>
        </View>
      </LinearGradient>

      {/* CHAT LOG */}
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messagesToDisplay.map((msg, index) => {
          const isSpeechToSign = msg.direction === 'speech-to-sign';

          return (
          <View
            key={msg.id || index}
            style={[
              styles.messageWrapper,
              isSpeechToSign ? styles.messageWrapperRight : styles.messageWrapperLeft,
            ]}
          >
            <BlurView
              intensity={20}
              tint="dark"
              style={[
                styles.messageBubble,
                isSpeechToSign ? styles.messageBubbleRight : styles.messageBubbleLeft,
              ]}
            >
              <Text style={styles.messageMeta}>
                {isSpeechToSign ? 'Speech to Sign' : 'Sign to Speech'}
              </Text>
              <Text style={styles.messageText}>{msg.text}</Text>
              {msg.timestamp && (
                <Text style={styles.messageTime}>{msg.timestamp}</Text>
              )}
            </BlurView>
          </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: { paddingRight: SPACING.lg },
  headerTitle: { fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: TYPOGRAPHY.size.header, color: '#FFF', letterSpacing: 1 },
  headerSubtitle: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: TYPOGRAPHY.size.small, color: COLORS.textMuted, marginTop: 2 },
  chatContainer: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  chatContent: { paddingBottom: 40 },
  messageWrapper: { marginBottom: SPACING.lg },
  messageWrapperLeft: { alignItems: 'flex-start' },
  messageWrapperRight: { alignItems: 'flex-end' },
  messageBubble: {
    backgroundColor: COLORS.bgElevated,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  messageBubbleLeft: { borderTopLeftRadius: RADIUS.sm },
  messageBubbleRight: { borderTopRightRadius: RADIUS.sm },
  messageMeta: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.tiny,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  messageText: { fontFamily: TYPOGRAPHY.fontFamily.body, color: '#FFF', fontSize: TYPOGRAPHY.size.subtitle, lineHeight: 22 },
  messageTime: { fontFamily: TYPOGRAPHY.fontFamily.body, color: COLORS.textMuted, fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
});

export default HistoryDetailScreen;

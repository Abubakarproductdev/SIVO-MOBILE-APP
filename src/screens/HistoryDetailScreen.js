import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

// =============================================
// HISTORY DETAIL SCREEN
// =============================================
function HistoryDetailScreen({ item, navigate }) {
  if (!item) return null;

  const messagesToDisplay = item.messages || [{ text: item.previewText, timestamp: item.date }];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('History')} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{item.type} Session</Text>
          <Text style={styles.headerSubtitle}>{item.date}</Text>
        </View>
      </View>

      {/* CHAT LOG */}
      <ScrollView 
        style={styles.chatContainer} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messagesToDisplay.map((msg, index) => (
          <View key={index} style={styles.messageWrapper}>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{msg.text}</Text>
              {msg.timestamp && (
                <Text style={styles.messageTime}>{msg.timestamp}</Text>
              )}
            </View>
          </View>
        ))}
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
    backgroundColor: COLORS.bgDark 
  },
  backButton: { paddingRight: SPACING.lg },
  headerTitle: { fontSize: TYPOGRAPHY.size.header, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary },
  headerSubtitle: { fontSize: TYPOGRAPHY.size.small, color: COLORS.textSecondary },
  chatContainer: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  chatContent: { paddingBottom: 40 },
  messageWrapper: { alignItems: 'flex-end', marginBottom: SPACING.lg },
  messageBubble: { 
    backgroundColor: COLORS.bgElevated, 
    padding: SPACING.lg, 
    borderRadius: RADIUS.xl, 
    borderTopRightRadius: RADIUS.xs, 
    maxWidth: '85%' 
  },
  messageText: { color: '#FFF', fontSize: TYPOGRAPHY.size.subtitle, lineHeight: 22 },
  messageTime: { color: COLORS.textMuted, fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
});

export default HistoryDetailScreen;

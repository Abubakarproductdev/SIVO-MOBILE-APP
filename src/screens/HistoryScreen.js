import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useChat } from '../../ChatContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

export default function HistoryScreen({ navigate }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { history, historyLoading, loadHistory } = useChat();

  useEffect(() => {
    loadHistory().catch((error) => Alert.alert('History Error', error.message));
  }, [loadHistory]);

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <View style={styles.historyBg}>
      <ScrollView
        style={styles.historyContainer}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {historyLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 80 }} />
        ) : history.length === 0 ? (
          <View style={{ marginTop: 80, alignItems: 'center' }}>
            <Text style={styles.emptyText}>No saved conversations yet.</Text>
            <Text style={styles.emptySubtext}>Start a session and save it to history.</Text>
          </View>
        ) : (
          history.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              activeOpacity={0.9}
              onPress={() => navigate('HistoryDetail', item)}
            >
              <Card style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.historyTag}
                  >
                    <Text style={styles.historyTagText}>{item.type}</Text>
                  </LinearGradient>
                  <Text style={styles.historyTime}>{formatDate(item.endedAt || item.date)}</Text>
                </View>
                <Text style={styles.historyText} numberOfLines={2}>
                  {item.previewText}
                </Text>
                <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={styles.viewLink}>Tap to view full chat →</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  historyBg: { flex: 1, backgroundColor: colors.bgDark },
  historyContainer: { flex: 1, padding: SPACING.xl },
  emptyText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, color: colors.textSecondary, fontSize: 17, marginBottom: 8 },
  emptySubtext: { fontFamily: TYPOGRAPHY.fontFamily.body, color: colors.textMuted, fontSize: 14 },
  historyCard: { marginBottom: 14 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  historyTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.xxl },
  historyTagText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, fontSize: TYPOGRAPHY.size.small, color: colors.onPrimary, letterSpacing: 0.5 },
  historyTime: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: TYPOGRAPHY.size.small, color: colors.textMuted },
  historyText: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: TYPOGRAPHY.size.body, color: colors.textSecondary, lineHeight: 22, marginBottom: 14 },
  viewLink: { fontFamily: TYPOGRAPHY.fontFamily.bodyMedium, fontSize: 12, color: colors.primary },
});

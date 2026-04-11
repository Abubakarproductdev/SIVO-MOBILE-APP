import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useChat } from '../../ChatContext';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import Card from '../components/Card';

// =============================================
// HISTORY SCREEN (Cleaned)
// =============================================
function HistoryScreen({ navigate }) {
  const { history } = useChat();

  return (
    <ScrollView
      style={styles.historyContainer}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {history.length === 0 ? (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>No saved conversations yet.</Text>
        </View>
      ) : (
        history.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            activeOpacity={0.9}
            onPress={() => navigate('HistoryDetail', item)}
          >
            <Card style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={[styles.historyTag, { backgroundColor: item.color || COLORS.accent }]}>
                  <Text style={styles.historyTagText}>{item.type}</Text>
                </View>
                <Text style={styles.historyTime}>{item.date}</Text>
              </View>
              <Text style={styles.historyText} numberOfLines={2}>
                {item.previewText}...
              </Text>
              <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>
                 <Text style={{ fontSize: 12, color: COLORS.primary }}>Tap to view full chat</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  historyContainer: { flex: 1, padding: SPACING.xl },
  historyCard: { marginBottom: 14 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  historyTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.xxl },
  historyTagText: { fontSize: TYPOGRAPHY.size.small, fontWeight: TYPOGRAPHY.weight.semibold, color: '#FFF' },
  historyTime: { fontSize: TYPOGRAPHY.size.small, color: COLORS.textMuted },
  historyText: { fontSize: TYPOGRAPHY.size.body, color: COLORS.textPrimary, lineHeight: 22, marginBottom: 14 },
});

export default HistoryScreen;

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Video,
  Mic,
  MessageSquare,
  History,
  ArrowRight,
} from 'lucide-react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

// =============================================
// HOME SCREEN (Cleaned)
// =============================================
function HomeScreen({ navigate }) {
  return (
    <ScrollView
      style={styles.homeContainer}
      contentContainerStyle={styles.homeContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.homeWelcome}>Hello! 👋</Text>
      <Text style={styles.homeSubtitle}>
        Bridge communication gaps with real-time sign language translation
      </Text>

      <View style={styles.featureGrid}>
        <TouchableOpacity
          style={[styles.featureCard, { backgroundColor: COLORS.accent }]}
          onPress={() => navigate('SignToSpeech')}
          activeOpacity={0.85}
        >
          <View style={styles.featureIconBg}>
            <Video size={28} color={COLORS.accent} />
          </View>
          <Text style={styles.featureTitle}>Sign → Speech</Text>
          <Text style={styles.featureSubtitle}>Camera translation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.featureCard, { backgroundColor: COLORS.primary }]}
          onPress={() => navigate('SpeechToSign')}
          activeOpacity={0.85}
        >
          <View style={styles.featureIconBg}>
            <Mic size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.featureTitle}>Speech → Sign</Text>
          <Text style={styles.featureSubtitle}>Voice translation</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => navigate('Conversation')}
        activeOpacity={0.8}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: COLORS.coral }]}>
          <MessageSquare size={22} color="#FFF" />
        </View>
        <View style={styles.quickActionText}>
          <Text style={styles.quickActionTitle}>Live Conversation</Text>
          <Text style={styles.quickActionSubtitle}>Start real-time chat</Text>
        </View>
        <ArrowRight size={20} color={COLORS.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => navigate('History')}
        activeOpacity={0.8}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: COLORS.violet }]}>
          <History size={22} color="#FFF" />
        </View>
        <View style={styles.quickActionText}>
          <Text style={styles.quickActionTitle}>View History</Text>
          <Text style={styles.quickActionSubtitle}>Past translations</Text>
        </View>
        <ArrowRight size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeContainer: { flex: 1 },
  homeContent: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  homeWelcome: { fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary, marginBottom: 8 },
  homeSubtitle: { fontSize: TYPOGRAPHY.size.body, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.xxxl },
  featureGrid: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.xxxl },
  featureCard: { flex: 1, borderRadius: RADIUS.xxl, padding: SPACING.xl, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
  featureIconBg: { width: 56, height: 56, borderRadius: RADIUS.xl, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  featureTitle: { fontSize: TYPOGRAPHY.size.body, fontWeight: TYPOGRAPHY.weight.bold, color: '#FFF', marginBottom: 4 },
  featureSubtitle: { fontSize: TYPOGRAPHY.size.small, color: 'rgba(255,255,255,0.75)' },
  sectionTitle: { fontSize: TYPOGRAPHY.size.header, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary, marginBottom: SPACING.lg },
  quickActionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, marginBottom: SPACING.md },
  quickActionIcon: { width: 48, height: 48, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center' },
  quickActionText: { flex: 1, marginLeft: SPACING.lg },
  quickActionTitle: { fontSize: TYPOGRAPHY.size.body, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.textPrimary, marginBottom: 2 },
  quickActionSubtitle: { fontSize: TYPOGRAPHY.size.caption, color: COLORS.textMuted },
});

export default HomeScreen;

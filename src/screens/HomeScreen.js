import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Video,
  Mic,
  MessageSquare,
  History,
  ArrowRight,
} from 'lucide-react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

// =============================================
// HOME SCREEN (DEEP SPACE)
// =============================================
function HomeScreen({ navigate }) {
  return (
    <View style={styles.homeContainer}>
      {/* Ambient background glows */}
      <View style={styles.ambientGlowPrimary} />
      <View style={styles.ambientGlowAccent} />

      <ScrollView
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.homeWelcome}>Hello! 👋</Text>
        <Text style={styles.homeSubtitle}>
          Bridge communication gaps with real-time sign language translation
        </Text>

        <View style={styles.featureGrid}>
          <TouchableOpacity
            style={styles.featureCardContainer}
            onPress={() => navigate('SignToSpeech')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <View style={styles.featureIconBg}>
                <Video size={28} color={COLORS.accent} />
              </View>
              <Text style={styles.featureTitle}>Sign → Speech</Text>
              <Text style={styles.featureSubtitle}>Camera translation</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCardContainer}
            onPress={() => navigate('SpeechToSign')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <View style={styles.featureIconBg}>
                <Mic size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>Speech → Sign</Text>
              <Text style={styles.featureSubtitle}>Voice translation</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          onPress={() => navigate('Conversation')}
          activeOpacity={0.8}
        >
          <BlurView intensity={20} tint="dark" style={styles.quickActionCard}>
            <LinearGradient 
              colors={[COLORS.coral, COLORS.accentEnd]} 
              start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
              style={styles.quickActionIcon}
            >
              <MessageSquare size={22} color="#FFF" />
            </LinearGradient>
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>Live Conversation</Text>
              <Text style={styles.quickActionSubtitle}>Start real-time chat</Text>
            </View>
            <ArrowRight size={20} color={COLORS.textMuted} />
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate('History')}
          activeOpacity={0.8}
        >
          <BlurView intensity={20} tint="dark" style={styles.quickActionCard}>
            <LinearGradient 
              colors={[COLORS.violet, COLORS.primaryEnd]} 
              start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
              style={styles.quickActionIcon}
            >
              <History size={22} color="#FFF" />
            </LinearGradient>
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>View History</Text>
              <Text style={styles.quickActionSubtitle}>Past translations</Text>
            </View>
            <ArrowRight size={20} color={COLORS.textMuted} />
          </BlurView>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: { flex: 1, backgroundColor: COLORS.bgDark },
  ambientGlowPrimary: {
    position: 'absolute', top: -100, right: -50, width: 250, height: 250,
    borderRadius: 125, backgroundColor: COLORS.primary, opacity: 0.15, transform: [{ scale: 1.5 }],
  },
  ambientGlowAccent: {
    position: 'absolute', top: 300, left: -100, width: 200, height: 200,
    borderRadius: 100, backgroundColor: COLORS.accent, opacity: 0.1, transform: [{ scale: 1.5 }],
  },
  homeContent: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  homeWelcome: { 
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.size.xl, 
    color: '#FFF', 
    marginBottom: 8,
    letterSpacing: 1,
  },
  homeSubtitle: { 
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.size.body, 
    color: COLORS.textSecondary, 
    lineHeight: 24, 
    marginBottom: SPACING.xxxl 
  },
  featureGrid: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.xxxl },
  featureCardContainer: { flex: 1, ...SHADOWS.glowPrimary },
  featureCard: { flex: 1, borderRadius: RADIUS.xxl, padding: SPACING.xl, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
  featureIconBg: { width: 56, height: 56, borderRadius: RADIUS.xl, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  featureTitle: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, fontSize: TYPOGRAPHY.size.body, color: '#FFF', marginBottom: 4 },
  featureSubtitle: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: TYPOGRAPHY.size.small, color: 'rgba(255,255,255,0.75)' },
  sectionTitle: { fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: TYPOGRAPHY.size.header, color: '#FFF', marginBottom: SPACING.lg, letterSpacing: 1 },
  quickActionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.borderLight, padding: SPACING.lg, marginBottom: SPACING.md, overflow: 'hidden' },
  quickActionIcon: { width: 48, height: 48, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center' },
  quickActionText: { flex: 1, marginLeft: SPACING.lg },
  quickActionTitle: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, fontSize: TYPOGRAPHY.size.body, color: '#FFF', marginBottom: 2 },
  quickActionSubtitle: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: TYPOGRAPHY.size.caption, color: COLORS.textMuted },
});

export default HomeScreen;


import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Video,
  Mic,
  MessageSquare,
  History,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react-native';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

function HomeScreen({ navigate }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.homeContainer}>
      <ScrollView
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image 
            source={require('../../assets/images/home_hero.jpg')}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={[`${colors.bgDark}00`, colors.bgDark]}
            style={styles.heroGradient}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.homeWelcome}>Hello!</Text>
            <Text style={styles.homeSubtitle}>
              Bridge communication gaps with real-time sign language translation
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={[styles.statCard, styles.statCardPrimary]}
            onPress={() => navigate('SupportedWords')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="View supported words"
          >
            <View style={styles.statHeader}>
              <ArrowUpRight size={20} color={colors.onPrimary} />
            </View>
            <Text style={[styles.statValue, styles.statValuePrimary]}>41</Text>
            <Text style={[styles.statLabel, styles.statLabelPrimary]}>Words Supported</Text>
          </TouchableOpacity>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <ArrowUpRight size={20} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>80%</Text>
            <Text style={styles.statLabel}>Accuracy Rate</Text>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featureGrid}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigate('SignToSpeech')}
            activeOpacity={0.8}
          >
            <View style={styles.featureIconContainer}>
              <View style={styles.featureIconBg}>
                <Video size={24} color={colors.accent} />
              </View>
              <ArrowRight size={20} color={colors.textSecondary} />
            </View>
            <Text style={styles.featureTitle}>Sign → Speech</Text>
            <Text style={styles.featureSubtitle}>Camera translation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigate('SpeechToSign')}
            activeOpacity={0.8}
          >
            <View style={styles.featureIconContainer}>
              <View style={styles.featureIconBg}>
                <Mic size={24} color={colors.accent} />
              </View>
              <ArrowRight size={20} color={colors.textSecondary} />
            </View>
            <Text style={styles.featureTitle}>Speech → Sign</Text>
            <Text style={styles.featureSubtitle}>Voice translation</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          onPress={() => navigate('Conversation')}
          activeOpacity={0.8}
          style={styles.quickActionCard}
        >
          <LinearGradient 
            colors={[colors.accent, colors.accentEnd]} 
            start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
            style={styles.quickActionIcon}
          >
            <MessageSquare size={22} color={colors.onPrimary} />
          </LinearGradient>
          <View style={styles.quickActionText}>
            <Text style={styles.quickActionTitle}>Live Conversation</Text>
            <Text style={styles.quickActionSubtitle}>Start real-time chat</Text>
          </View>
          <ArrowRight size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate('History')}
          activeOpacity={0.8}
          style={styles.quickActionCard}
        >
          <LinearGradient 
            colors={[colors.accent, colors.accentEnd]} 
            start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
            style={styles.quickActionIcon}
          >
            <History size={22} color={colors.onPrimary} />
          </LinearGradient>
          <View style={styles.quickActionText}>
            <Text style={styles.quickActionTitle}>View History</Text>
            <Text style={styles.quickActionSubtitle}>Past translations</Text>
          </View>
          <ArrowRight size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  homeContainer: { flex: 1, backgroundColor: colors.bgDark },
  homeContent: { paddingBottom: SPACING.xxxl },
  heroContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
  },
  homeWelcome: { 
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: 28, 
    color: colors.textPrimary, 
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  homeSubtitle: { 
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: 14, 
    color: colors.textSecondary, 
    lineHeight: 20, 
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.statCardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  statCardPrimary: {
    backgroundColor: colors.primary,
  },
  statHeader: {
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: 24,
    color: colors.statCardText,
    marginBottom: 4,
  },
  statValuePrimary: {
    color: colors.onPrimary,
  },
  statLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
  },
  statLabelPrimary: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featureGrid: { 
    flexDirection: 'row', 
    gap: SPACING.lg, 
    marginBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  featureCard: { 
    flex: 1, 
    backgroundColor: colors.bgCard,
    borderRadius: RADIUS.xl, 
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  featureIconBg: { 
    width: 48, 
    height: 48, 
    borderRadius: RADIUS.round, 
    backgroundColor: colors.primaryLight, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  featureTitle: { fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: 16, color: colors.textPrimary, marginBottom: 4 },
  featureSubtitle: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: 12, color: colors.textSecondary },
  sectionTitle: { 
    fontFamily: TYPOGRAPHY.fontFamily.heading, 
    fontSize: 18, 
    color: colors.textPrimary, 
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  quickActionCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.bgCard, 
    borderRadius: RADIUS.lg, 
    padding: SPACING.lg, 
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.xl,
  },
  quickActionIcon: { width: 48, height: 48, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  quickActionText: { flex: 1, marginLeft: SPACING.lg },
  quickActionTitle: { fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: 16, color: colors.textPrimary, marginBottom: 4 },
  quickActionSubtitle: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: 12, color: colors.textMuted },
});

export default HomeScreen;

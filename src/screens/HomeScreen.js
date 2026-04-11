import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Video,
  Mic,
  MessageSquare,
  History,
  ArrowRight,
} from 'lucide-react-native';
import COLORS from '../constants/colors';
import styles from '../styles/styles';

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

export default HomeScreen;

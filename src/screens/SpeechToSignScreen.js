import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Mic,
  Square,
  RotateCcw,
  ArrowRight,
  User,
} from 'lucide-react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import ActionButton from '../components/ActionButton';
import AnimatedWaveform from '../components/AnimatedWaveform';
import Card from '../components/Card';

// =============================================
// SPEECH TO SIGN SCREEN
// =============================================
function SpeechToSignScreen({ navigate }) {
  const [status, setStatus] = useState('idle');

  const startRecording = () => {
    setStatus('recording');
    setTimeout(() => {
      setStatus('converting');
    }, 3000);
  };

  const stopRecording = () => {
    setStatus('converting');
  };

  const reset = () => {
    setStatus('idle');
  };

  if (status === 'idle') {
    return (
      <View style={styles.speechScreen}>
        <View style={styles.speechContent}>
          <Text style={styles.speechInstruction}>
            Tap the microphone to start{'\n'}recording your voice
          </Text>
          <View style={styles.waveformPreview}>
            {[35, 50, 25, 60, 40].map((height, i) => (
              <View
                key={i}
                style={[
                  styles.waveformBar,
                  { height, backgroundColor: COLORS.bgElevated },
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.speechActions}>
          <ActionButton
            title="Start Recording"
            IconComponent={Mic}
            onPress={startRecording}
            bgColor={COLORS.primary}
          />
        </View>
      </View>
    );
  }

  if (status === 'recording') {
    return (
      <View style={styles.speechScreen}>
        <View style={styles.speechContent}>
          <Text style={styles.speechStatusText}>Recording in progress...</Text>
          <View style={styles.recIndicator}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
          </View>
          <View style={{ marginVertical: 40 }}>
            <AnimatedWaveform color={COLORS.coral} />
          </View>
        </View>
        <View style={styles.speechActions}>
          <ActionButton
            title="Stop Recording"
            IconComponent={Square}
            onPress={stopRecording}
            bgColor={COLORS.bgElevated}
            textColor={COLORS.textPrimary}
          />
        </View>
      </View>
    );
  }

  if (status === 'converting') {
    return (
      <View style={styles.speechScreen}>
        <View style={styles.speechContent}>
          <Text style={styles.speechSubtext}>Converting to sign language</Text>
          <Card style={styles.convertedTextCard}>
            <Text style={styles.convertedText}>
              Hello, how can I help you today?
            </Text>
          </Card>
          <View style={styles.avatarCircle}>
            <User size={64} color={COLORS.textMuted} />
          </View>
          <Text style={styles.completeText}>Sign complete</Text>
        </View>
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionBarItem}
            onPress={() => setStatus('converting')}
          >
            <RotateCcw size={24} color={COLORS.textSecondary} />
            <Text style={styles.actionBarLabel}>Repeat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBarItem} onPress={reset}>
            <Mic size={24} color={COLORS.textSecondary} />
            <Text style={styles.actionBarLabel}>Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBarItem}
            onPress={() => navigate('SignToSpeech')}
          >
            <ArrowRight size={24} color={COLORS.textSecondary} />
            <Text style={styles.actionBarLabel}>Go to Sign</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  speechScreen: { flex: 1, padding: SPACING.xxl, justifyContent: 'space-between' },
  speechContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  speechInstruction: { fontSize: TYPOGRAPHY.size.header, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 26 },
  speechStatusText: { fontSize: TYPOGRAPHY.size.header, color: COLORS.textPrimary, marginBottom: SPACING.lg },
  recIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.xxl },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.error, marginRight: 8 },
  recText: { fontSize: 14, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.error },
  speechActions: { paddingTop: 20 },
  speechSubtext: { fontSize: TYPOGRAPHY.size.body, color: COLORS.textSecondary, marginBottom: SPACING.xxl },
  convertedTextCard: { width: '100%', marginBottom: SPACING.xxxl },
  convertedText: { fontSize: TYPOGRAPHY.size.title, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.textPrimary, textAlign: 'center' },
  avatarCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: COLORS.bgElevated, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xxl },
  completeText: { fontSize: TYPOGRAPHY.size.subtitle, color: COLORS.emerald, fontWeight: TYPOGRAPHY.weight.semibold },
  actionBar: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: SPACING.xxl, borderTopWidth: 1, borderTopColor: COLORS.border },
  actionBarItem: { alignItems: 'center', padding: SPACING.md },
  actionBarLabel: { fontSize: TYPOGRAPHY.size.small, color: COLORS.textSecondary, marginTop: 6, fontWeight: TYPOGRAPHY.weight.medium },
  waveformPreview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 70, marginTop: SPACING.xxxl },
  waveformBar: { width: 6, borderRadius: 3 },
});

export default SpeechToSignScreen;

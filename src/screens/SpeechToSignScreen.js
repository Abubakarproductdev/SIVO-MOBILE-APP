import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Mic,
  Square,
  RotateCcw,
  ArrowRight,
  User,
} from 'lucide-react-native';
import COLORS from '../constants/colors';
import styles from '../styles/styles';
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

export default SpeechToSignScreen;

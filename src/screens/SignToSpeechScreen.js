import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { Accelerometer } from 'expo-sensors';
import { uploadAsync, FileSystemUploadType, getInfoAsync } from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Video,
  Square,
  ArrowLeft,
  Smartphone,
} from 'lucide-react-native';
import { useChat } from '../../ChatContext';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

// =============================================
// SIGN TO SPEECH SCREEN (DEEP SPACE)
// =============================================
function SignToSpeechScreen({ navigate }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [status, setStatus] = useState('calibration-1');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [audioPermission, setAudioPermission] = useState(null);

  const [rotationAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  const { addMessage } = useChat();
  const SERVER_URL = "https://containerizedserver-gabqa0csbhakb2fg.centralindia-01.azurewebsites.net/predict_sentence";

  // Auto-Reset on mount
  useEffect(() => {
    setStatus('calibration-1');
  }, []);

  // Permissions
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setAudioPermission(status === 'granted');
      } catch (e) { console.log(e); }
    })();
  }, []);

  // Automatic Rotation Detection
  useEffect(() => {
    let subscription = null;
    if (status === 'calibration-1') {
      Accelerometer.setUpdateInterval(500);
      subscription = Accelerometer.addListener((data) => {
        // Anticlockwise rotation (Landscape Left): positive X gravity (right side of phone pulls down)
        // We'll check for x > 0.7 to enforce anticlockwise rotation.
        if (data.x > 0.7) { 
          setStatus('calibration-2');
        }
      });
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [status]);

  // Rotation Animation for Step 1
  useEffect(() => {
    if (status === 'calibration-1') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotationAnim, {
            toValue: -1, // -90 deg
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(rotationAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(500),
        ])
      ).start();
    } else {
      rotationAnim.stopAnimation();
    }
  }, [status]);

  const startRecording = async () => {
    if (cameraRef) {
      setStatus('recording');
      try {
        console.log(`[Profiler] Started recording at ${new Date().toISOString()}`);
        const video = await cameraRef.recordAsync({ maxDuration: 15, mute: true, quality: '480p' });
        console.log(`[Profiler] Video saved to disk at ${new Date().toISOString()}`);
        handleVideoUpload(video.uri);
      } catch (e) { setStatus('idle'); }
    }
  };

  const stopRecording = () => {
    if (cameraRef && status === 'recording') {
      console.log(`[Profiler] Stop button pressed at ${new Date().toISOString()}`);
      cameraRef.stopRecording();
    }
  };

  const handleVideoUpload = async (uri) => {
    setStatus('translating');

    try {
      const fileInfo = await getInfoAsync(uri);
      const sizeInMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
      console.log(`[Profiler] Upload started at ${new Date().toISOString()}`);
      console.log(`[Profiler] Video File Size: ${sizeInMB} MB`);
      const uploadStartTime = Date.now();
      
      const uploadResult = await uploadAsync(SERVER_URL, uri, {
        httpMethod: 'POST',
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: 'video',
        mimeType: 'video/mp4',
      });

      const uploadDuration = Date.now() - uploadStartTime;
      console.log(`[Profiler] Upload finished at ${new Date().toISOString()}. Took ${uploadDuration}ms`);
      console.log(`[Profiler] Server Status: ${uploadResult.status}`);
      console.log(`[Profiler] Server Response: ${uploadResult.body}`);

      if (uploadResult.status !== 200) {
        throw new Error(`Server returned status ${uploadResult.status}: ${uploadResult.body}`);
      }

      const data = JSON.parse(uploadResult.body);

      setStatus('idle');

      if (data.sentence && data.sentence.trim() !== "") {
        addMessage(data.sentence, 'sign-to-speech');
        if (navigate) {
          navigate('Conversation');
        }
      } else {
        Alert.alert("No Signs Detected", "Please try again.");
      }

    } catch (error) {
      console.error("Upload Error:", error);
      setStatus('idle');
      Alert.alert("Connection Error", "Check server.");
    }
  };

  if (status === 'translating') {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingGlow} />
        <ActivityIndicator size="large" color={colors.primaryEnd} />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  if (!cameraPermission || !cameraPermission.granted || !audioPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Permissions needed.</Text>
        <TouchableOpacity onPress={requestCameraPermission}>
          <LinearGradient
            colors={[colors.primary, colors.primaryEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permissions</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCalibrationOverlay = () => {
    if (status === 'calibration-1') {
      const spin = rotationAnim.interpolate({
        inputRange: [-1, 0],
        outputRange: ['-90deg', '0deg']
      });

      return (
        <View style={styles.calibrationOverlay}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Smartphone color={colors.primaryEnd} size={180} strokeWidth={1} />
          </Animated.View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* CAMERA VIEWPORT */}
      <View style={styles.cameraWrapper}>
        <CameraView style={{ flex: 1 }} facing="back" mode="video" videoQuality="480p" ref={(ref) => setCameraRef(ref)}>
          {status === 'recording' && (
            <View style={styles.recBadge}>
              <Text style={styles.recText}>● REC</Text>
            </View>
          )}
          {renderCalibrationOverlay()}
        </CameraView>
      </View>

      {/* BOTTOM CONTROLS */}
      {(status === 'calibration-2' || status === 'idle') && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={startRecording} style={styles.controlButtonWrapper}>
            <LinearGradient
              colors={[colors.primary, colors.primaryEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.controlButton}
            >
              <Video color={colors.onPrimary} size={20} />
              <Text style={styles.controlButtonText}>Record Sign</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {status === 'recording' && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={stopRecording} style={styles.controlButtonWrapper}>
            <LinearGradient
              colors={[colors.error, colors.error]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.controlButton}
            >
              <Square color={colors.onPrimary} size={24} />
              <Text style={styles.controlButtonText}>Stop</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  loadingContainer: { flex: 1, backgroundColor: colors.bgDark, justifyContent: 'center', alignItems: 'center' },
  loadingGlow: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: colors.primary, opacity: 0.1,
  },
  loadingText: { fontFamily: TYPOGRAPHY.fontFamily.body, color: colors.textSecondary, marginTop: SPACING.xl },
  permissionContainer: { flex: 1, backgroundColor: colors.bgDark, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  permissionText: { fontFamily: TYPOGRAPHY.fontFamily.body, color: colors.textPrimary, marginBottom: SPACING.xl, textAlign: 'center', fontSize: 16 },
  permissionButton: { padding: SPACING.lg, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.xxxl },
  permissionButtonText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, color: colors.onPrimary, fontSize: 15 },
  cameraWrapper: {
    flex: 1,
    margin: SPACING.xl,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  recBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: colors.overlay,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: colors.error,
  },
  recText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, color: colors.error, fontSize: 12 },
  controls: { height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgDark },
  controlButtonWrapper: { ...SHADOWS.glowPrimary, borderRadius: RADIUS.round },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: RADIUS.round,
  },
  controlButtonText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, color: colors.onPrimary, marginLeft: 10, fontSize: 15 },
  calibrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    zIndex: 5,
  },
  calibrationContent: {
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    padding: SPACING.xxxl,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  calibrationTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    color: colors.textPrimary,
    fontSize: 22,
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  calibrationSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  countdownContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  countdownText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: 120,
    color: colors.textPrimary,
    textShadowColor: colors.primaryEnd,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  countdownSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: colors.textPrimary,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: colors.overlay,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  }
});

export default SignToSpeechScreen;

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
import Svg, { Path, Defs, Mask, Rect } from 'react-native-svg';
import { uploadAsync, FileSystemUploadType, getInfoAsync } from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Video,
  Square,
  ArrowLeft,
  Smartphone,
} from 'lucide-react-native';
import { useChat } from '../../ChatContext';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

// =============================================
// SIGN TO SPEECH SCREEN (DEEP SPACE)
// =============================================
function SignToSpeechScreen({ navigate }) {
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
        <ActivityIndicator size="large" color={COLORS.primaryEnd} />
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
            colors={[COLORS.primary, COLORS.primaryEnd]}
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
    if (status !== 'calibration-1' && status !== 'calibration-2') return null;

    if (status === 'calibration-1') {
      const spin = rotationAnim.interpolate({
        inputRange: [-1, 0],
        outputRange: ['-90deg', '0deg']
      });

      return (
        <View style={styles.calibrationOverlay}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Smartphone color={COLORS.primaryEnd} size={180} strokeWidth={1} />
          </Animated.View>
        </View>
      );
    }

    if (status === 'calibration-2') {
      return (
        <View style={styles.calibrationOverlayTransparent} pointerEvents="none">
          <Svg height="100%" width="100%" viewBox="0 0 400 800" style={StyleSheet.absoluteFill}>
            <Defs>
              <Mask id="mask" x="0" y="0" height="100%" width="100%">
                <Rect height="100%" width="100%" fill="white" />
                <Path
                  d="M 200,150 m -70,0 a 70,70 0 1,0 140,0 a 70,70 0 1,0 -140,0 M 130,260 C 50,300 20,400 20,800 L 380,800 C 380,400 350,300 270,260 C 240,290 160,290 130,260 Z"
                  fill="black"
                  rotation="90"
                  origin="200, 400"
                />
              </Mask>
            </Defs>
            <Rect height="100%" width="100%" fill="rgba(15, 23, 42, 0.75)" mask="url(#mask)" />
            <Path
              d="M 200,150 m -70,0 a 70,70 0 1,0 140,0 a 70,70 0 1,0 -140,0 M 130,260 C 50,300 20,400 20,800 L 380,800 C 380,400 350,300 270,260 C 240,290 160,290 130,260 Z"
              fill="none"
              stroke={COLORS.primaryEnd}
              strokeWidth="4"
              strokeDasharray="10, 15"
              rotation="90"
              origin="200, 400"
            />
          </Svg>
        </View>
      );
    }
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
              colors={[COLORS.primary, COLORS.primaryEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.controlButton}
            >
              <Video color="#FFF" size={20} />
              <Text style={styles.controlButtonText}>Record Sign</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {status === 'recording' && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={stopRecording} style={styles.controlButtonWrapper}>
            <LinearGradient
              colors={[COLORS.error, '#ff6b6b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.controlButton}
            >
              <Square color="#FFF" size={24} />
              <Text style={styles.controlButtonText}>Stop</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  loadingContainer: { flex: 1, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center' },
  loadingGlow: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.primary, opacity: 0.1,
  },
  loadingText: { fontFamily: TYPOGRAPHY.fontFamily.body, color: COLORS.textSecondary, marginTop: SPACING.xl },
  permissionContainer: { flex: 1, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  permissionText: { fontFamily: TYPOGRAPHY.fontFamily.body, color: '#FFF', marginBottom: SPACING.xl, textAlign: 'center', fontSize: 16 },
  permissionButton: { padding: SPACING.lg, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.xxxl },
  permissionButtonText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, color: '#FFF', fontSize: 15 },
  cameraWrapper: {
    flex: 1,
    margin: SPACING.xl,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(244,63,94,0.3)',
  },
  recText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, color: COLORS.error, fontSize: 12 },
  controls: { height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgDark },
  controlButtonWrapper: { ...SHADOWS.glowPrimary, borderRadius: RADIUS.round },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: RADIUS.round,
  },
  controlButtonText: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, color: '#FFF', marginLeft: 10, fontSize: 15 },
  calibrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    zIndex: 5,
  },
  calibrationOverlayTransparent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  calibrationContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.xxxl,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  calibrationTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    color: '#FFF',
    fontSize: 22,
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  calibrationSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    color: COLORS.textSecondary,
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
    color: '#FFF',
    textShadowColor: COLORS.primaryEnd,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  countdownSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  }
});

export default SignToSpeechScreen;

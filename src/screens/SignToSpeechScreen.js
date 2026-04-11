import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import {
  Video,
  Square,
  ArrowLeft,
} from 'lucide-react-native';
import { useChat } from '../../ChatContext';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

// =============================================
// SIGN TO SPEECH SCREEN (Camera Module)
// =============================================
function SignToSpeechScreen({ navigate }) {
  const [status, setStatus] = useState('idle');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [audioPermission, setAudioPermission] = useState(null);

  const { addMessage } = useChat();
  const SERVER_URL = "https://online-production-e372.up.railway.app/predict_sentence";

  // Auto-Reset on mount
  useEffect(() => {
    setStatus('idle');
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

  const startRecording = async () => {
    if (cameraRef) {
      setStatus('recording');
      try {
        const video = await cameraRef.recordAsync({ maxDuration: 10, mute: true, quality: '480p' });
        handleVideoUpload(video.uri);
      } catch (e) { setStatus('idle'); }
    }
  };

  const stopRecording = () => {
    if (cameraRef && status === 'recording') cameraRef.stopRecording();
  };

  const handleVideoUpload = async (uri) => {
    setStatus('translating');

    try {
      const formData = new FormData();
      formData.append('video', { uri: uri, type: 'video/mp4', name: 'sign_video.mp4' });

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();

      setStatus('idle');

      if (data.sentence && data.sentence.trim() !== "") {
        addMessage(data.sentence);
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
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  if (!cameraPermission || !cameraPermission.granted || !audioPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Permissions needed.</Text>
        <TouchableOpacity onPress={requestCameraPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CAMERA VIEWPORT */}
      <View style={styles.cameraWrapper}>
        <CameraView style={{ flex: 1 }} facing="back" mode="video" ref={(ref) => setCameraRef(ref)}>
          {status === 'recording' && (
            <View style={styles.recBadge}>
              <Text style={styles.recText}>● REC</Text>
            </View>
          )}
        </CameraView>
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        {status === 'idle' ? (
          <TouchableOpacity onPress={startRecording} style={[styles.controlButton, { backgroundColor: COLORS.accent }]}>
            <Video color="#000" size={24} />
            <Text style={[styles.controlButtonText, { color: '#000' }]}>Record</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={stopRecording} style={[styles.controlButton, { backgroundColor: COLORS.error }]}>
            <Square color="#FFF" size={24} />
            <Text style={[styles.controlButtonText, { color: '#FFF' }]}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  loadingContainer: { flex: 1, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.textSecondary, marginTop: SPACING.xl },
  permissionContainer: { flex: 1, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  permissionText: { color: '#FFF', marginBottom: SPACING.xl, textAlign: 'center' },
  permissionButton: { backgroundColor: COLORS.primary, padding: SPACING.lg, borderRadius: RADIUS.md },
  permissionButtonText: { color: '#FFF', fontWeight: TYPOGRAPHY.weight.bold },
  cameraWrapper: { flex: 1, margin: SPACING.xl, borderRadius: RADIUS.xxl, overflow: 'hidden', backgroundColor: '#000' },
  recBadge: { 
    position: 'absolute', 
    top: 20, 
    right: 20, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: RADIUS.xxl 
  },
  recText: { color: COLORS.error, fontWeight: TYPOGRAPHY.weight.bold, fontSize: 12 },
  controls: { height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgDark },
  controlButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: RADIUS.round 
  },
  controlButtonText: { fontWeight: TYPOGRAPHY.weight.bold, marginLeft: 10 },
});

export default SignToSpeechScreen;

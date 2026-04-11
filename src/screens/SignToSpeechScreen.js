import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

// =============================================
// SIGN TO SPEECH SCREEN (Camera Module)
// =============================================
function SignToSpeechScreen({ navigate }) {
  // ✅ FIX: Recieve 'navigate' prop instead of 'navigation'

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

      // ✅ FIX: Stop loading immediately
      setStatus('idle');

      if (data.sentence && data.sentence.trim() !== "") {
        addMessage(data.sentence);

        // ✅ FIX: Use 'navigate' prop with CORRECT screen name string
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
      <View style={{ flex: 1, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={{ color: COLORS.textSecondary, marginTop: 20 }}>Processing...</Text>
      </View>
    );
  }

  if (!cameraPermission || !cameraPermission.granted || !audioPermission) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFF', marginBottom: 20 }}>Permissions needed.</Text>
        <TouchableOpacity onPress={requestCameraPermission} style={{ backgroundColor: COLORS.primary, padding: 15, borderRadius: 10 }}>
          <Text style={{ color: '#FFF' }}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgDark }}>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 }}>
        <TouchableOpacity onPress={() => navigate && navigate('Home')} style={{ padding: 10 }}>
          <ArrowLeft color={COLORS.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Sign to Speech</Text>
      </View> */}

      <View style={{ flex: 1, margin: 20, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000' }}>
        <CameraView style={{ flex: 1 }} facing="back" mode="video" ref={(ref) => setCameraRef(ref)}>
          {status === 'recording' && (
            <View style={{ position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ color: COLORS.error, fontWeight: 'bold', fontSize: 12 }}>● REC</Text>
            </View>
          )}
        </CameraView>
      </View>

      <View style={{ height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgDark }}>
        {status === 'idle' ? (
          <TouchableOpacity onPress={startRecording} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.accent, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 50 }}>
            <Video color="#000" size={24} />
            <Text style={{ color: '#000', fontWeight: 'bold', marginLeft: 10 }}>Record</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={stopRecording} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.error, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 50 }}>
            <Square color="#FFF" size={24} />
            <Text style={{ color: '#FFF', fontWeight: 'bold', marginLeft: 10 }}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default SignToSpeechScreen;

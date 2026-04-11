import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { User, ArrowLeft } from 'lucide-react-native';
import COLORS from '../constants/colors';
import styles from '../styles/styles';

// =============================================
// TOP BAR
// =============================================
function TopBar({ screen, onBackClick }) {
  const titles = {
    Home: 'SIVO',
    History: 'History',
    Conversation: 'Conversation',
    SpeechToSign: 'Speech → Sign',
    SignToSpeech: 'Sign → Speech',
    Settings: 'Settings',
  };

  const isHomeScreen = screen === 'Home';

  return (
    <View style={styles.topBarWrapper}>
      <SafeAreaView>
        <View style={styles.topBar}>
          {isHomeScreen ? (
            <View style={styles.topBarIconPlaceholder} />
          ) : (
            <TouchableOpacity onPress={onBackClick} style={styles.topBarIcon}>
              <ArrowLeft size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.topBarTitle}>{titles[screen] || 'SIVO'}</Text>
          <TouchableOpacity style={styles.topBarIcon}>
            <View style={styles.topBarAvatar}>
              <User size={18} color={COLORS.textPrimary} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default TopBar;

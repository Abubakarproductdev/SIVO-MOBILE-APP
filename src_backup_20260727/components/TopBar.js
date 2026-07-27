import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { BlurView } from 'expo-blur';
import { User, ArrowLeft } from 'lucide-react-native';
import COLORS from '../constants/colors';
import { RADIUS, TYPOGRAPHY, SPACING } from '../constants/theme';

// =============================================
// TOP BAR (GLASS)
// =============================================
function TopBar({ screen, onBackClick, onProfilePress }) {
  const titles = {
    Home: 'SIVO',
    History: 'History',
    Conversation: 'Conversation',
    SpeechToSign: 'Speech → Sign',
    SignToSpeech: 'Sign → Speech',
    Settings: 'Settings',
    Profile: 'Profile',
  };

  const isHomeScreen = screen === 'Home';

  return (
    <BlurView intensity={40} tint="dark" style={styles.topBarWrapper}>
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
          <TouchableOpacity onPress={onProfilePress} style={styles.topBarIcon}>
            <View style={styles.topBarAvatar}>
              <User size={18} color={COLORS.textPrimary} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  topBarWrapper: { 
    backgroundColor: 'rgba(10, 10, 26, 0.65)', 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255,255,255,0.08)', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg },
  topBarIcon: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  topBarIconPlaceholder: { width: 44 },
  topBarTitle: { 
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.size.title, 
    color: '#FFF', 
    letterSpacing: 1.5 
  },
  topBarAvatar: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
});

export default TopBar;


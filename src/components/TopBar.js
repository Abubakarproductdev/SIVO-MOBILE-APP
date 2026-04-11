import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { User, ArrowLeft } from 'lucide-react-native';
import COLORS from '../constants/colors';
import { RADIUS, TYPOGRAPHY, SPACING } from '../constants/theme';

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

const styles = StyleSheet.create({
  topBarWrapper: { 
    backgroundColor: COLORS.bgDark, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg },
  topBarIcon: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  topBarIconPlaceholder: { width: 44 },
  topBarTitle: { fontSize: TYPOGRAPHY.size.header, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary, letterSpacing: 0.5 },
  topBarAvatar: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.bgElevated, justifyContent: 'center', alignItems: 'center' },
});

export default TopBar;

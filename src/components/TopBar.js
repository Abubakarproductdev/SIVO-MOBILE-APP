import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform, StatusBar, Image } from 'react-native';
import { User, ArrowLeft } from 'lucide-react-native';
import { RADIUS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

function TopBar({ screen, onBackClick, onProfilePress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const titles = {
    Home: 'SIVO',
    History: 'History',
    Conversation: 'Conversation',
    SpeechToSign: 'Speech → Sign',
    SignToSpeech: 'Sign → Speech',
    Settings: 'Settings',
    Upgrade: 'Upgrade',
    SupportedWords: 'Words Supported',
    Profile: 'Profile',
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
              <ArrowLeft size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          {isHomeScreen ? (
            <Image 
              source={require('../../assets/logo/logo2.png')} 
              style={{ width: 100, height: 60 }} 
              resizeMode="contain" 
            />
          ) : (
            <Text style={styles.topBarTitle}>{titles[screen] || 'SIVO'}</Text>
          )}
          <TouchableOpacity onPress={onProfilePress} style={styles.topBarIcon}>
            <View style={styles.topBarAvatar}>
              <User size={18} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  topBarWrapper: { 
    backgroundColor: colors.bgDark, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg },
  topBarIcon: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  topBarIconPlaceholder: { width: 44 },
  topBarTitle: { 
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.size?.title || 20, 
    color: colors.textPrimary, 
    letterSpacing: 1.5 
  },
  topBarAvatar: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.primaryMuted },
});

export default TopBar;

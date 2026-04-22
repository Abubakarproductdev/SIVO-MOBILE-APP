import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import { RADIUS, TYPOGRAPHY, SPACING, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// =============================================
// SPLASH SCREEN (DEEP SPACE)
// =============================================
function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <View style={styles.ambientGlow} />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
          ...SHADOWS.glowPrimary, // Add a soft glow behind the whole section
        }}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryEnd]} // Violet to Cyan
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.splashLogo}
        >
          <Text style={styles.splashLogoText}>S</Text>
        </LinearGradient>
        <Text style={styles.splashTitle}>SIVO</Text>
        <Text style={styles.splashTagline}>Breaking Communication Barriers</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientGlow: {
    position: 'absolute', 
    width: width * 1.5, 
    height: width * 1.5,
    borderRadius: width * 0.75, 
    backgroundColor: COLORS.primary, 
    opacity: 0.1, 
    top: height * 0.2, // Rough centering behind logo
  },
  splashLogo: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.logo,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  splashLogoText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.size.display,
    color: '#FFF',
  },
  splashTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.size.hero,
    color: COLORS.textPrimary,
    letterSpacing: 8,
  },
  splashTagline: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;


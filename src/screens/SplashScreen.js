import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { RADIUS, TYPOGRAPHY, SPACING } from '../constants/theme';

// =============================================
// SPLASH SCREEN
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
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
        }}
      >
        <View style={styles.splashLogo}>
          <Text style={styles.splashLogoText}>S</Text>
        </View>
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
  splashLogo: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.logo,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  splashLogoText: {
    fontSize: TYPOGRAPHY.size.display,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: '#FFF',
  },
  splashTitle: {
    fontSize: TYPOGRAPHY.size.hero,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    letterSpacing: 6,
  },
  splashTagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    letterSpacing: 1,
  },
});

export default SplashScreen;

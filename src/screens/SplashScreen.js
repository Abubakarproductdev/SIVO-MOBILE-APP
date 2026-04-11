import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import styles from '../styles/styles';

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

export default SplashScreen;

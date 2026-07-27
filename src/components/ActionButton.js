import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

function ActionButton({ title, IconComponent, onPress, style, bgColor, loading, textColor, isAccent }) {
  const { colors: themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.6, duration: 200, useNativeDriver: true })
    ]).start();
  };

  const colors = isAccent 
    ? [themeColors.primary, themeColors.primaryEnd] 
    : bgColor 
      ? [bgColor, bgColor] 
      : [themeColors.primary, themeColors.primaryEnd];

  return (
    <Animated.View style={[
      styles.wrapper, 
      { transform: [{ scale: scaleAnim }], opacity: glowAnim },
      style
    ]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        disabled={loading}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.actionButton}
        >
          {loading ? (
            <ActivityIndicator color={textColor || themeColors.onPrimary} />
          ) : (
            <View style={styles.actionButtonContent}>
              <Text style={[styles.actionButtonText, { color: textColor || themeColors.onPrimary }]}>
                {title}
              </Text>
              {IconComponent && (
                <IconComponent size={20} color={textColor || themeColors.onPrimary} style={styles.icon} />
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  wrapper: { 
    width: '100%',
    borderRadius: RADIUS.lg,
  },
  actionButton: { 
    borderRadius: RADIUS.lg, 
    paddingVertical: SPACING.lg, 
    paddingHorizontal: SPACING.xxl, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { 
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    fontSize: TYPOGRAPHY.size?.subtitle || 16, 
    letterSpacing: 0.5,
  },
  icon: { marginLeft: 10 },
});

export default ActionButton;

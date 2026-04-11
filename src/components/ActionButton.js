import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import COLORS from '../constants/colors';
import { RADIUS, TYPOGRAPHY, SPACING } from '../constants/theme';

// =============================================
// ANIMATED BUTTON COMPONENT
// =============================================
function ActionButton({ title, IconComponent, onPress, style, bgColor, loading, textColor }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        disabled={loading}
        style={[
          styles.actionButton,
          { backgroundColor: bgColor || COLORS.primary },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor || '#FFF'} />
        ) : (
          <View style={styles.actionButtonContent}>
            <Text style={[styles.actionButtonText, { color: textColor || '#FFF' }]}>
              {title}
            </Text>
            {IconComponent && (
              <IconComponent size={20} color={textColor || '#FFF'} style={styles.icon} />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  actionButton: { 
    borderRadius: RADIUS.lg, 
    paddingVertical: SPACING.lg, 
    paddingHorizontal: SPACING.xxl, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  actionButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { fontSize: TYPOGRAPHY.size.subtitle, fontWeight: TYPOGRAPHY.weight.semibold },
  icon: { marginLeft: 10 },
});

export default ActionButton;

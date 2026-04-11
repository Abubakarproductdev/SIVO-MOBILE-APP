import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../constants/colors';
import styles from '../styles/styles';

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
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
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
              <IconComponent size={20} color={textColor || '#FFF'} style={{ marginLeft: 10 }} />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default ActionButton;

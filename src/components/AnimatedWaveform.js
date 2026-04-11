import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import COLORS from '../constants/colors';
import styles from '../styles/styles';

// =============================================
// ANIMATED WAVEFORM COMPONENT
// =============================================
function AnimatedWaveform({ color }) {
  const anims = [
    useRef(new Animated.Value(0.4)).current,
    useRef(new Animated.Value(0.4)).current,
    useRef(new Animated.Value(0.4)).current,
    useRef(new Animated.Value(0.4)).current,
    useRef(new Animated.Value(0.4)).current,
  ];
  const heights = [35, 50, 25, 60, 40];
  const durations = [350, 400, 450, 380, 420];

  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: durations[i], useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.4, duration: durations[i], useNativeDriver: true }),
        ])
      )
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, []);

  return (
    <View style={styles.waveformContainer}>
      {anims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveformBar,
            {
              height: heights[index],
              backgroundColor: color || COLORS.primary,
              transform: [{ scaleY: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
}

export default AnimatedWaveform;

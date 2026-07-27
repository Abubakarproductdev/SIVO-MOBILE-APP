import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

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

  const themeColor = color || '#FF6B2C';

  return (
    <View style={styles.waveformContainer}>
      {anims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveformBar,
            {
              height: heights[index],
              backgroundColor: themeColor,
              transform: [{ scaleY: anim }],
              shadowColor: themeColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 5,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  waveformContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 70 },
  waveformBar: { width: 6, borderRadius: 3 },
});

export default AnimatedWaveform;

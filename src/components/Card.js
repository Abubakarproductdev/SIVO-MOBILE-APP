import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

function Card({ children, style }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: { 
    backgroundColor: colors.bgCard, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: colors.border, 
    padding: SPACING.xl,
    overflow: 'hidden', 
  },
});

export default Card;

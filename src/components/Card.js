import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { RADIUS, SPACING } from '../constants/theme';

// =============================================
// CARD COMPONENT
// =============================================
function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: COLORS.bgCard, 
    borderRadius: RADIUS.xl, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    padding: SPACING.xl 
  },
});

export default Card;

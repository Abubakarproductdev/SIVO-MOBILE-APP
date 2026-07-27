import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import { RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { VideoDictionary } from '../config/VideoDictionary';
import { useTheme } from '../context/ThemeContext';

const supportedWords = Object.keys(VideoDictionary)
  .map((word) => word.replace(/_/g, ' '))
  .sort((first, second) => first.localeCompare(second));

export default function SupportedWordsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.headingIcon}>
          <BadgeCheck size={22} color={colors.primary} />
        </View>
        <View style={styles.headingText}>
          <Text style={styles.title}>Words Supported</Text>
          <Text style={styles.subtitle}>{supportedWords.length} signs are available to translate right now.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.words} showsVerticalScrollIndicator={false}>
        {supportedWords.map((word) => (
          <View key={word} style={styles.wordPill}>
            <Text style={styles.word}>{word}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark, padding: SPACING.xl },
  heading: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xxl },
  headingIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  headingText: { flex: 1 },
  title: { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: TYPOGRAPHY.size.title },
  subtitle: { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: TYPOGRAPHY.size.caption, lineHeight: 18, marginTop: 3 },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingBottom: SPACING.xxxl },
  wordPill: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.borderLight, borderRadius: RADIUS.round, paddingHorizontal: 14, paddingVertical: 10 },
  word: { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamily.bodyMedium, fontSize: TYPOGRAPHY.size.caption, textTransform: 'capitalize' },
});

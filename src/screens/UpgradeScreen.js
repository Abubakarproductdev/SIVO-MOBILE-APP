import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, Sparkles } from 'lucide-react-native';
import { RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const packages = [
  { name: 'Starter', price: 'Rs. 499', period: '/ month', words: '100+ supported words' },
  { name: 'Pro', price: 'Rs. 999', period: '/ month', words: '500+ supported words', popular: true },
  { name: 'Unlimited', price: 'Rs. 2,499', period: '/ year', words: 'All future word packs' },
];

export default function UpgradeScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const showPurchaseMessage = (plan) => {
    Alert.alert('Coming soon', `${plan} purchases will be available in the next release.`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.primary, colors.primaryEnd]} style={styles.hero}>
          <View style={styles.crown}><Crown color={colors.onPrimary} size={30} /></View>
          <Text style={styles.heroTitle}>Upgrade your vocabulary</Text>
          <Text style={styles.heroText}>Unlock more signs and communicate with confidence. New word packs are added regularly.</Text>
        </LinearGradient>

        <View style={styles.sectionHeading}>
          <Sparkles size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>Choose your package</Text>
        </View>

        {packages.map((pkg) => (
          <View key={pkg.name} style={[styles.packageCard, pkg.popular && styles.packageCardPopular]}>
            {pkg.popular && <Text style={styles.popular}>MOST POPULAR</Text>}
            <Text style={styles.packageName}>{pkg.name}</Text>
            <View style={styles.priceLine}>
              <Text style={styles.price}>{pkg.price}</Text>
              <Text style={styles.period}>{pkg.period}</Text>
            </View>
            <View style={styles.benefit}><Check size={17} color={colors.success} /><Text style={styles.benefitText}>{pkg.words}</Text></View>
            <View style={styles.benefit}><Check size={17} color={colors.success} /><Text style={styles.benefitText}>Faster, richer translations</Text></View>
            <TouchableOpacity onPress={() => showPurchaseMessage(pkg.name)} activeOpacity={0.8} style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  hero: { borderRadius: RADIUS.xxl, padding: SPACING.xxl, alignItems: 'center', marginBottom: SPACING.xxl },
  crown: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.subtleOnPrimary, marginBottom: SPACING.md },
  heroTitle: { fontFamily: TYPOGRAPHY.fontFamily.heading, color: colors.onPrimary, fontSize: TYPOGRAPHY.size.large, textAlign: 'center' },
  heroText: { fontFamily: TYPOGRAPHY.fontFamily.body, color: colors.onPrimary, fontSize: TYPOGRAPHY.size.body, textAlign: 'center', lineHeight: 21, marginTop: 10 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  sectionTitle: { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: TYPOGRAPHY.size.header },
  packageCard: { position: 'relative', backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.md, overflow: 'hidden' },
  packageCardPopular: { borderColor: colors.primary },
  popular: { position: 'absolute', top: 0, right: 0, color: colors.onPrimary, backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 5, borderBottomLeftRadius: RADIUS.md, fontFamily: TYPOGRAPHY.fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.6 },
  packageName: { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: TYPOGRAPHY.size.title },
  priceLine: { flexDirection: 'row', alignItems: 'baseline', marginTop: 5, marginBottom: SPACING.lg },
  price: { color: colors.primary, fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: 26 },
  period: { color: colors.textMuted, fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: TYPOGRAPHY.size.caption, marginLeft: 4 },
  benefit: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  benefitText: { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: TYPOGRAPHY.size.caption, marginLeft: SPACING.sm },
  upgradeButton: { backgroundColor: colors.primary, borderRadius: RADIUS.lg, alignItems: 'center', paddingVertical: 13, marginTop: SPACING.md },
  upgradeButtonText: { color: colors.onPrimary, fontFamily: TYPOGRAPHY.fontFamily.bodyBold, fontSize: TYPOGRAPHY.size.body },
});

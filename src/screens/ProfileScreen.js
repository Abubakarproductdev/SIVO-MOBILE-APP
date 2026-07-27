import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Mail, Save, User } from 'lucide-react-native';
import { auth } from '../config/firebase';
import { RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';
import ActionButton from '../components/ActionButton';
import Card from '../components/Card';
import { getCurrentUserProfile, updateCurrentUserProfile } from '../services/userService';
import { useTheme } from '../context/ThemeContext';

function formatDate(value) {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString();
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const userProfile = await getCurrentUserProfile();
        if (!mounted) return;
        setProfile(userProfile);
        setDisplayName(userProfile.displayName || '');
        setPhone(userProfile.phone || '');
      } catch (error) {
        Alert.alert('Profile Error', error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateCurrentUserProfile({
        displayName,
        phone,
      });
      setProfile(updated);
      setDisplayName(updated.displayName || '');
      setPhone(updated.phone || '');
      Alert.alert('Saved', 'Your profile was updated.');
    } catch (error) {
      Alert.alert('Save Failed', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <LinearGradient
          colors={[colors.primary, colors.primaryEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <User size={34} color={colors.onPrimary} />
        </LinearGradient>
        <Text style={styles.nameText}>
          {profile?.displayName || auth?.currentUser?.email || 'SIVO User'}
        </Text>
        <Text style={styles.emailText}>{profile?.email || auth?.currentUser?.email}</Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.textInput}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.textInput}
            keyboardType="phone-pad"
            placeholder="Optional"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.infoRow}>
          <Mail size={18} color={colors.primary} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile?.email || 'Not available'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Calendar size={18} color={colors.primary} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{formatDate(profile?.createdAt)}</Text>
          </View>
        </View>
      </Card>

      <ActionButton
        title={saving ? 'Saving...' : 'Save Profile'}
        IconComponent={Save}
        onPress={handleSave}
        loading={saving}
        bgColor={colors.primary}
      />
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBlock: { alignItems: 'center', marginBottom: SPACING.xxl },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: RADIUS.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  nameText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    color: colors.textPrimary,
    fontSize: TYPOGRAPHY.size.title,
    textAlign: 'center',
    letterSpacing: 1,
  },
  emailText: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    color: colors.textMuted,
    fontSize: TYPOGRAPHY.size.body,
    marginTop: 6,
  },
  card: { marginBottom: SPACING.xl },
  inputGroup: { marginBottom: SPACING.xl },
  inputLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: colors.textSecondary,
    fontSize: TYPOGRAPHY.size.small,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: colors.bgInput,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.size.subtitle,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: SPACING.md,
  },
  infoTextBlock: { marginLeft: SPACING.md, flex: 1 },
  infoLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: colors.textMuted,
    fontSize: TYPOGRAPHY.size.small,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    color: colors.textSecondary,
    fontSize: TYPOGRAPHY.size.body,
  },
});

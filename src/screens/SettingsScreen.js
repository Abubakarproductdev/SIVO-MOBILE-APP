import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Bell, LogOut, User } from 'lucide-react-native';
import { auth, signOut } from '../config/firebase';
import { RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';
import ActionButton from '../components/ActionButton';
import { getCurrentUserProfile, updateCurrentUserProfile } from '../services/userService';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigate }) {
  const { colors, colorMode, toggleColorMode } = useTheme();
  const styles = createStyles(colors);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const userProfile = await getCurrentUserProfile();
        if (!mounted) return;
        setProfile(userProfile);
        setNotificationsEnabled(userProfile.settings?.notificationsEnabled ?? true);
      } catch (error) {
        Alert.alert('Settings Error', error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const updateNotifications = async (value) => {
    setNotificationsEnabled(value);
    setSaving(true);
    try {
      const updated = await updateCurrentUserProfile({ notificationsEnabled: value });
      setProfile(updated);
      setNotificationsEnabled(updated.settings?.notificationsEnabled ?? value);
    } catch (error) {
      setNotificationsEnabled((current) => !current);
      Alert.alert('Update Failed', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Account and app preferences</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.settingsList}>
            <TouchableOpacity onPress={() => navigate('Profile')} activeOpacity={0.75}>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.settingsIcon}
                  >
                    <User size={18} color={colors.onPrimary} />
                  </LinearGradient>
                  <View>
                    <Text style={styles.settingsItemText}>Profile</Text>
                    <Text style={styles.settingsSubtext}>
                      {profile?.email || 'Manage your account'}
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color={colors.textMuted} />
              </View>
            </TouchableOpacity>

            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.settingsIcon}
                >
                  <Bell size={18} color={colors.onPrimary} />
                </LinearGradient>
                <View>
                  <Text style={styles.settingsItemText}>Notifications</Text>
                  <Text style={styles.settingsSubtext}>
                    {saving ? 'Saving...' : 'Translation reminders and updates'}
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={updateNotifications}
                disabled={saving}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor={colors.onPrimary}
              />
            </View>

            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={styles.settingsIcon}>
                  <Text style={styles.modeIcon}>{colorMode === 'light' ? '☀' : '◐'}</Text>
                </View>
                <View>
                  <Text style={styles.settingsItemText}>Light Mode</Text>
                  <Text style={styles.settingsSubtext}>Switch black and white app colors</Text>
                </View>
              </View>
              <Switch
                value={colorMode === 'light'}
                onValueChange={toggleColorMode}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor={colors.onPrimary}
              />
            </View>
          </View>
        )}

        <View style={styles.logoutSection}>
          <ActionButton
            title="Log Out"
            IconComponent={LogOut}
            onPress={handleSignOut}
            isAccent
          />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  content: { paddingBottom: 40 },
  titleSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.size.large,
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.size.body,
    color: colors.textSecondary,
  },
  loader: { marginTop: 40 },
  settingsList: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: SPACING.lg,
    overflow: 'hidden',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: SPACING.md,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingsItemText: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    fontSize: TYPOGRAPHY.size.body,
    color: colors.textPrimary,
  },
  settingsSubtext: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.size.small,
    color: colors.textMuted,
    marginTop: 3,
  },
  logoutSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
  modeIcon: { color: colors.primary, fontSize: 22, fontFamily: TYPOGRAPHY.fontFamily.bodyBold },
});

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
import { BlurView } from 'expo-blur';
import { ArrowRight, Bell, LogOut, User } from 'lucide-react-native';
import { auth, signOut } from '../config/firebase';
import COLORS from '../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';
import ActionButton from '../components/ActionButton';
import { getCurrentUserProfile, updateCurrentUserProfile } from '../services/userService';

function SettingsScreen({ navigate }) {
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
      <View style={styles.glowPrimary} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Account and app preferences</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primaryEnd} style={styles.loader} />
        ) : (
          <View style={styles.settingsList}>
            <TouchableOpacity onPress={() => navigate('Profile')} activeOpacity={0.75}>
              <BlurView intensity={15} tint="dark" style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.settingsIcon}
                  >
                    <User size={18} color="#FFF" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.settingsItemText}>Profile</Text>
                    <Text style={styles.settingsSubtext}>
                      {profile?.email || 'Manage your account'}
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color={COLORS.textMuted} />
              </BlurView>
            </TouchableOpacity>

            <BlurView intensity={15} tint="dark" style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <LinearGradient
                  colors={[COLORS.accent, COLORS.accentEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.settingsIcon}
                >
                  <Bell size={18} color="#FFF" />
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
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: COLORS.primary }}
                thumbColor="#FFF"
              />
            </BlurView>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { paddingBottom: 40 },
  glowPrimary: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  titleSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.size.large,
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.size.body,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: '#FFF',
  },
  settingsSubtext: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.size.small,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  logoutSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
});

export default SettingsScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  User,
  ArrowLeft,
  ArrowRight,
  Bell,
  Moon,
  LogOut,
  Send,
} from 'lucide-react-native';
import { auth, db, doc, getDoc, updateDoc, setDoc, signOut } from '../config/firebase';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import ActionButton from '../components/ActionButton';
import Card from '../components/Card';

// =============================================
// SETTINGS SCREEN
// =============================================
function SettingsScreen({ navigate }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?.currentUser) {
        setLoading(false);
        return;
      }
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsDarkMode(data.isDarkMode ?? true);
          setNotificationsEnabled(data.notificationsEnabled ?? true);
          setName(data.name || '');
          setPhone(data.phone || '');
        } else {
          await setDoc(userRef, {
            email: auth.currentUser.email,
            isDarkMode: true,
            notificationsEnabled: true,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.log('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const updateToggle = async (key, value) => {
    if (key === 'isDarkMode') setIsDarkMode(value);
    if (key === 'notificationsEnabled') setNotificationsEnabled(value);
    if (auth?.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userRef, { [key]: value });
      } catch (error) {
        Alert.alert('Error', 'Could not update setting.');
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { name, phone });
      Alert.alert('Success', 'Profile updated successfully! ');
      setEditingProfile(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile.');
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

  if (editingProfile) {
    return (
      <View style={styles.settingsContainer}>
        <View style={styles.settingsHeader}>
          <TouchableOpacity
            onPress={() => setEditingProfile(false)}
            style={styles.backBtn}
          >
            <ArrowLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.settingsHeaderTitle}>Edit Profile</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={styles.profileCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.textInput}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={styles.textInput}
                keyboardType="phone-pad"
                placeholder="+1 234 567 890"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email (Read-only)</Text>
              <View style={[styles.textInput, styles.readOnlyInput]}>
                <Text style={styles.readOnlyText}>
                  {auth?.currentUser?.email || 'Not logged in'}
                </Text>
              </View>
            </View>
          </Card>
          <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
            <ActionButton
              title={saving ? 'Saving...' : 'Save Changes'}
              IconComponent={Send}
              onPress={handleSaveProfile}
              loading={saving}
              bgColor={COLORS.emerald}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.settingsContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.settingsTitleSection}>
          <Text style={styles.settingsTitle}>Settings</Text>
          <Text style={styles.settingsSubtitle}>Manage your preferences</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={styles.settingsList}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => setEditingProfile(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.settingsIcon, { backgroundColor: COLORS.primary }]}>
                  <User size={18} color="#FFF" />
                </View>
                <Text style={styles.settingsItemText}>Account Details</Text>
              </View>
              <ArrowRight size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.settingsIcon, { backgroundColor: COLORS.coral }]}>
                  <Bell size={18} color="#FFF" />
                </View>
                <Text style={styles.settingsItemText}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={(val) => updateToggle('notificationsEnabled', val)}
                trackColor={{ false: COLORS.bgElevated, true: COLORS.primary }}
                thumbColor="#FFF"
              />
            </View>

            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.settingsIcon, { backgroundColor: COLORS.violet }]}>
                  <Moon size={18} color="#FFF" />
                </View>
                <Text style={styles.settingsItemText}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={(val) => updateToggle('isDarkMode', val)}
                trackColor={{ false: COLORS.bgElevated, true: COLORS.accent }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        )}

        <View style={styles.logoutSection}>
          <ActionButton
            title="Log Out"
            IconComponent={LogOut}
            onPress={handleSignOut}
            bgColor={COLORS.error}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsContainer: { flex: 1 },
  settingsHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.lg, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border 
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  settingsHeaderTitle: { fontSize: TYPOGRAPHY.size.header, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary },
  settingsTitleSection: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.sm },
  settingsTitle: { fontSize: TYPOGRAPHY.size.large, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary, marginBottom: 6 },
  settingsSubtitle: { fontSize: TYPOGRAPHY.size.body, color: COLORS.textSecondary },
  settingsList: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, gap: SPACING.md },
  settingsItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: COLORS.bgCard, 
    borderRadius: RADIUS.lg, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    padding: RADIUS.lg 
  },
  settingsItemLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsIcon: { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  settingsItemText: { fontSize: TYPOGRAPHY.size.body, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.textPrimary },
  profileCard: { margin: SPACING.xl },
  inputGroup: { marginBottom: SPACING.xl },
  inputLabel: { fontSize: 14, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.textPrimary, marginBottom: 8 },
  textInput: { 
    backgroundColor: COLORS.bgInput, 
    borderRadius: RADIUS.md, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 16, 
    color: COLORS.textPrimary 
  },
  readOnlyInput: { opacity: 0.6, justifyContent: 'center' },
  readOnlyText: { fontSize: 16, color: COLORS.textSecondary },
  logoutSection: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl, paddingBottom: 40 },
});

export default SettingsScreen;

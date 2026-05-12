import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogIn } from 'lucide-react-native';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../config/firebase';
import { syncCurrentUser } from '../services/userService';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import ActionButton from '../components/ActionButton';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

// =============================================
// LOGIN SCREEN
// =============================================
function LoginScreen({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await syncCurrentUser();
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password to sign up.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await syncCurrentUser();
      Alert.alert('Success', 'Account created!  Logging you in...');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      {/* Ambient glows */}
      <View style={styles.glowPrimary} />
      <View style={styles.glowAccent} />

      <SafeAreaView style={styles.loginSafeArea}>
        <View style={styles.loginHeader}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginLogo}
          >
            <Text style={styles.loginLogoText}>S</Text>
          </LinearGradient>
          <Text style={styles.loginTitle}>Welcome Back</Text>
          <Text style={styles.loginSubtitle}>Sign in to continue</Text>
        </View>

        <Card style={styles.loginCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.textInput}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <ActionButton
            title="Sign In"
            IconComponent={LogIn}
            onPress={handleSignIn}
            loading={loading}
            bgColor={COLORS.primary}
          />
        </Card>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account?  </Text>
          <TouchableOpacity onPress={handleSignUp} disabled={loading}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: COLORS.bgDark },
  glowPrimary: {
    position: 'absolute', top: -80, left: -80, width: 280, height: 280,
    borderRadius: 140, backgroundColor: COLORS.primary, opacity: 0.12,
  },
  glowAccent: {
    position: 'absolute', bottom: 50, right: -80, width: 220, height: 220,
    borderRadius: 110, backgroundColor: COLORS.accent, opacity: 0.1,
  },
  loginSafeArea: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xxl },
  loginHeader: { alignItems: 'center', marginBottom: SPACING.xxxl },
  loginLogo: { 
    width: 80, 
    height: 80, 
    borderRadius: RADIUS.xxl, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: SPACING.xxl,
    ...SHADOWS.glowPrimary,
  },
  loginLogoText: { fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: TYPOGRAPHY.size.xl, color: '#FFF' },
  loginTitle: { fontFamily: TYPOGRAPHY.fontFamily.heading, fontSize: TYPOGRAPHY.size.title, color: '#FFF', marginBottom: 8, letterSpacing: 1.5 },
  loginSubtitle: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: 16, color: COLORS.textSecondary, letterSpacing: 0.5 },
  loginCard: { marginBottom: SPACING.xxl },
  inputGroup: { marginBottom: SPACING.xl },
  inputLabel: { fontFamily: TYPOGRAPHY.fontFamily.bodyMedium, fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, letterSpacing: 0.8, textTransform: 'uppercase' },
  textInput: { 
    backgroundColor: COLORS.bgInput, 
    borderRadius: RADIUS.lg, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: 16, 
    color: '#FFF',
  },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { fontFamily: TYPOGRAPHY.fontFamily.body, fontSize: 15, color: COLORS.textSecondary },
  signupLink: { fontFamily: TYPOGRAPHY.fontFamily.bodyBold, fontSize: 15, color: COLORS.primaryEnd },
});

export default LoginScreen;

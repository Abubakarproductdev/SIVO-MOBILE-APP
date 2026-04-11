import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { LogIn } from 'lucide-react-native';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../config/firebase';
import COLORS from '../constants/colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import ActionButton from '../components/ActionButton';
import Card from '../components/Card';

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
      Alert.alert('Success', 'Account created!  Logging you in...');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <SafeAreaView style={styles.loginSafeArea}>
        <View style={styles.loginHeader}>
          <View style={styles.loginLogo}>
            <Text style={styles.loginLogoText}>S</Text>
          </View>
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
  loginSafeArea: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xxl },
  loginHeader: { alignItems: 'center', marginBottom: SPACING.xxxl },
  loginLogo: { 
    width: 70, 
    height: 70, 
    borderRadius: RADIUS.xxl, 
    backgroundColor: COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: SPACING.xxl 
  },
  loginLogoText: { fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.bold, color: '#FFF' },
  loginTitle: { fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary, marginBottom: 8 },
  loginSubtitle: { fontSize: 16, color: COLORS.textSecondary },
  loginCard: { marginBottom: SPACING.xxl },
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
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { fontSize: 15, color: COLORS.textSecondary },
  signupLink: { fontSize: 15, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.accent },
});

export default LoginScreen;

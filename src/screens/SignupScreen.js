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
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserPlus } from 'lucide-react-native';
import { auth, createUserWithEmailAndPassword } from '../config/firebase';
import { syncCurrentUser } from '../services/userService';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const getFriendlyErrorMessage = (error) => {
  const code = error.code || error.message;
  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Your password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection.';
  }
  if (code.includes('auth/invalid-email')) {
    return 'The email address is invalid.';
  }
  return error.message || 'An unknown error occurred. Please try again.';
};

function SignupScreen({ navigate }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [focusedInput, setFocusedInput] = useState(null);

  const handleSignUp = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name.');
      return;
    }
    if (!email || !password) {
      Alert.alert('Error', 'Please enter an email and a password.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Your password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Wait for auth state to propagate (optional depending on how syncCurrentUser is built)
      await syncCurrentUser(fullName);
      Alert.alert('Success', 'Your account has been created successfully!');
    } catch (error) {
      Alert.alert('Sign Up Failed', getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/login_hero.jpg')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SIVO today</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
                style={[styles.textInput, focusedInput === 'name' && styles.textInputFocused]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                style={[styles.textInput, focusedInput === 'email' && styles.textInputFocused]}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                style={[styles.textInput, focusedInput === 'password' && styles.textInputFocused]}
                secureTextEntry
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedInput('confirm')}
                onBlur={() => setFocusedInput(null)}
                style={[styles.textInput, focusedInput === 'confirm' && styles.textInputFocused]}
                secureTextEntry
                placeholder="Confirm your password"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <TouchableOpacity onPress={handleSignUp} disabled={loading} style={styles.signupButtonWrapper}>
              <LinearGradient
                colors={[colors.primary, colors.primaryEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signupButtonGradient}
              >
                {loading ? (
                  <Text style={styles.signupButtonText}>Creating account...</Text>
                ) : (
                  <>
                    <UserPlus color={colors.onPrimary} size={20} style={{ marginRight: 8 }} />
                    <Text style={styles.signupButtonText}>Create Account</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigate('Login')} disabled={loading}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  heroImage: {
    width: width,
    height: width * 0.5,
    position: 'absolute',
    top: 0,
    opacity: 0.8,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl || 24,
    paddingTop: width * 0.35,
    paddingBottom: 40,
  },
  header: {
    marginBottom: SPACING.xxl || 24,
  },
  title: {
    fontFamily: 'DMSans_700Bold',
    fontSize: TYPOGRAPHY.size?.title || 28,
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: 16,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: colors.bgCard,
    padding: SPACING.xl || 20,
    borderRadius: RADIUS.xl || 20,
    marginBottom: SPACING.xxl || 24,
  },
  inputGroup: {
    marginBottom: SPACING.lg || 16,
  },
  inputLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: colors.bgInput,
    borderRadius: RADIUS.lg || 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: 16,
    color: colors.textPrimary,
  },
  textInputFocused: {
    borderColor: colors.primary,
  },
  signupButtonWrapper: {
    borderRadius: RADIUS.lg || 16,
    overflow: 'hidden',
    marginTop: SPACING.sm || 8,
  },
  signupButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  signupButtonText: {
    color: colors.onPrimary,
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: 15,
    color: colors.textSecondary,
  },
  footerLink: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: colors.primary,
  },
});

export default SignupScreen;

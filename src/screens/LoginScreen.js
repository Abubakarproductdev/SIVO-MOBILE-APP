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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogIn } from 'lucide-react-native';
import { auth, signInWithEmailAndPassword } from '../config/firebase';
import { syncCurrentUser } from '../services/userService';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import ActionButton from '../components/ActionButton';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const getFriendlyErrorMessage = (error) => {
  const code = error.code || error.message;
  if (code.includes('auth/invalid-credential') || code.includes('auth/user-not-found') || code.includes('auth/wrong-password')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection.';
  }
  if (code.includes('auth/invalid-email')) {
    return 'The email address is invalid.';
  }
  return error.message || 'An unknown error occurred. Please try again.';
};

function LoginScreen({ navigate }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both your email and password.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await syncCurrentUser();
    } catch (error) {
      Alert.alert('Login Failed', getFriendlyErrorMessage(error));
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
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              style={[styles.textInput, isEmailFocused && styles.textInputFocused]}
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
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              style={[styles.textInput, isPasswordFocused && styles.textInputFocused]}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <TouchableOpacity onPress={handleSignIn} disabled={loading} style={styles.loginButtonWrapper}>
            <LinearGradient
              colors={[colors.primary, colors.primaryEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              {loading ? (
                <Text style={styles.loginButtonText}>Signing in...</Text>
              ) : (
                <>
                  <LogIn color={colors.onPrimary} size={20} style={{ marginRight: 8 }} />
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigate('SignUp')} disabled={loading}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
    height: width * 0.6,
    position: 'absolute',
    top: 0,
    opacity: 0.8,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl || 24,
    marginTop: width * 0.4,
  },
  header: {
    marginBottom: SPACING.xxxl || 32,
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
    marginBottom: SPACING.xl || 20,
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
  loginButtonWrapper: {
    borderRadius: RADIUS.lg || 16,
    overflow: 'hidden',
    marginTop: SPACING.sm || 8,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loginButtonText: {
    color: colors.onPrimary,
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

export default LoginScreen;

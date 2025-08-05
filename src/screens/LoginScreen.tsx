import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { LogIn } from 'lucide-react-native';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Work email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid work email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 2000);
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary[900], theme.colors.primary[600]]}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Employee Login</Text>
            <Text style={styles.subtitle}>Access your work transport</Text>
          </View>

          <BlurView intensity={20} style={styles.formContainer}>
            <View style={styles.form}>
              <InputField
                label="Work Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your.name@company.com"
                keyboardType="email-address"
                error={errors.email}
              />

              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <CustomButton
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                icon={<LogIn size={20} color={theme.colors.secondary[50]} />}
                style={styles.loginButton}
              />

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={onSignUp}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  title: {
    fontSize: theme.fontSizes['3xl'],
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
    textAlign: 'center',
  },
  formContainer: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    ...theme.shadows.lg,
  },
  form: {
    padding: theme.spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[400],
  },
  signUpLink: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
  },
});
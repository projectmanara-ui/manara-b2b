import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { UserPlus, ChevronDown } from 'lucide-react-native';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { organizations } from '../utils/mockData';

interface SignupScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export default function SignupScreen({ onSignUp, onLogin }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOrganizations, setShowOrganizations] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Work email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid work email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.organizationId) {
      newErrors.organization = 'Please select your organization';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSignUp();
    }, 2000);
  };

  const selectedOrganization = organizations.find(org => org.id === formData.organizationId);

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join your organization's transport network</Text>
          </View>

          <BlurView intensity={20} style={styles.formContainer}>
            <View style={styles.form}>
              <InputField
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                error={errors.name}
              />

              <InputField
                label="Work Email"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="your.name@company.com"
                keyboardType="email-address"
                error={errors.email}
              />

              <View style={styles.organizationContainer}>
                <Text style={styles.organizationLabel}>Organization</Text>
                <TouchableOpacity
                  style={[
                    styles.organizationSelector,
                    errors.organization && styles.organizationError
                  ]}
                  onPress={() => setShowOrganizations(!showOrganizations)}
                >
                  <BlurView intensity={10} style={styles.organizationBlur}>
                    <Text style={[
                      styles.organizationText,
                      !selectedOrganization && styles.placeholderText
                    ]}>
                      {selectedOrganization?.name || 'Select Your Organization'}
                    </Text>
                    <ChevronDown size={20} color={theme.colors.secondary[500]} />
                  </BlurView>
                </TouchableOpacity>
                {errors.organization && (
                  <Text style={styles.errorText}>{errors.organization}</Text>
                )}
              </View>

              {showOrganizations && (
                <BlurView intensity={15} style={styles.organizationList}>
                  {organizations.map((org) => (
                    <TouchableOpacity
                      key={org.id}
                      style={styles.organizationItem}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, organizationId: org.id }));
                        setShowOrganizations(false);
                        setErrors(prev => ({ ...prev, organization: '' }));
                      }}
                    >
                      <Text style={styles.organizationItemText}>{org.name}</Text>
                    </TouchableOpacity>
                  ))}
                </BlurView>
              )}

              <InputField
                label="Password"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                placeholder="Create a secure password"
                secureTextEntry
                error={errors.password}
              />

              <InputField
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <CustomButton
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                icon={<UserPlus size={20} color={theme.colors.secondary[50]} />}
                style={styles.signUpButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={onLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
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
    paddingVertical: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
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
  organizationContainer: {
    marginBottom: theme.spacing.md,
  },
  organizationLabel: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[700],
    marginBottom: theme.spacing.xs,
  },
  organizationSelector: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary[300],
    overflow: 'hidden',
  },
  organizationError: {
    borderColor: theme.colors.error[500],
    borderWidth: 2,
  },
  organizationBlur: {
    backgroundColor: theme.colors.glass.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  organizationText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[800],
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.secondary[400],
  },
  organizationList: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.glass.medium,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  organizationItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glass.light,
  },
  organizationItemText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[800],
  },
  errorText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.error[500],
    marginTop: theme.spacing.xs,
  },
  signUpButton: {
    marginBottom: theme.spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[400],
  },
  loginLink: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
  },
});
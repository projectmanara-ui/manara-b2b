import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../theme/theme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1
}: InputFieldProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error,
        disabled && styles.disabled
      ]}>
        <BlurView intensity={10} style={styles.inputBlur}>
          <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.secondary[400]}
            secureTextEntry={isSecure}
            keyboardType={keyboardType}
            editable={!disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
          {secureTextEntry && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsSecure(!isSecure)}
            >
              {isSecure ? (
                <Eye size={20} color={theme.colors.secondary[500]} />
              ) : (
                <EyeOff size={20} color={theme.colors.secondary[500]} />
              )}
            </TouchableOpacity>
          )}
        </BlurView>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[700],
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary[300],
    overflow: 'hidden',
  },
  focused: {
    borderColor: theme.colors.primary[500],
    borderWidth: 2,
  },
  error: {
    borderColor: theme.colors.error[500],
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  inputBlur: {
    backgroundColor: theme.colors.glass.light,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[800],
    minHeight: 44,
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  eyeButton: {
    padding: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.error[500],
    marginTop: theme.spacing.xs,
  },
});
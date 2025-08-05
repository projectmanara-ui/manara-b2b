import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '../theme/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'emergency' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  icon
}: CustomButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    return [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'secondary' ? theme.colors.primary[600] : theme.colors.secondary[50]} 
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        style={getButtonStyle()} 
        onPress={onPress} 
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.primary[600], theme.colors.primary[800]]}
          style={styles.gradientButton}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'glass') {
    return (
      <TouchableOpacity 
        style={getButtonStyle()} 
        onPress={onPress} 
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <BlurView intensity={20} style={styles.glassButton}>
          {renderContent()}
        </BlurView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[getButtonStyle(), styles[variant]]} 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  glassButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
  },
  primary: {
    backgroundColor: theme.colors.primary[600],
  },
  secondary: {
    backgroundColor: theme.colors.secondary[100],
    borderWidth: 1,
    borderColor: theme.colors.secondary[300],
  },
  emergency: {
    backgroundColor: theme.colors.error[500],
  },
  glass: {
    backgroundColor: theme.colors.glass.medium,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
  },
  disabled: {
    opacity: 0.5,
  },
  sm: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 52,
  },
  text: {
    fontFamily: theme.fonts.heading,
    textAlign: 'center',
  },
  primaryText: {
    color: theme.colors.secondary[50],
  },
  secondaryText: {
    color: theme.colors.primary[600],
  },
  emergencyText: {
    color: theme.colors.secondary[50],
  },
  glassText: {
    color: theme.colors.secondary[50],
  },
  smText: {
    fontSize: theme.fontSizes.sm,
  },
  mdText: {
    fontSize: theme.fontSizes.md,
  },
  lgText: {
    fontSize: theme.fontSizes.lg,
  },
});
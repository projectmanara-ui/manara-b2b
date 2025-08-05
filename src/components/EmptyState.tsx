import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme/theme';
import CustomButton from './CustomButton';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={10} style={styles.card}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {actionText && onAction && (
          <CustomButton
            title={actionText}
            onPress={onAction}
            variant="glass"
            style={styles.actionButton}
          />
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  card: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    width: '100%',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
    opacity: 0.6,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[800],
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[600],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    width: '100%',
  },
});
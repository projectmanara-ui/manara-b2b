import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={[theme.colors.primary[900], theme.colors.primary[700]]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/manara-logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>Manara</Text>
        <Text style={styles.tagline}>Secure Employee Transportation</Text>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.secondary[50]} />
          <Text style={styles.loadingText}>Preparing your transport...</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.secondary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: theme.fontSizes['4xl'],
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  loadingContainer: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
  },
});
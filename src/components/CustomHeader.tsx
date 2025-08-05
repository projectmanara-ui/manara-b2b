import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Bell, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { mockUser } from '../utils/mockData';

interface CustomHeaderProps {
  title?: string;
  showProfile?: boolean;
  showEmergency?: boolean;
}

export default function CustomHeader({ 
  title, 
  showProfile = true, 
  showEmergency = true 
}: CustomHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary[900], theme.colors.primary[700]]}
        style={styles.gradient}
      >
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={styles.content}>
            {showProfile && (
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                </View>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greeting}>{getGreeting()}</Text>
                  <Text style={styles.userName}>{mockUser.name}</Text>
                  <Text style={styles.organization}>{mockUser.organizationName}</Text>
                </View>
              </View>
            )}
            
            {title && (
              <Text style={styles.title}>{title}</Text>
            )}
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color={theme.colors.secondary[50]} />
              </TouchableOpacity>
              
              {showEmergency && (
                <TouchableOpacity style={styles.emergencyButton}>
                  <AlertTriangle size={20} color={theme.colors.secondary[50]} />
                  <Text style={styles.emergencyText}>SOS</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  gradient: {
    paddingBottom: theme.spacing.md,
  },
  blurContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: theme.spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.glass.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.secondary[50],
  },
  avatarText: {
    color: theme.colors.secondary[50],
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    color: theme.colors.secondary[200],
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
  },
  userName: {
    color: theme.colors.secondary[50],
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
    marginTop: 2,
  },
  organization: {
    color: theme.colors.secondary[300],
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.body,
  },
  title: {
    color: theme.colors.secondary[50],
    fontSize: theme.fontSizes['2xl'],
    fontFamily: theme.fonts.heading,
    flex: 1,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.glass.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error[500],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  emergencyText: {
    color: theme.colors.secondary[50],
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.heading,
  },
});
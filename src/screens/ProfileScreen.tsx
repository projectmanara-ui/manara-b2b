import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { User, Phone, Mail, Building, Shield, Settings, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { theme } from '../theme/theme';
import CustomHeader from '../components/CustomHeader';
import { mockUser } from '../utils/mockData';

export default function ProfileScreen() {
  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { icon: User, label: 'Full Name', value: mockUser.name },
        { icon: Mail, label: 'Email', value: mockUser.email },
        { icon: Phone, label: 'Phone', value: mockUser.phone },
        { icon: Building, label: 'Organization', value: mockUser.organizationName },
      ]
    },
    {
      title: 'Emergency Contact',
      items: [
        { icon: User, label: 'Contact Name', value: mockUser.emergencyContact.name },
        { icon: Phone, label: 'Contact Phone', value: mockUser.emergencyContact.phone },
        { icon: Shield, label: 'Relationship', value: mockUser.emergencyContact.relationship },
      ]
    }
  ];

  const actionItems = [
    { icon: Settings, label: 'Transport Settings', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: LogOut, label: 'Sign Out', action: () => {}, isDestructive: true },
  ];

  const renderProfileSection = (section: any, index: number) => (
    <View key={index} style={styles.section}>
      <BlurView intensity={15} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </BlurView>
      
      <BlurView intensity={10} style={styles.sectionContent}>
        {section.items.map((item: any, itemIndex: number) => (
          <View key={itemIndex} style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <item.icon size={20} color={theme.colors.secondary[600]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </BlurView>
    </View>
  );

  const renderActionItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.actionItem}
      onPress={item.action}
    >
      <BlurView intensity={10} style={styles.actionItemBlur}>
        <View style={styles.actionIcon}>
          <item.icon 
            size={20} 
            color={item.isDestructive ? theme.colors.error[500] : theme.colors.secondary[600]} 
          />
        </View>
        <Text style={[
          styles.actionLabel,
          item.isDestructive && styles.destructiveLabel
        ]}>
          {item.label}
        </Text>
        <ChevronRight 
          size={16} 
          color={item.isDestructive ? theme.colors.error[500] : theme.colors.secondary[400]} 
        />
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Profile" showProfile={false} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <BlurView intensity={20} style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            </View>
            <Text style={styles.profileName}>{mockUser.name}</Text>
            <Text style={styles.employeeId}>Employee ID: {mockUser.employeeId}</Text>
            <Text style={styles.organization}>{mockUser.organizationName}</Text>
          </BlurView>
        </View>

        {profileSections.map(renderProfileSection)}

        <View style={styles.actionsSection}>
          <BlurView intensity={15} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings & Support</Text>
          </BlurView>
          
          <View style={styles.actionsList}>
            {actionItems.map(renderActionItem)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary[50],
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  profileCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    ...theme.shadows.md,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.secondary[50],
    ...theme.shadows.md,
  },
  avatarText: {
    color: theme.colors.secondary[50],
    fontSize: theme.fontSizes['2xl'],
    fontFamily: theme.fonts.heading,
  },
  profileName: {
    fontSize: theme.fontSizes['2xl'],
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[800],
    marginBottom: theme.spacing.xs,
  },
  employeeId: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.mono,
    color: theme.colors.secondary[500],
    marginBottom: theme.spacing.xs,
  },
  organization: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary[600],
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[800],
  },
  sectionContent: {
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glass.light,
  },
  infoIcon: {
    marginRight: theme.spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[500],
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[800],
  },
  actionsSection: {
    marginBottom: theme.spacing.xl,
  },
  actionsList: {
    marginHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  actionItem: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
  },
  actionItemBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.glass.light,
  },
  actionIcon: {
    marginRight: theme.spacing.sm,
  },
  actionLabel: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[800],
  },
  destructiveLabel: {
    color: theme.colors.error[500],
  },
});
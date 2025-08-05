import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Calendar, Clock, Plus, Settings } from 'lucide-react-native';
import { theme } from '../theme/theme';
import CustomHeader from '../components/CustomHeader';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import { mockShifts } from '../utils/mockData';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getDaysOfWeek = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: i === 0
      });
    }
    
    return days;
  };

  const getShiftForDate = (date: string) => {
    return mockShifts.find(shift => shift.date === date);
  };

  const renderDayCard = (day: any) => {
    const shift = getShiftForDate(day.date);
    const isSelected = selectedDate === day.date;
    
    return (
      <TouchableOpacity
        key={day.date}
        style={[styles.dayCard, isSelected && styles.selectedDayCard]}
        onPress={() => setSelectedDate(day.date)}
      >
        <BlurView intensity={isSelected ? 25 : 15} style={styles.dayCardBlur}>
          <Text style={[styles.dayName, isSelected && styles.selectedDayText]}>
            {day.dayName}
          </Text>
          <Text style={[styles.dayNumber, isSelected && styles.selectedDayText]}>
            {day.dayNumber}
          </Text>
          {day.isToday && (
            <View style={styles.todayIndicator}>
              <Text style={styles.todayText}>Today</Text>
            </View>
          )}
          {shift && (
            <View style={styles.shiftIndicator}>
              <Clock size={12} color={theme.colors.primary[600]} />
            </View>
          )}
        </BlurView>
      </TouchableOpacity>
    );
  };

  const selectedShift = getShiftForDate(selectedDate);

  return (
    <View style={styles.container}>
      <CustomHeader title="My Work Shifts" showProfile={false} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarSection}>
          <BlurView intensity={15} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={20} color={theme.colors.secondary[600]} />
            </TouchableOpacity>
          </BlurView>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysContainer}
          >
            {getDaysOfWeek().map(renderDayCard)}
          </ScrollView>
        </View>

        <View style={styles.shiftDetailsSection}>
          {selectedShift ? (
            <BlurView intensity={15} style={styles.shiftCard}>
              <View style={styles.shiftHeader}>
                <View style={styles.shiftTypeContainer}>
                  <Clock size={24} color={theme.colors.primary[600]} />
                  <Text style={styles.shiftType}>
                    {selectedShift.type.charAt(0).toUpperCase() + selectedShift.type.slice(1)} Shift
                  </Text>
                </View>
                {selectedShift.isRegular && (
                  <View style={styles.regularBadge}>
                    <Text style={styles.regularText}>Regular</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.shiftTimes}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>Start Time</Text>
                  <Text style={styles.timeValue}>{selectedShift.startTime}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>End Time</Text>
                  <Text style={styles.timeValue}>{selectedShift.endTime}</Text>
                </View>
              </View>

              <CustomButton
                title="Book Transport for This Shift"
                onPress={() => {}}
                variant="primary"
                icon={<Plus size={20} color={theme.colors.secondary[50]} />}
                style={styles.bookButton}
              />
            </BlurView>
          ) : (
            <EmptyState
              icon={<Calendar size={64} color={theme.colors.secondary[400]} />}
              title="No shift scheduled"
              description="Set your regular work hours for easier booking and better transport planning."
              actionText="Add Shift"
              onAction={() => {}}
            />
          )}
        </View>

        <View style={styles.preferencesSection}>
          <BlurView intensity={15} style={styles.preferencesCard}>
            <Text style={styles.preferencesTitle}>Transport Preferences</Text>
            <Text style={styles.preferencesDescription}>
              Set your regular work hours for easier booking
            </Text>
            <CustomButton
              title="Manage Preferences"
              onPress={() => {}}
              variant="glass"
              icon={<Settings size={20} color={theme.colors.secondary[50]} />}
              style={styles.preferencesButton}
            />
          </BlurView>
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
  calendarSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
  settingsButton: {
    padding: theme.spacing.xs,
  },
  daysContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  dayCard: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
  },
  selectedDayCard: {
    borderColor: theme.colors.primary[500],
    borderWidth: 2,
  },
  dayCardBlur: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: theme.colors.glass.light,
    minWidth: 60,
    position: 'relative',
  },
  dayName: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[600],
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[800],
  },
  selectedDayText: {
    color: theme.colors.primary[600],
  },
  todayIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  todayText: {
    fontSize: 8,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
  },
  shiftIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  shiftDetailsSection: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  shiftCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    ...theme.shadows.md,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  shiftTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  shiftType: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[800],
  },
  regularBadge: {
    backgroundColor: theme.colors.success[500],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  regularText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
  },
  shiftTimes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[600],
    marginBottom: theme.spacing.xs,
  },
  timeValue: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary[600],
  },
  bookButton: {
    width: '100%',
  },
  preferencesSection: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  preferencesCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  preferencesTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[800],
    marginBottom: theme.spacing.sm,
  },
  preferencesDescription: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[600],
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  preferencesButton: {
    width: '100%',
  },
});
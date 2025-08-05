import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BlurView } from 'expo-blur';
import { Calendar, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { theme } from '../theme/theme';
import CustomHeader from '../components/CustomHeader';
import TripCard from '../components/TripCard';
import EmptyState from '../components/EmptyState';
import { mockTrips } from '../utils/mockData';
import { Trip } from '../types';

const Tab = createMaterialTopTabNavigator();

function UpcomingTrips() {
  const upcomingTrips = mockTrips.filter(trip => trip.status === 'booked');

  if (upcomingTrips.length === 0) {
    return (
      <EmptyState
        icon={<Calendar size={64} color={theme.colors.secondary[400]} />}
        title="No upcoming trips"
        description="Book your next ride to work to see it here. Plan ahead for a stress-free commute."
        actionText="Book Transport"
        onAction={() => {}}
      />
    );
  }

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={upcomingTrips}
        renderItem={({ item }) => <TripCard trip={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ActiveTrips() {
  const activeTrips = mockTrips.filter(trip => trip.status === 'in_transit');

  if (activeTrips.length === 0) {
    return (
      <EmptyState
        icon={<Clock size={64} color={theme.colors.secondary[400]} />}
        title="No active trips"
        description="When you're traveling, your current trip will appear here with live tracking."
      />
    );
  }

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={activeTrips}
        renderItem={({ item }) => <TripCard trip={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function PastTrips() {
  const pastTrips = mockTrips.filter(trip => 
    trip.status === 'completed' || trip.status === 'cancelled'
  );

  if (pastTrips.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle size={64} color={theme.colors.secondary[400]} />}
        title="No trip history"
        description="Your completed and cancelled trips will appear here for easy reference."
      />
    );
  }

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={pastTrips}
        renderItem={({ item }) => <TripCard trip={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default function TripsScreen() {
  return (
    <View style={styles.container}>
      <CustomHeader title="My Trips" showProfile={false} />
      
      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarIndicatorStyle: styles.tabIndicator,
            tabBarActiveTintColor: theme.colors.primary[600],
            tabBarInactiveTintColor: theme.colors.secondary[500],
            tabBarPressColor: theme.colors.glass.light,
          }}
        >
          <Tab.Screen 
            name="Upcoming" 
            component={UpcomingTrips}
            options={{ tabBarLabel: 'Upcoming' }}
          />
          <Tab.Screen 
            name="Active" 
            component={ActiveTrips}
            options={{ tabBarLabel: 'Active' }}
          />
          <Tab.Screen 
            name="Past" 
            component={PastTrips}
            options={{ tabBarLabel: 'Past' }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary[50],
  },
  tabsContainer: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: theme.colors.secondary[50],
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glass.light,
  },
  tabLabel: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.heading,
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: theme.colors.primary[600],
    height: 3,
    borderRadius: 2,
  },
  listContent: {
    paddingVertical: theme.spacing.md,
  },
});
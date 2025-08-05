import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { MapPin, Clock, ArrowRight, Car } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
  onPress?: () => void;
}

export default function TripCard({ trip, onPress }: TripCardProps) {
  const getStatusColor = () => {
    switch (trip.status) {
      case 'booked':
        return theme.colors.primary[500];
      case 'in_transit':
        return theme.colors.warning[500];
      case 'completed':
        return theme.colors.success[500];
      case 'cancelled':
        return theme.colors.error[500];
      default:
        return theme.colors.secondary[400];
    }
  };

  const getStatusText = () => {
    switch (trip.status) {
      case 'booked':
        return 'Booked';
      case 'in_transit':
        return 'In Transit';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <BlurView intensity={20} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Car size={16} color={theme.colors.primary[600]} />
            <Text style={styles.tripType}>
              {trip.type === 'to_work' ? 'To Work' : 'From Work'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.locationRow}>
            <MapPin size={16} color={theme.colors.secondary[600]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {trip.pickupLocation.name}
            </Text>
          </View>
          
          <View style={styles.arrowContainer}>
            <ArrowRight size={16} color={theme.colors.secondary[400]} />
          </View>
          
          <View style={styles.locationRow}>
            <MapPin size={16} color={theme.colors.primary[600]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {trip.dropLocation.name}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Clock size={14} color={theme.colors.secondary[500]} />
            <Text style={styles.timeText}>
              {formatDate(trip.scheduledTime)} • {formatTime(trip.scheduledTime)}
            </Text>
          </View>
          <Text style={styles.fareText}>
            KES {trip.fare}
          </Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  tripType: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[800],
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flex: 1,
  },
  locationText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[700],
    flex: 1,
  },
  arrowContainer: {
    paddingHorizontal: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  timeText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[500],
  },
  fareText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary[600],
  },
});
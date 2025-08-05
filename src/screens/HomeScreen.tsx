import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';
import { MapPin, Navigation } from 'lucide-react-native';
import { theme } from '../theme/theme';
import CustomHeader from '../components/CustomHeader';
import CustomButton from '../components/CustomButton';
import { pickupLocations } from '../utils/mockData';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleBookToWork = () => {
    Alert.alert(
      'Book Trip to Work',
      'This will open the booking modal to schedule your transport to work.',
      [{ text: 'OK' }]
    );
  };

  const handleBookFromWork = () => {
    Alert.alert(
      'Book Trip from Work',
      'This will open the booking modal to schedule your transport from work.',
      [{ text: 'OK' }]
    );
  };

  const initialRegion = {
    latitude: location?.coords.latitude || -1.2921,
    longitude: location?.coords.longitude || 36.8219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <CustomHeader />
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          region={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {pickupLocations.map((pickup) => (
            <Marker
              key={pickup.id}
              coordinate={pickup.coordinates}
              title={pickup.name}
              description={pickup.address}
            >
              <View style={styles.markerContainer}>
                <BlurView intensity={20} style={styles.marker}>
                  <MapPin size={20} color={theme.colors.primary[600]} />
                </BlurView>
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={styles.floatingButtons}>
          <CustomButton
            title="Book Trip to Work"
            onPress={handleBookToWork}
            variant="primary"
            icon={<Navigation size={20} color={theme.colors.secondary[50]} />}
            style={styles.bookButton}
          />
          
          <CustomButton
            title="Book Trip Home"
            onPress={handleBookFromWork}
            variant="glass"
            icon={<Navigation size={20} color={theme.colors.secondary[50]} />}
            style={styles.bookButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary[100],
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary[50],
    borderWidth: 2,
    borderColor: theme.colors.primary[600],
    ...theme.shadows.md,
  },
  floatingButtons: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  bookButton: {
    ...theme.shadows.lg,
  },
});
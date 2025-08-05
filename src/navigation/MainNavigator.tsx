import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { Chrome as Home, Calendar, Wallet, Clock, User } from 'lucide-react-native';
import { theme } from '../theme/theme';
import HomeScreen from '../screens/HomeScreen';
import TripsScreen from '../screens/TripsScreen';
import WalletScreen from '../screens/WalletScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let IconComponent;
          const color = focused ? theme.colors.primary[600] : theme.colors.secondary[500];

          switch (route.name) {
            case 'Home':
              IconComponent = Home;
              break;
            case 'Trips':
              IconComponent = Calendar;
              break;
            case 'Wallet':
              IconComponent = Wallet;
              break;
            case 'Schedule':
              IconComponent = Clock;
              break;
            case 'Profile':
              IconComponent = User;
              break;
            default:
              IconComponent = Home;
          }

          return <IconComponent size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary[600],
        tabBarInactiveTintColor: theme.colors.secondary[500],
        tabBarLabelStyle: {
          fontSize: theme.fontSizes.xs,
          fontFamily: theme.fonts.heading,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            style={{
              flex: 1,
              backgroundColor: theme.colors.glass.medium,
              borderTopWidth: 1,
              borderTopColor: theme.colors.glass.light,
            }}
          />
        ),
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Trips" 
        component={TripsScreen}
        options={{ tabBarLabel: 'Trips' }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{ tabBarLabel: 'Wallet' }}
      />
      <Tab.Screen 
        name="Schedule" 
        component={ScheduleScreen}
        options={{ tabBarLabel: 'Schedule' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
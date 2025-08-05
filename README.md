# Manara - Employee Transportation Platform

A React Native Expo app for secure, scheduled employee transportation, especially designed for shift workers and late-hour commutes.

## Features

- **Advance Booking**: Schedule transport up to 7 days ahead
- **Real-time Tracking**: Live updates on transport arrival
- **Shift Integration**: Seamless integration with work schedules
- **Wallet Management**: Monthly transport allowances and usage tracking
- **Emergency Support**: Built-in SOS functionality for safety
- **Organization Integration**: Multi-organization support

## Tech Stack

- **Framework**: Expo SDK 53 with React Native
- **Navigation**: React Navigation v6 with bottom tabs and material top tabs
- **UI**: Custom glassmorphic design with Expo Blur and Linear Gradient
- **Maps**: React Native Maps with Google Maps integration
- **Fonts**: Figtree and Plus Jakarta Sans via Expo Google Fonts
- **Icons**: Lucide React Native
- **Animations**: React Native Reanimated

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Google Maps API Key
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
3. Replace `PLACEHOLDER_API_KEY_REPLACE_AFTER_GENERATION` in `app.json` with your actual API key

### 3. Run the App
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomHeader.tsx
│   ├── CustomButton.tsx
│   ├── TripCard.tsx
│   ├── WalletCard.tsx
│   ├── EmptyState.tsx
│   ├── LoadingShimmer.tsx
│   └── InputField.tsx
├── screens/            # Main app screens
│   ├── SplashScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── HomeScreen.tsx
│   ├── TripsScreen.tsx
│   ├── WalletScreen.tsx
│   ├── ScheduleScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/         # Navigation configuration
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
├── theme/             # Design system
│   └── theme.ts
├── types/             # TypeScript interfaces
│   └── index.ts
└── utils/             # Utilities and mock data
    └── mockData.ts
```

## Key Features Implementation

### Authentication Flow
- Splash screen with Manara branding
- 3-slide onboarding explaining key features
- Employee login with organization selection
- Profile setup for new users

### Main Navigation
- **Home**: Interactive map with pickup points and booking buttons
- **Trips**: Material top tabs for Upcoming/Active/Past trips
- **Wallet**: Monthly allowance tracking and transaction history
- **Schedule**: Work shift management and transport preferences
- **Profile**: Employee information and emergency contacts

### Design System
- **Colors**: Primary (#0a0c42) with glassmorphic effects
- **Typography**: Figtree for headings, Plus Jakarta Sans for body text
- **Components**: Consistent blur effects and gradient backgrounds
- **Spacing**: 8px grid system for consistent layouts

### Maps Integration
- Current location tracking
- Custom markers for pickup points
- Route visualization
- Location permissions handling

## Mock Data

The app includes realistic mock data for:
- Kenyan organizations (Safaricom, Equity Bank, Kenya Airways, Nairobi Hospital)
- Nairobi pickup locations with accurate coordinates
- Employee profiles with African names and context
- Transport allowances in KES currency
- Shift schedules for different work patterns

## Platform Support

- **iOS**: Full feature support with proper safe area handling
- **Android**: Google Maps integration with adaptive icons
- **Web**: Limited functionality (maps may not work in browser)

## Development Notes

- Location permissions are required for map functionality
- Google Maps API key must be configured for production use
- Fonts are loaded asynchronously with proper loading states
- All components use glassmorphic design with blur effects
- Error boundaries and fallbacks are implemented throughout

## Next Steps

1. Integrate with backend API for real data
2. Implement push notifications for trip updates
3. Add payment gateway integration
4. Implement real-time tracking with WebSockets
5. Add offline support for critical features
6. Implement proper authentication with JWT tokens
7. Add comprehensive testing suite

## Support

For technical support or feature requests, contact the development team.
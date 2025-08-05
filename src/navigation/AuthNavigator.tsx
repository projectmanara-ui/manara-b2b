import React, { useState } from 'react';
import { View } from 'react-native';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

interface AuthNavigatorProps {
  onAuthComplete: () => void;
}

export default function AuthNavigator({ onAuthComplete }: AuthNavigatorProps) {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding' | 'login' | 'signup'>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    onAuthComplete();
  };

  const handleSignUp = () => {
    onAuthComplete();
  };

  const navigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashComplete} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} onSignUp={navigateToSignUp} />;
      case 'signup':
        return <SignupScreen onSignUp={handleSignUp} onLogin={navigateToLogin} />;
      default:
        return <SplashScreen onFinish={handleSplashComplete} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderCurrentScreen()}
    </View>
  );
}
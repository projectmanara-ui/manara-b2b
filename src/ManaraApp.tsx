import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation/MainNavigator';

export default function ManaraApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
  };

  return (
    <NavigationContainer independent={true}>
      {isAuthenticated ? (
        <MainNavigator />
      ) : (
        <AuthNavigator onAuthComplete={handleAuthComplete} />
      )}
    </NavigationContainer>
  );
}
import React from 'react';
import { View, StyleSheet } from 'react-native';

// This file serves as the entry point for the tabs layout
// The actual app logic is handled in _layout.tsx
export default function TabIndex() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
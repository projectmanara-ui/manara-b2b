import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { theme } from '../theme/theme';

interface LoadingShimmerProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export default function LoadingShimmer({
  width = '100%',
  height = 20,
  borderRadius = theme.borderRadius.sm,
  style
}: LoadingShimmerProps) {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 0.7, 0.3]);
    return {
      opacity,
    };
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <BlurView intensity={5} style={styles.blur}>
        <Animated.View style={[styles.shimmer, animatedStyle]} />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: theme.colors.glass.light,
  },
  blur: {
    flex: 1,
    borderRadius: 'inherit',
  },
  shimmer: {
    flex: 1,
    backgroundColor: theme.colors.secondary[300],
  },
});
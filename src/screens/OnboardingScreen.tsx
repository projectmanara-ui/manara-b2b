import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Calendar, MapPin, Shield, ChevronRight } from 'lucide-react-native';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: <Calendar size={64} color={theme.colors.secondary[50]} />,
    title: 'Book rides to work\n7 days ahead',
    description: 'Plan your work commute in advance. Schedule transport for your shifts up to a week ahead for peace of mind.'
  },
  {
    id: '2',
    icon: <MapPin size={64} color={theme.colors.secondary[50]} />,
    title: 'Track your bus\nin real-time',
    description: 'Know exactly when your transport will arrive. Get live updates and never miss your pickup again.'
  },
  {
    id: '3',
    icon: <Shield size={64} color={theme.colors.secondary[50]} />,
    title: 'Safe transport for\nshift workers',
    description: 'Secure, reliable transportation especially designed for employees working late hours and night shifts.'
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        {item.icon}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot
          ]}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={[theme.colors.primary[900], theme.colors.primary[600]]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.flatList}
      />

      <BlurView intensity={20} style={styles.footer}>
        {renderDots()}
        <CustomButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="glass"
          icon={currentIndex < slides.length - 1 ? <ChevronRight size={20} color={theme.colors.secondary[50]} /> : undefined}
          style={styles.nextButton}
        />
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  skipText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing['2xl'],
    opacity: 0.9,
  },
  title: {
    fontSize: theme.fontSizes['3xl'],
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 36,
  },
  description: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: theme.spacing.md,
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.glass.light,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.glass.medium,
  },
  activeDot: {
    backgroundColor: theme.colors.secondary[50],
    width: 24,
  },
  nextButton: {
    width: '100%',
  },
});
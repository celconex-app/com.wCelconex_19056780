
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

interface AnimatedLogoProps {
  size?: number;
  showWaves?: boolean;
}

export default function AnimatedLogo({ size = 200, showWaves = true }: AnimatedLogoProps) {
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);
  const logoScale = useSharedValue(1);
  const logoGlow = useSharedValue(0);

  useEffect(() => {
    // Logo breathing animation
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2500 }),
        withTiming(0.98, { duration: 2500 })
      ),
      -1,
      true
    );

    // Logo glow effect
    logoGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.4, { duration: 2000 })
      ),
      -1,
      true
    );

    if (showWaves) {
      // Synchronized wave animations matching the original design
      wave1.value = withRepeat(withTiming(1, { duration: 2000 }), -1);
      wave2.value = withDelay(
        600,
        withRepeat(withTiming(1, { duration: 2000 }), -1)
      );
      wave3.value = withDelay(
        1200,
        withRepeat(withTiming(1, { duration: 2000 }), -1)
      );
    }
  }, [showWaves]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(logoGlow.value, [0, 1], [0.3, 0.8]),
    transform: [{ scale: interpolate(logoGlow.value, [0, 1], [1, 1.2]) }],
  }));

  const wave1Style = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(wave1.value, [0, 1], [0.7, 1.8]) }
    ],
    opacity: interpolate(wave1.value, [0, 0.2, 0.8, 1], [0.9, 0.7, 0.3, 0]),
  }));

  const wave2Style = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(wave2.value, [0, 1], [0.5, 2.2]) }
    ],
    opacity: interpolate(wave2.value, [0, 0.2, 0.8, 1], [0.7, 0.5, 0.2, 0]),
  }));

  const wave3Style = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(wave3.value, [0, 1], [0.3, 2.6]) }
    ],
    opacity: interpolate(wave3.value, [0, 0.2, 0.8, 1], [0.5, 0.3, 0.1, 0]),
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {showWaves && (
        <>
          {/* Animated WiFi Waves - matching original design */}
          <Animated.View style={[
            styles.wave,
            wave3Style,
            { width: size * 1.2, height: size * 1.2 }
          ]}>
            <LinearGradient
              colors={['#00E5FF20', '#2196F320', '#1976D210']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          
          <Animated.View style={[
            styles.wave,
            wave2Style,
            { width: size * 0.9, height: size * 0.9 }
          ]}>
            <LinearGradient
              colors={['#00E5FF40', '#2196F340', '#1976D220']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          
          <Animated.View style={[
            styles.wave,
            wave1Style,
            { width: size * 0.7, height: size * 0.7 }
          ]}>
            <LinearGradient
              colors={['#00E5FF60', '#2196F360', '#1976D240']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        </>
      )}
      
      {/* Background glow effect */}
      <Animated.View style={[
        styles.backgroundGlow,
        glowAnimatedStyle,
        { width: size * 1.1, height: size * 0.8 }
      ]}>
        <LinearGradient
          colors={['#00E5FF15', '#2196F310', '#1976D205']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Main Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        {/* Logo glow */}
        <Animated.View style={[
          styles.logoGlow,
          glowAnimatedStyle,
          { width: size * 0.9, height: size * 0.65 }
        ]} />
        
                        {/* Actual logo image */}
        <Image 
          source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/T4XYLjdqJ3oa6x6GRzbps6/1757224710422.png' }}
          style={[styles.logo, { width: size * 0.85, height: size * 0.6 }]}
          contentFit="contain"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  backgroundGlow: {
    position: 'absolute',
    borderRadius: 1000,
  },
  logoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    zIndex: 12,
  },
  logoGlow: {
    position: 'absolute',
    backgroundColor: '#00E5FF',
    borderRadius: 1000,
    opacity: 0.15,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 25,
    zIndex: 11,
  },
});

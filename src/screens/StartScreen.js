import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, StatusBar, Dimensions } from 'react-native';
import CustomText from '@/components/UI/CustomText';
import CustomButton from '@/components/UI/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

/**
 * Enhanced StartScreen with modern design, animations, and improved UX
 */
const StartScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent />
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.secondary]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>

        {/* Animation Container */}
        <Animated.View 
          style={[
            styles.animationContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LottieView
            source={require('@/assets/animations/todo.json')}
            autoPlay
            loop
            style={styles.welcomeAnimation}
          />
        </Animated.View>

        {/* Content Container */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Welcome Text */}
          <View style={styles.textContainer}>
            <CustomText variant="h1" style={styles.welcomeText}>
              Welcome to
            </CustomText>
            <CustomText variant="h1" style={styles.brandText}>
              TodoX
            </CustomText>
            <CustomText variant="bodyLarge" style={styles.subtitle}>
              Organize your day with ease. Stay focused, stay productive, achieve more.
            </CustomText>
          </View>

          {/* Feature Highlights */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              </View>
              <CustomText style={styles.featureText}>Smart task management</CustomText>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="trending-up" size={20} color={colors.white} />
              </View>
              <CustomText style={styles.featureText}>Track your progress</CustomText>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="notifications" size={20} color={colors.white} />
              </View>
              <CustomText style={styles.featureText}>Never miss a deadline</CustomText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Get Started"
              onPress={() => navigation.navigate('Task')}
              variant="secondary"
              size="large"
              fullWidth
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
              icon={<Ionicons name="arrow-forward" size={20} color={colors.primary} />}
              iconPosition="right"
            />
            
            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn')}
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <CustomText style={styles.secondaryButtonText}>
                Already have an account? Sign In
              </CustomText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: StatusBar.currentHeight || spacing.xl,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    backgroundColor: colors.white + '10',
    borderRadius: borderRadius.full,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    right: 50,
  },
  animationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  welcomeAnimation: {
    width: Math.min(width * 0.8, 320),
    height: Math.min(width * 0.8, 320),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xl,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcomeText: {
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  brandText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: typography.fontWeight.extrabold,
    textShadowColor: colors.shadow.medium,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: colors.white,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    lineHeight: typography.fontSize.lg * 1.6,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.white,
    ...shadows.lg,
  },
  primaryButtonText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
});

export default StartScreen;
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, StatusBar, Dimensions, Platform, SafeAreaView } from 'react-native';
import CustomText from '@/components/UI/CustomText';
import CustomButton from '@/components/UI/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Get responsive dimensions based on screen size
 */
const getResponsiveDimensions = () => {
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const isSmallScreen = height < 700;
  
  return {
    width,
    height,
    isTablet,
    isLandscape,
    isSmallScreen,
    containerPadding: isTablet ? spacing.xxl : spacing.lg,
    contentMaxWidth: isTablet ? 600 : width * 0.9,
    animationSize: isTablet 
      ? Math.min(400, width * 0.35) 
      : isSmallScreen 
        ? Math.min(width * 0.55, 220)
        : Math.min(width * 0.7, 280),
  };
};

/**
 * Enhanced StartScreen with improved responsiveness
 */
const StartScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [dimensions, setDimensions] = useState(getResponsiveDimensions());

  useEffect(() => {
    // Handle orientation changes
    const subscription = Dimensions.addEventListener('change', () => {
      setDimensions(getResponsiveDimensions());
    });

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

    return () => subscription?.remove();
  }, []);

  const responsiveStyles = getResponsiveStyles(dimensions);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent />
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary, colors.surface]}
        style={[styles.container, responsiveStyles.container]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={[styles.backgroundPattern, responsiveStyles.backgroundPattern]}>
          <View style={[styles.circle, responsiveStyles.circle1]} />
          <View style={[styles.circle, responsiveStyles.circle2]} />
          <View style={[styles.circle, responsiveStyles.circle3]} />
        </View>

        {/* Main Content Wrapper */}
        <View style={[styles.mainWrapper, responsiveStyles.mainWrapper]}>
          {/* Animation Container */}
          <Animated.View 
            style={[
              styles.animationContainer,
              responsiveStyles.animationContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LottieView
              source={require('@/assets/animations/todo.json')}
              autoPlay
              loop
              style={[styles.welcomeAnimation, responsiveStyles.welcomeAnimation]}
            />
          </Animated.View>

          {/* Content Container */}
          <Animated.View 
            style={[
              styles.contentContainer,
              responsiveStyles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Welcome Text */}
            <View style={[styles.textContainer, responsiveStyles.textContainer]}>
              <CustomText variant="h1" style={[styles.welcomeText, responsiveStyles.welcomeText]}>
                Welcome to
              </CustomText>
              <CustomText variant="h1" style={[styles.brandText, responsiveStyles.brandText]}>
                TodoX
              </CustomText>
              <CustomText variant="bodyLarge" style={[styles.subtitle, responsiveStyles.subtitle]}>
                Organize your day with ease. Stay focused, stay productive, achieve more.
              </CustomText>
            </View>

            {/* Feature Highlights */}
            <View style={[styles.featuresContainer, responsiveStyles.featuresContainer]}>
              <View style={[styles.featureItem, responsiveStyles.featureItem]}>
                <View style={[styles.featureIcon, responsiveStyles.featureIcon]}>
                  <Ionicons name="checkmark-circle" size={responsiveStyles.iconSize} color={colors.primary} />
                </View>
                <CustomText style={[styles.featureText, responsiveStyles.featureText]}>Smart task management</CustomText>
              </View>
              <View style={[styles.featureItem, responsiveStyles.featureItem]}>
                <View style={[styles.featureIcon, responsiveStyles.featureIcon]}>
                  <Ionicons name="trending-up" size={responsiveStyles.iconSize} color={colors.secondary} />
                </View>
                <CustomText style={[styles.featureText, responsiveStyles.featureText]}>Track your progress</CustomText>
              </View>
              <View style={[styles.featureItem, responsiveStyles.featureItem]}>
                <View style={[styles.featureIcon, responsiveStyles.featureIcon]}>
                  <Ionicons name="notifications" size={responsiveStyles.iconSize} color={colors.primary} />
                </View>
                <CustomText style={[styles.featureText, responsiveStyles.featureText]}>Never miss a deadline</CustomText>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={[styles.buttonContainer, responsiveStyles.buttonContainer]}>
              <CustomButton
                title="Get Started"
                onPress={() => navigation.navigate('Task')}
                variant="secondary"
                size="large"
                fullWidth
                style={[styles.primaryButton, responsiveStyles.primaryButton]}
                textStyle={[styles.primaryButtonText, responsiveStyles.primaryButtonText]}
                icon={<Ionicons name="arrow-forward" size={responsiveStyles.buttonIconSize} color={colors.textOnDark} />}
                iconPosition="right"
              />
              
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={[styles.secondaryButton, responsiveStyles.secondaryButton]}
                activeOpacity={0.8}
              >
                <CustomText style={[styles.secondaryButtonText, responsiveStyles.secondaryButtonText]}>
                  Already have an account? Sign In
                </CustomText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

/**
 * Generate responsive styles based on screen dimensions
 */
const getResponsiveStyles = (dimensions) => {
  const { width, height, isTablet, isLandscape, isSmallScreen, containerPadding, contentMaxWidth, animationSize } = dimensions;
  
  return StyleSheet.create({
    container: {
      paddingHorizontal: containerPadding,
      paddingTop: Platform.OS === 'ios' ? (isLandscape ? spacing.lg : spacing.xl) : spacing.xl + StatusBar.currentHeight,
      paddingBottom: spacing.lg,
    },
    backgroundPattern: {
      zIndex: -1, // Ensure background stays behind content
    },
    mainWrapper: {
      maxWidth: contentMaxWidth,
      width: '100%',
      alignSelf: 'center',
      flex: 1,
      justifyContent: isLandscape ? 'space-between' : 'flex-start',
    },
    circle1: {
      width: isTablet ? 280 : 180,
      height: isTablet ? 280 : 180,
      top: isTablet ? -140 : -90,
      right: isTablet ? -140 : -90,
      backgroundColor: colors.primary + '10',
    },
    circle2: {
      width: isTablet ? 180 : 130,
      height: isTablet ? 180 : 130,
      bottom: isTablet ? 140 : 90,
      left: isTablet ? -90 : -65,
      backgroundColor: colors.secondary + '08',
    },
    circle3: {
      width: isTablet ? 140 : 90,
      height: isTablet ? 140 : 90,
      top: height * (isLandscape ? 0.15 : 0.25),
      right: isTablet ? 90 : 40,
      backgroundColor: colors.primary + '15',
    },
    animationContainer: {
      flex: isLandscape ? 0.5 : 0.4,
      marginTop: isSmallScreen ? spacing.sm : spacing.lg,
      marginBottom: isSmallScreen ? spacing.sm : spacing.lg,
      minHeight: isLandscape ? 180 : 200,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    welcomeAnimation: {
      width: animationSize,
      height: animationSize,
      zIndex: 1,
    },
    contentContainer: {
      flex: isLandscape ? 0.5 : 0.6,
      paddingBottom: isTablet ? spacing.xxl : spacing.lg,
      minHeight: isLandscape ? 280 : 300,
      zIndex: 2,
    },
    textContainer: {
      marginBottom: isSmallScreen ? spacing.md : spacing.lg,
      marginTop: isSmallScreen ? spacing.sm : spacing.md,
      paddingHorizontal: isTablet ? spacing.xl : spacing.sm,
    },
    welcomeText: {
      fontSize: isTablet 
        ? typography.fontSize['3xl'] 
        : isSmallScreen 
          ? typography.fontSize.xl 
          : typography.fontSize['2xl'],
      lineHeight: isTablet 
        ? typography.fontSize['3xl'] * 1.3 
        : typography.fontSize['2xl'] * 1.3,
    },
    brandText: {
      fontSize: isTablet 
        ? typography.fontSize['4xl'] 
        : isSmallScreen 
          ? typography.fontSize['2xl'] 
          : typography.fontSize['3xl'],
      lineHeight: isTablet 
        ? typography.fontSize['4xl'] * 1.2 
        : typography.fontSize['3xl'] * 1.2,
    },
    subtitle: {
      fontSize: isTablet 
        ? typography.fontSize.lg 
        : isSmallScreen 
          ? typography.fontSize.sm 
          : typography.fontSize.base,
      lineHeight: isTablet 
        ? typography.fontSize.lg * 1.6 
        : typography.fontSize.base * 1.6,
      paddingHorizontal: isTablet ? spacing.lg : spacing.sm,
    },
    featuresContainer: {
      marginBottom: isSmallScreen ? spacing.md : spacing.lg,
      paddingHorizontal: isTablet ? spacing.lg : spacing.sm,
    },
    featureItem: {
      marginBottom: isSmallScreen ? spacing.xs : spacing.sm,
    },
    featureIcon: {
      width: isTablet ? 36 : 28,
      height: isTablet ? 36 : 28,
    },
    featureText: {
      fontSize: isTablet ? typography.fontSize.base : typography.fontSize.sm,
    },
    iconSize: isTablet ? 22 : 18,
    buttonContainer: {
      gap: isSmallScreen ? spacing.xs : spacing.sm,
      paddingHorizontal: isTablet ? spacing.lg : spacing.xs,
      marginBottom: isSmallScreen ? spacing.sm : spacing.md,
    },
    primaryButton: {
      paddingVertical: isTablet ? spacing.md : spacing.sm,
    },
    primaryButtonText: {
      fontSize: isTablet ? typography.fontSize.base : typography.fontSize.sm,
    },
    secondaryButton: {
      paddingVertical: isTablet ? spacing.md : spacing.sm,
    },
    secondaryButtonText: {
      fontSize: isTablet ? typography.fontSize.base : typography.fontSize.sm,
    },
    buttonIconSize: isTablet ? 22 : 18,
  });
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
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
    borderRadius: borderRadius.full,
  },
  mainWrapper: {
    flex: 1,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeAnimation: {
    // Dynamic sizing handled in responsive styles
  },
  contentContainer: {
    justifyContent: 'flex-end',
  },
  textContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    color: colors.textPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  brandText: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: typography.fontWeight.extrabold,
    textShadowColor: colors.shadow.colored,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: spacing.sm,
  },
  featuresContainer: {
    // Responsive spacing handled in responsive styles
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    color: colors.textPrimary,
    opacity: 0.9,
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    ...shadows.lg,
  },
  primaryButtonText: {
    color: colors.textOnDark,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryButton: {
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
});

export default StartScreen;
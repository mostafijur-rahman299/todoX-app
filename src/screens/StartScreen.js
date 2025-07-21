import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import CustomText from '@/components/UI/CustomText';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const StartScreen = () => {
  const navigation = useNavigation();
  const buttonScale = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(0.7)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  // Button press animation
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.92,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  // Text and image entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.spring(imageScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primary, colors.primary]}
      style={styles.container}
    >
      {/* Welcome Text */}
      <Animated.View style={{ opacity: textFade }}>
        <CustomText style={styles.welcomeText}>Welcome to</CustomText>
      </Animated.View>
      
      {/* App Title */}
      <Animated.View style={[styles.titleContainer, { opacity: textFade }]}>
        <CustomText style={styles.logoTitle}>TodoX</CustomText>
      </Animated.View>
      
      {/* Subtitle */}
      <Animated.View style={{ opacity: textFade }}>
        <CustomText style={styles.subtitle}>
          Ignite Your Goals, Conquer Your Day
        </CustomText>
      </Animated.View>
      
      {/* Image */}
      <View style={styles.imageContainer}>
        <Animated.View style={{ transform: [{ scale: imageScale }] }}>
          <LottieView
            source={require('@/assets/animations/todo.json')}
            autoPlay
            loop
            style={styles.welcomeImage}
          />
        </Animated.View>
      </View>
      
      {/* Get Started Button */}
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate('SignIn')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#ef4444', '#b91c1c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.getStartedButton}
          >
            <CustomText style={styles.buttonText}>Launch Now</CustomText>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 30,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
    letterSpacing: 2.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: 'NicoMoji-Regular',
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  logoTitle: {
    fontSize: 56,
    color: '#fed7d7',
    textAlign: 'center',
    fontFamily: 'NicoMoji-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    fontFamily: 'NicoMoji-Regular',
  },
  subtitle: {
    fontSize: 20,
    color: '#f3f4f6',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
    paddingHorizontal: 25,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeImage: {
    width: 320,
    height: 320,
    contentFit: 'contain',
  },
  buttonContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  getStartedButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import CustomText from '@/components/UI/CustomText';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const StartScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <View>
          <LottieView
            source={require('@/assets/animations/todo.json')}
            autoPlay
            loop
            style={styles.welcomeImage}
          />
        </View>
      </View>

      {/* Welcome Text */}
      <View>
        <CustomText style={styles.welcomeText}>Welcome to TodoX</CustomText>
      </View>

      {/* Subtitle */}
      <View>
        <CustomText style={styles.subtitle}>
          Organize your day with ease. Start now to stay focused and productive.
        </CustomText>
      </View>

      {/* Get Started Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Task')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#ef4444', '#f97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.getStartedButton}
          >
            <CustomText style={styles.buttonText}>Get Started</CustomText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.primary,
    marginVertical: 20,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: '400',
    fontFamily: 'System',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeImage: {
    width: 300,
    height: 300,
    contentFit: 'contain',
  },
  buttonContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  getStartedButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
});
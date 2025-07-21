import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomText from '@/components/UI/CustomText';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Verification', { email });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(600)} style={styles.headerContainer}>
            <Image
              source={require('@/assets/adventure_map.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <CustomText style={styles.title}>Welcome Back</CustomText>
            <CustomText style={styles.subtitle}>Sign in to continue your journey</CustomText>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.contentContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.lightGray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.lightGray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={colors.darkGray} 
                />
              </TouchableOpacity>
            </View>
            
            <Animated.View entering={FadeIn.duration(600).delay(400)}>
              <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <CustomText style={styles.buttonText}>Sign In</CustomText>
                    <Ionicons name="arrow-forward" size={20} color={colors.white} style={styles.buttonIcon} />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View entering={FadeIn.duration(600).delay(600)} style={styles.socialContainer}>
              <CustomText style={styles.orText}>or continue with</CustomText>
              
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image 
                    source={require('@/assets/google.svg')} 
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.socialButton}>
                  <Image 
                    source={require('@/assets/facebook.svg')} 
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.socialButton}>
                  <Image 
                    source={require('@/assets/apple.svg')} 
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            <Animated.View entering={FadeIn.duration(600).delay(800)} style={styles.signupContainer}>
              <CustomText style={styles.signupText}>Don't have an account? </CustomText>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <CustomText style={styles.signupLink}>Sign up</CustomText>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: '80%',
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.darkGray, // Darker text for contrast
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Light gray for input fields
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.darkGray,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    height: 60,
    marginVertical: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  socialContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  orText: {
    fontSize: 14,
    color: colors.darkGray,
    opacity: 0.6,
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f8f9fa', // Light gray for social buttons
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  socialIcon: {
    width: 28,
    height: 28,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 15,
    color: colors.darkGray,
    opacity: 0.8,
  },
  signupLink: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
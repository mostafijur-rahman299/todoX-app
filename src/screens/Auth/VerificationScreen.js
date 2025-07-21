import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/UI/CustomText';
import { colors } from '@/constants/Colors';
import { useAuth } from '../../context/AuthContext';

const VerificationScreen = ({ route, navigation }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const { login } = useAuth();
  
  // Get email from route params or use a default
  const email = route?.params?.email || 'user@example.com';

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleCodeChange = (text, index) => {
    if (text.length <= 1) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      // Move to next input if current input is filled
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    if (isResendActive) {
      setCode(['', '', '', '', '', '']);
      setTimer(30);
      setIsResendActive(false);
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) {
      setIsVerifying(true);
      try {
        // In a real app, you would verify the code with your backend
        // For demo purposes, we'll simulate a delay and then log in
        setTimeout(async () => {
          await login();
          // No need to navigate as the AppNavigator will handle this
        }, 1000);
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          
          <CustomText style={styles.title}>Almost there</CustomText>
          <CustomText style={styles.subtitle}>
            Please enter the 6-digit code sent to your{"\n"}
            email {email} for verification.
          </CustomText>
          
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
          
          <CustomText style={styles.timerText}>
            Request new code in {formatTime(timer)}s
          </CustomText>
          
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <CustomText style={styles.verifyButtonText}>Verify</CustomText>
            )}
          </TouchableOpacity>
          
          <View style={styles.resendContainer}>
            <CustomText style={styles.resendText}>Didn't receive any code? </CustomText>
            <TouchableOpacity onPress={handleResend} disabled={!isResendActive}>
              <CustomText 
                style={[styles.resendLink, !isResendActive && styles.resendLinkDisabled]}
              >
                Resend Again
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 40,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.darkGray,
  },
  timerText: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 40,
  },
  verifyButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
});

export default VerificationScreen;
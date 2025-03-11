import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@/components/UI/CustomText';
import { Image } from 'expo-image';
import CustomButton from '@/components/UI/CustomButton';

const StartScreen = () => {
  return (
    <View style={styles.container}>
      
      {/* Top Title */}
      <CustomText style={styles.title}>Let’s Get Things Done!</CustomText>

      {/* Gif */}
      <Image source={require('@/assets/start-screen.gif')} style={styles.gif} />

      {/* Bottom Title */}
      <CustomText style={styles.logoTitle}>TodoX</CustomText>

      {/* Bottom Text */}
      <CustomText style={styles.logoSubtitle}>
        Simplify Tasks, Amplify Life
      </CustomText>

      {/* Button */}
      <CustomButton 
        title="Continue as Guest" 
        onPress={() => {}} 
        style={styles.guestButton} 
        textStyle={styles.guestButtonText}
      />

    </View>
  );
};

export default StartScreen;


const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      padding: 20
    },
    title: {
        fontSize: 24,
        color: '#FF3951',
        textAlign: 'center',
        marginTop: 20,
    },
    gif: {
        width: 350,
        height: 350,
        alignSelf: 'center',
        marginTop: 40,
    },
    logoTitle: {
        fontSize: 48,
        color: '#FF3951',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'NicoMoji-Regular',
    },
    logoSubtitle: {
        fontSize: 16,
        color: 'grey',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'NicoMoji-Regular',
    },
    guestButton: {
        marginTop: 50,
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center',
    },
    guestButtonText: {
        color: '#fff',
        fontSize: 20,
    }
  });

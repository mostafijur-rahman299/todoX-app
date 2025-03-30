import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/constants/Colors';
import { useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const BuyMeCoffee = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleDonation = (amount) => {
    // Replace with your actual donation link
    const donationUrl = `https://www.buymeacoffee.com/yourusername?amount=${amount}`;
    Linking.openURL(donationUrl);
  };

  const handleCustomLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <LinearGradient
          colors={[colors.primary, '#8a56ff']}
          style={styles.iconBackground}
        >
          <Icon name="coffee" size={60} color="#fff" />
        </LinearGradient>
        <Text style={styles.title}>Support This Project</Text>
        <Text style={styles.subtitle}>
          If you enjoy using this app, consider buying me a coffee!
        </Text>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.description}>
          This app is completely free and open source. Your support helps me continue 
          developing and maintaining it. Choose an amount below or visit my page for more options.
        </Text>

        <View style={styles.donationContainer}>
          <TouchableOpacity 
            style={styles.donationButton} 
            onPress={() => handleDonation(3)}
            activeOpacity={0.7}
          >
            <Icon name="coffee-outline" size={24} color={colors.darkGray} style={styles.coffeeIcon} />
            <Text style={styles.donationAmount}>$3</Text>
            <Text style={styles.donationText}>Small Coffee</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.donationButton, styles.primaryButton]} 
            onPress={() => handleDonation(5)}
            activeOpacity={0.7}
          >
            <Icon name="coffee" size={28} color="#fff" style={styles.coffeeIcon} />
            <Text style={[styles.donationAmount, styles.primaryText]}>$5</Text>
            <Text style={[styles.donationText, styles.primaryText]}>Regular Coffee</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.donationButton} 
            onPress={() => handleDonation(10)}
            activeOpacity={0.7}
          >
            <Icon name="coffee-to-go" size={24} color={colors.darkGray} style={styles.coffeeIcon} />
            <Text style={styles.donationAmount}>$10</Text>
            <Text style={styles.donationText}>Large Coffee</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.visitButton}
          onPress={() => handleCustomLink('https://www.buymeacoffee.com/yourusername')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, '#8a56ff']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="web" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.visitButtonText}>Visit My Page</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.otherWaysContainer}>
          <Text style={styles.otherWaysTitle}>Other Ways to Support</Text>
          
          <TouchableOpacity 
            style={styles.otherWayButton}
            onPress={() => handleCustomLink('https://github.com/yourusername/repo')}
          >
            <View style={styles.otherWayIconContainer}>
              <Icon name="github" size={24} color="#fff" />
            </View>
            <View style={styles.otherWayTextContainer}>
              <Text style={styles.otherWayText}>Star on GitHub</Text>
              <Text style={styles.otherWaySubtext}>Support open source development</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.lightGray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.otherWayButton}
            onPress={() => handleCustomLink('https://twitter.com/yourusername')}
          >
            <View style={[styles.otherWayIconContainer, { backgroundColor: '#1DA1F2' }]}>
              <Icon name="twitter" size={24} color="#fff" />
            </View>
            <View style={styles.otherWayTextContainer}>
              <Text style={styles.otherWayText}>Follow on Twitter</Text>
              <Text style={styles.otherWaySubtext}>Stay updated with latest news</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.lightGray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.otherWayButton}
            onPress={() => handleCustomLink('mailto:your@email.com')}
          >
            <View style={[styles.otherWayIconContainer, { backgroundColor: '#EA4335' }]}>
              <Icon name="email" size={24} color="#fff" />
            </View>
            <View style={styles.otherWayTextContainer}>
              <Text style={styles.otherWayText}>Send Feedback</Text>
              <Text style={styles.otherWaySubtext}>Help improve the app</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.lightGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.thankYouContainer}>
          <LinearGradient
            colors={['#ff9a9e', '#fad0c4']}
            style={styles.thankYouGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="heart" size={24} color="#fff" style={styles.heartIcon} />
            <Text style={styles.thankYouText}>
              Thank you for your support!
            </Text>
          </LinearGradient>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightGray,
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  donationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  donationButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coffeeIcon: {
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.05 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  donationAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 5,
  },
  donationText: {
    fontSize: 12,
    color: colors.darkGray,
  },
  primaryText: {
    color: '#fff',
  },
  visitButton: {
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  visitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otherWaysContainer: {
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  otherWaysTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 15,
  },
  otherWayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  otherWayIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  otherWayTextContainer: {
    flex: 1,
  },
  otherWayText: {
    fontSize: 16,
    color: colors.darkGray,
    fontWeight: '600',
  },
  otherWaySubtext: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: 2,
  },
  thankYouContainer: {
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ff9a9e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  thankYouGradient: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heartIcon: {
    marginRight: 10,
  },
  thankYouText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BuyMeCoffee;

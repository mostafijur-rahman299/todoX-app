import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/Colors';
import CustomText from '@/components/UI/CustomText';
import CustomButton from '@/components/UI/CustomButton';

/**
 * Enhanced Feedback screen with modern UI/UX design
 * Features improved animations, better support options, and enhanced accessibility
 */
const Feedback = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Send us an email for detailed assistance',
      icon: 'mail',
      color: colors.primary,
      onPress: () => Linking.openURL('mailto:support@todox.com?subject=TodoX Support Request')
    },
    {
      title: 'Bug Report',
      description: 'Report bugs or technical issues',
      icon: 'bug',
      color: colors.error,
      onPress: () => Linking.openURL('mailto:support@todox.com?subject=TodoX Bug Report')
    },
    {
      title: 'Feature Request',
      description: 'Suggest new features or improvements',
      icon: 'bulb',
      color: colors.warning,
      onPress: () => Linking.openURL('mailto:support@todox.com?subject=TodoX Feature Request')
    },
    {
      title: 'Rate the App',
      description: 'Leave a review on the App Store',
      icon: 'star',
      color: colors.success,
      onPress: () => {
        const url = Platform.OS === 'ios' 
          ? 'https://apps.apple.com/app/id123456789' 
          : 'https://play.google.com/store/apps/details?id=com.todox';
        Linking.openURL(url);
      }
    }
  ];

  /**
   * Renders individual support option card
   */
  const SupportCard = ({ title, description, icon, color, onPress, index }) => (
    <Animated.View 
      style={[
        styles.card,
        { 
          opacity: fadeAnim,
          transform: [{ 
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, index * 10]
            })
          }] 
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.cardTouchable} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[colors.surface, colors.surfaceVariant]}
          style={styles.cardGradient}
        >
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View style={styles.cardContent}>
            <CustomText variant="h6" weight="semibold" color="textPrimary">
              {title}
            </CustomText>
            <CustomText variant="bodySmall" color="textSecondary" style={styles.cardDescription}>
              {description}
            </CustomText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <LinearGradient
            colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
            style={styles.headerGradient}
          >
            <View style={styles.headerIconContainer}>
              <Ionicons name="help-circle" size={48} color={colors.surface} />
            </View>
            <CustomText variant="h2" weight="bold" color="surface" style={styles.headerTitle}>
              Help & Support
            </CustomText>
            <CustomText variant="body" color="surface" style={styles.headerSubtitle}>
              We're here to help you get the most out of TodoX
            </CustomText>
          </LinearGradient>
        </Animated.View>

        {/* Support Options */}
        <View style={styles.cardsContainer}>
          {supportOptions.map((option, index) => (
            <SupportCard key={index} {...option} index={index} />
          ))}
        </View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.quickActions,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <CustomText variant="h5" weight="semibold" color="textPrimary" style={styles.sectionTitle}>
            Quick Actions
          </CustomText>
          
          <View style={styles.actionButtons}>
            <CustomButton
              title="FAQ"
              onPress={() => Linking.openURL('https://todox.com/faq')}
              variant="outline"
              size="medium"
              icon="help-circle-outline"
              style={styles.actionButton}
            />
            <CustomButton
              title="User Guide"
              onPress={() => Linking.openURL('https://todox.com/guide')}
              variant="outline"
              size="medium"
              icon="book-outline"
              style={styles.actionButton}
            />
          </View>
        </Animated.View>

        {/* Contact Information */}
        <Animated.View 
          style={[
            styles.contactInfo,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <LinearGradient
            colors={[colors.surface, colors.surfaceVariant]}
            style={styles.contactGradient}
          >
            <CustomText variant="h6" weight="semibold" color="textPrimary" style={styles.contactTitle}>
              Contact Information
            </CustomText>
            
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <CustomText variant="bodySmall" color="textSecondary" style={styles.contactText}>
                Response Time: Within 24 hours
              </CustomText>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <CustomText variant="bodySmall" color="textSecondary" style={styles.contactText}>
                Support Hours: Monday - Friday, 9AM - 6PM EST
              </CustomText>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="globe-outline" size={20} color={colors.primary} />
              <CustomText variant="bodySmall" color="textSecondary" style={styles.contactText}>
                Website: www.todox.com
              </CustomText>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* App Information */}
        <Animated.View 
          style={[
            styles.appInfo,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <CustomText variant="caption" color="textTertiary" style={styles.appInfoText}>
            TodoX v1.0.0 • Made with ❤️ for productivity
          </CustomText>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  headerIconContainer: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    textAlign: 'center',
    opacity: 0.9,
  },
  cardsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  cardTouchable: {
    flex: 1,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardDescription: {
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  quickActions: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  contactInfo: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  contactGradient: {
    padding: spacing.lg,
  },
  contactTitle: {
    marginBottom: spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contactText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  appInfoText: {
    textAlign: 'center',
  },
});

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/constants/Colors';

/**
 * Header component for the Timeline screen
 */
const TimelineHeader = ({ 
  filteredEventsCount, 
  filterBy, 
  showMenu, 
  setShowMenu,
  viewMode 
}) => {
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    return () => {
      headerOpacity.stopAnimation();
    };
  }, [headerOpacity]);

  return (
    <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Timeline</Text>
          <Text style={styles.headerSubtitle}>
            {filteredEventsCount} {filteredEventsCount === 1 ? 'event' : 'events'} 
            {filterBy !== 'all' && ` (${filterBy} priority)`}
            {viewMode && ` • ${viewMode} view`}
          </Text>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(!showMenu)}
            activeOpacity={0.7}
          >
            <View style={styles.menuButtonInner}>
              <Ionicons name="ellipsis-vertical" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = {
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize['lg'],
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

export default TimelineHeader;
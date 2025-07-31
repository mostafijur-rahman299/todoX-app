import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Menu dropdown component for upcoming screen actions and filters
 */
const UpcomingMenuDropdown = ({ 
  showMenu, 
  filterBy, 
  isRefreshing,
  onEnterSelectionMode,
  onRefreshTasks,
  onFilterChange,
  onClose
}) => {
  const menuOpacity = useRef(new Animated.Value(0)).current;

  /**
   * Animate menu visibility
   */
  useEffect(() => {
    Animated.timing(menuOpacity, {
      toValue: showMenu ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [showMenu, menuOpacity]);

  /**
   * Handle outside click to close menu
   */
  const handleOutsideClick = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!showMenu) return null;

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <Animated.View style={[styles.menuDropdown, { opacity: menuOpacity }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onEnterSelectionMode}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.menuItemText}>Select Tasks</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onRefreshTasks}
              activeOpacity={0.7}
              disabled={isRefreshing}
            >
              <Ionicons 
                name={isRefreshing ? "sync" : "refresh-outline"} 
                size={18} 
                color={isRefreshing ? colors.textTertiary : colors.success} 
              />
              <Text style={[styles.menuItemText, isRefreshing && styles.disabledText]}>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Text>
            </TouchableOpacity>

            <View style={styles.menuSeparator} />

            <Text style={styles.menuSectionTitle}>Filter by Priority</Text>
            
            <TouchableOpacity
              style={[styles.menuItem, filterBy === 'all' && styles.activeMenuItem]}
              onPress={() => onFilterChange('all')}
              activeOpacity={0.7}
            >
              <Ionicons name="list-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>All Tasks</Text>
              {filterBy === 'all' && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuItem, filterBy === 'high' && styles.activeMenuItem]}
              onPress={() => onFilterChange('high')}
              activeOpacity={0.7}
            >
              <View style={[styles.priorityDot, { backgroundColor: colors.error }]} />
              <Text style={styles.menuItemText}>High Priority</Text>
              {filterBy === 'high' && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuItem, filterBy === 'medium' && styles.activeMenuItem]}
              onPress={() => onFilterChange('medium')}
              activeOpacity={0.7}
            >
              <View style={[styles.priorityDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.menuItemText}>Medium Priority</Text>
              {filterBy === 'medium' && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuItem, filterBy === 'low' && styles.activeMenuItem]}
              onPress={() => onFilterChange('low')}
              activeOpacity={0.7}
            >
              <View style={[styles.priorityDot, { backgroundColor: colors.success }]} />
              <Text style={styles.menuItemText}>Low Priority</Text>
              {filterBy === 'low' && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  menuDropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  activeMenuItem: {
    backgroundColor: colors.primary + '10',
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  disabledText: {
    color: colors.textTertiary,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
};

export default UpcomingMenuDropdown;
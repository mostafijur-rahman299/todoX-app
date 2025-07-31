import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/constants/Colors';

/**
 * Header component for the Inbox screen
 */
const InboxHeader = ({ 
  filteredTasksCount, 
  filterBy, 
  showMenu, 
  setShowMenu,
  isSelectionMode,
  selectedTaskIds,
  onExitSelectionMode,
  onBulkComplete 
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

  /**
   * Render selection mode header
   */
  const renderSelectionHeader = () => (
    <View style={styles.selectionHeader}>
      <TouchableOpacity
        style={styles.selectionButton}
        onPress={onExitSelectionMode}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      <Text style={styles.selectionTitle}>
        {selectedTaskIds.length} selected
      </Text>
      
      {selectedTaskIds.length > 0 && (
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={onBulkComplete}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-done" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * Render normal header
   */
  const renderNormalHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTasksCount} {filteredTasksCount === 1 ? 'task' : 'tasks'} 
          {filterBy !== 'all' && ` (${filterBy} priority)`}
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
  );

  return (
    <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
      {isSelectionMode ? renderSelectionHeader() : renderNormalHeader()}
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
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    minWidth: 40,
    alignItems: 'center',
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
};

export default InboxHeader;
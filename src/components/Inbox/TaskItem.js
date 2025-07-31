import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

/**
 * Individual task item component
 */
const TaskItem = React.memo(({ 
  item, 
  index, 
  onToggleComplete, 
  onTaskPress, 
  getPriorityColor, 
  isSelectionMode = false, 
  isSelected = false 
}) => {
  const itemAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      easing: Easing.out(Easing.bezier(0.25, 0.46, 0.45, 0.94)),
      useNativeDriver: true,
    }).start();
  }, [itemAnim, index]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 400,
        friction: 10,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 400,
        friction: 10,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Med';
      case 'low':
        return 'Low';
      default:
        return '';
    }
  };

  const getTaskTag = () => {
    if (item.category && item.category !== 'inbox') {
      return item.category;
    }
    if (item.priority) {
      return item.priority;
    }
    return 'task';
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'high':
        return [colors.error + '80', colors.error + '20'];
      case 'medium':
        return [colors.warning + '80', colors.warning + '20'];
      case 'low':
        return [colors.success + '80', colors.success + '20'];
      default:
        return [colors.textTertiary + '40', colors.textTertiary + '10'];
    }
  };

  const animatedShadowStyle = {
    shadowOpacity: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.06, 0.15],
    }),
    elevation: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 8],
    }),
  };

  return (
    <Animated.View
      style={[
        styles.taskItemContainer,
        {
          opacity: itemAnim,
          transform: [
            {
              translateY: itemAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Animated.View style={[
        styles.taskItem, 
        animatedShadowStyle,
        isSelected && styles.selectedTaskItem
      ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onTaskPress(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ flex: 1 }}
        >
          <View style={styles.taskContent}>
            {isSelectionMode ? (
              <TouchableOpacity
                style={styles.selectionCheckbox}
                onPress={() => onTaskPress(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.selectionCheckboxInner, isSelected && styles.selectedCheckbox]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => onToggleComplete(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkboxInner, item.is_completed && styles.checkedBox]}>
                  {item.is_completed && <Ionicons name="checkmark" size={14} color={colors.white} />}
                </View>
              </TouchableOpacity>
            )}
            
            <View style={styles.taskDetails}>
              <Text
                style={[styles.taskTitle, item.is_completed && styles.completedText]}
              >
                {item.title}
              </Text>
              <View style={styles.taskMeta}>
                <Text style={styles.taskDate}>
                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year:
                      new Date(item.timestamp).getFullYear() !== new Date().getFullYear()
                        ? 'numeric'
                        : undefined,
                  })}
                </Text>
                <View style={styles.taskTag}>
                  <Text style={styles.taskTagText}>{getTaskTag()}</Text>
                </View>
              </View>
            </View>
            <View style={styles.prioritySection}>
              <View
                style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]}
              />
              {item.priority && (
                <Text style={[styles.priorityLabel, { color: getPriorityColor(item.priority) }]}>
                  {getPriorityLabel(item.priority)}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
});

const styles = {
  taskItemContainer: {
    marginHorizontal: 20,
  },
  taskItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedTaskItem: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  taskItemGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  checkbox: {
    padding: 4,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  selectionCheckbox: {
    padding: 4,
  },
  selectionCheckboxInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  taskTag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  taskTagText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  prioritySection: {
    alignItems: 'center',
    gap: 4,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskSeparator: {
    height: 1,
    backgroundColor: colors.border + '30',
    marginHorizontal: 20,
  },
};

export default TaskItem;
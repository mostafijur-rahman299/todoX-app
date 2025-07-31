import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/Colors';
import { getDate } from './TimelineConstants';

/**
 * Enhanced custom render function for day with priority indicators
 */
const TimelineCalendarDay = ({ date, item }) => {
  const day = date.day;
  const eventCount = item.eventCount || 0;
  const isSelected = item.selected || false;
  const isToday = date.dateString === getDate();
  const hasHighPriority = item.hasHighPriority || false;

  return (
    <View style={styles.dayContainer}>
      <View style={[
        styles.dayWrapper,
        isSelected && styles.selectedDayWrapper,
        isToday && styles.todayWrapper,
        hasHighPriority && styles.highPriorityDayWrapper,
      ]}>
        <Text
          style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isToday && styles.todayText,
          ]}
        >
          {day}
        </Text>
        
        {/* Event count indicator with modern design */}
        {eventCount > 0 && (
          <View style={[
            styles.eventCountContainer,
            hasHighPriority && styles.highPriorityIndicator,
            isSelected && styles.selectedEventCount,
          ]}>
            <Text style={[
              styles.eventCountText,
              isSelected && styles.selectedEventCountText,
            ]}>
              {eventCount}
            </Text>
          </View>
        )}
      </View>
      
      {/* Priority indicator dot */}
      {hasHighPriority && (
        <View style={[
          styles.priorityDot,
          isSelected && styles.selectedPriorityDot,
        ]} />
      )}
    </View>
  );
};

const styles = {
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  selectedDayText: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  todayText: {
    color: colors.primary,
    fontWeight: '600',
  },
  eventCountContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedEventCount: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#4ECDC4',
  },
  highPriorityIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  eventCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  selectedEventCountText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '900',
  },
  priorityDot: {
    position: 'absolute',
    bottom: 3,
    alignSelf: 'center',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPriorityDot: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
};

export default TimelineCalendarDay;
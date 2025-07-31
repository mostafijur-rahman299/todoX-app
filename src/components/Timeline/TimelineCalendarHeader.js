import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/constants/Colors';

/**
 * Custom calendar header component with toggle functionality
 */
const TimelineCalendarHeader = ({ date, onToggle }) => {
  return (
    <View style={styles.calendarHeaderContainer}>
      <TouchableOpacity
        style={styles.calendarHeader}
        onPress={onToggle}
        activeOpacity={0.9}
      >
        <Text style={styles.calendarHeaderTitle}>
          {date?.toString("MMMM yyyy")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  calendarHeaderContainer: {
    // backgroundColor: colors.surface,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  calendarHeaderTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
};

export default TimelineCalendarHeader;
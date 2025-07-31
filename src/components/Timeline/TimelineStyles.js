import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '@/constants/Colors';

export const timelineStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize["xl"],
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  calendar: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  calendarStyle: {
    backgroundColor: colors.background,
  },
  calendarHeader: {
    backgroundColor: colors.background,
  },
  timelineContainer: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden', // Prevent overflow
  },
  timeline: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    elevation: 8,
  },
  todayButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textAlign: "center",
    color: 'white'
  },
});

/**
 * Timeline theme configuration for ultra-premium design
 */
export const getTimelineTheme = (colors) => ({
  timelineContainer: {
    flex: 1,
    marginBottom: 79, // Reduced from 90 to prevent overflow
    overflow: 'hidden',
  },
  event: {
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 5,
    marginRight: 5, // Added right margin to prevent edge overflow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  timeLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  verticalLine: {
    width: 2,
    backgroundColor: '#CBD5E0',
    borderRadius: 2,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  nowIndicatorLine: {
    backgroundColor: colors.primary,
    width: 3,
    borderRadius: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  nowIndicatorKnob: {
    backgroundColor: colors.primary,
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  // Ultra-premium timeline text styling
  eventTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  eventSummary: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  eventText: {
   paddingHorizontal: 10,
   paddingVertical: 5
  },
});

/**
 * Premium calendar theme for professional design
 */
export const getCalendarTheme = (colors) => ({
  backgroundColor: colors.background,
  calendarBackground: colors.background,
  textSectionTitleColor: colors.textSecondary,
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.white,
  todayTextColor: colors.primary,
  dayTextColor: colors.textPrimary,
  textDisabledColor: colors.textTertiary,
  dotColor: colors.primary,
  selectedDotColor: colors.white,
  arrowColor: colors.primary,
  monthTextColor: colors.textPrimary,
  indicatorColor: colors.primary,
  textDayFontFamily: 'System',
  textMonthFontFamily: 'System',
  textDayHeaderFontFamily: 'System',
  textDayFontWeight: '600',
  textMonthFontWeight: '700',
  textDayHeaderFontWeight: '600',
  textDayFontSize: 16,
  textMonthFontSize: 20,
  textDayHeaderFontSize: 13,
  agendaDayTextColor: colors.textPrimary,
  agendaDayNumColor: colors.textSecondary,
  agendaTodayColor: colors.primary,
  agendaKnobColor: colors.primary,
  // Modern calendar styling
  'stylesheet.calendar.header': {
    week: {
      marginTop: 5,
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginHorizontal: 16,
      paddingVertical: 8,
    },
  },
});
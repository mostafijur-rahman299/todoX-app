import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '@/constants/Colors';

export const timelineStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingBottom: 2,
  },
  headerWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },
  timelineContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  todayButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    textAlign: "center",
    color: 'white'
  },
});

/**
 * Timeline theme configuration for ultra-premium design
 */
export const getTimelineTheme = (colors) => ({
  timelineContainer: {
    marginBottom: 78,
  },
  event: {
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  timeLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    paddingVertical: 2,
    borderRadius: 5,
    marginVertical: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  verticalLine: {
    display: 'none'
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
 * Calendar theme configuration
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
			textDayFontSize: 14,
			textMonthFontSize: 14,
			textDayHeaderFontSize: 13,
			agendaDayTextColor: colors.textPrimary,
			agendaDayNumColor: colors.textSecondary,
			agendaTodayColor: colors.primary,
			agendaKnobColor: colors.primary,
			// Modern calendar styling
			'stylesheet.calendar.header': {
				week: {
					marginTop: 3,
					flexDirection: 'row',
					justifyContent: 'space-around',
					backgroundColor: colors.surface,
					borderRadius: 5,
					marginHorizontal: 2,
					paddingVertical:2,
				},
				
			},
})
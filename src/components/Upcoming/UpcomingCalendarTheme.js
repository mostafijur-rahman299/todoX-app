import { useMemo } from 'react';
import { colors } from '@/constants/Colors';

/**
 * Custom hook to provide calendar theme configuration for the Upcoming screen
 */
export const useUpcomingCalendarTheme = () => {
	const calendarTheme = useMemo(
		() => ({
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
		}),
		[]
	);

	return calendarTheme;
};
import { colors } from "@/constants/Colors";

export const priorityOptions = [
	{
		label: "High Priority",
		value: "high",
		color: colors.error,
		icon: "flag",
		gradient: ["#FF6B6B", "#FF5252"],
	},
	{
		label: "Medium Priority",
		value: "medium",
		color: colors.warning,
		icon: "flag",
		gradient: ["#FFB74D", "#FF9800"],
	},
	{
		label: "Low Priority",
		value: "low",
		color: colors.success,
		icon: "flag",
		gradient: ["#81C784", "#4CAF50"],
	},
];

export const inboxOptions = [
	{
		label: "Inbox",
		value: "Inbox",
		icon: "mail-outline",
		color: colors.primary,
		gradient: ["#6366F1", "#4F46E5"],
	},
	{
		label: "Work",
		value: "Work",
		icon: "briefcase-outline",
		color: colors.info,
		gradient: ["#06B6D4", "#0891B2"],
	},
	{
		label: "Personal",
		value: "Personal",
		icon: "person-outline",
		color: colors.success,
		gradient: ["#10B981", "#059669"],
	},
	{
		label: "Shopping",
		value: "Shopping",
		icon: "bag-outline",
		color: colors.warning,
		gradient: ["#F59E0B", "#D97706"],
	},
	{
		label: "Health",
		value: "Health",
		icon: "fitness-outline",
		color: colors.error,
		gradient: ["#EF4444", "#DC2626"],
	},
];

// Add reminder options
export const reminderOptions = [
	{
		id: 1,
		name: "5 minutes before",
		value: 5,
		unit: "minutes",
	},
	{
		id: 2,
		name: "15 minutes before",
		value: 15,
		unit: "minutes",
	},
	{
		id: 3,
		name: "30 minutes before",
		value: 30,
		unit: "minutes",
	},
	{
		id: 4,
		name: "1 hour before",
		value: 1,
		unit: "hours",
	},
	{
		id: 5,
		name: "1 day before",
		value: 1,
		unit: "days",
	},
];

// Add quick action buttons
export const quickActions = [
	{
		id: 1,
		name: "Today",
		icon: "today",
		color: "#22c55e",
		action: "setToday",
	},
	{
		id: 2,
		name: "Priority",
		icon: "flag",
		color: "#ef4444",
		action: "setPriority",
	},
	{
		id: 3,
		name: "Reminders",
		icon: "notifications",
		color: "#3b82f6",
		action: "setReminder",
	},
];

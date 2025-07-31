import { getFutureDates, getPastDate } from "@/utils/gnFunc";

/**
 * Generate dates for the upcoming calendar
 */
const today = new Date().toISOString().split("T")[0];
const pastDate = getPastDate(3);
const futureDates = getFutureDates(12);
export const dates = [pastDate, today, ...futureDates];

/**
 * Sample agenda items data for the upcoming calendar
 */
export const agendaItems = [
	{
		title: dates[0],
		data: [
			{
				is_completed: false,
				priority: "low",
				category: "inbox",
				title: "Long Yoga",
				itemCustomHeightType: "LongEvent",
				time: "10:00 Pm"
			},
		],
	},
	{
		title: dates[1],
		data: [
			{
				is_completed: false,
				priority: "low",
				category: "inbox",
				title: "Pilates ABC",
				time: "11:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Vinyasa Yoga",
				time: "12:00 Pm"
			},
		],
	},
	{
		title: dates[2],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
				time: "10:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Deep Stretches",
				time: "11:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Private Yoga",
				time: "12:00 Pm"
			},	
		],
	},
	{
		title: dates[3],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
				time: "09:30 Pm"
			},
		],
	},
	{ title: dates[4], data: [{}] },
	{
		title: dates[5],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Middle Yoga",
				time: "10:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga",
				time: "11:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "TRX",
				time: "12:00 AM"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Running Group",
				time: "12:00 PM"
			},
		],
	},
	{
		title: dates[6],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
				time: "09:30 Pm"
			},
		],
	},
	{ title: dates[7], data: [{}] },
	{
		title: dates[8],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Pilates Reformer",
				time: "10:00 Pm"
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga",
				time: "11:00 Pm"
			}
		],
	},
	{
		title: dates[9],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Deep Stretches",
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Private Yoga",
			},
		],
	},
	{
		title: dates[10],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Last Yoga",
			},
		],
	},
	{
		title: dates[11],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Ashtanga Yoga",
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Deep Stretches",
			},
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Private Yoga",
			},
		],
	},
	{
		title: dates[12],
		data: [
			{
				is_completed: false,
				priority: "high",
				category: "inbox",
				title: "Last Yoga",
			},
		],
	},
	{
		title: dates[13],
		data: [{ is_completed: false, title: "Last Yoga" }],
	},
];
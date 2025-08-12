import isEmpty from "lodash/isEmpty";
import { colors } from "@/constants/Colors";

export const generateId = (length = 16) => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const cryptoObj =
		typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;

	const timestamp = Date.now().toString(36); // base36 timestamp
	const extraTime = (
		typeof performance !== "undefined" ? performance.now() : Math.random()
	)
		.toFixed(4)
		.replace(".", "");

	const idLength = length - timestamp.length - extraTime.length - 2;
	let randomPart = "";

	if (cryptoObj) {
		const bytes = new Uint8Array(idLength);
		crypto.getRandomValues(bytes);
		randomPart = Array.from(bytes)
			.map((b) => chars[b % chars.length])
			.join("");
	} else {
		for (let i = 0; i < idLength; i++) {
			randomPart += chars.charAt(
				Math.floor(Math.random() * chars.length),
			);
		}
	}

	return `${timestamp}-${extraTime}-${randomPart}`;
};

export const randomColor = () => {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export const getPastDate = (numberOfDays) => {
	return new Date(Date.now() - 864e5 * numberOfDays)
		.toISOString()
		.split("T")[0];
};

export const getFutureDates = (numberOfDays) => {
	const array = [];
	for (let index = 1; index <= numberOfDays; index++) {
		let d = Date.now();
		if (index > 8) {
			const newMonth = new Date(d).getMonth() + 1;
			d = new Date(d).setMonth(newMonth);
		}
		const date = new Date(d + 864e5 * index);
		const dateString = date.toISOString().split("T")[0];
		array.push(dateString);
	}
	return array;
};

export const getMarkedDates = (agendaItems) => {
	const marked = {};
	agendaItems.forEach((item) => {
		if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
			marked[item.title] = { marked: true };
		} else {
			marked[item.title] = { disabled: true };
		}
	});
	return marked;
};

export const getPriorityColor = (priority) => {
	switch (priority) {
		case "priority1":
			return colors.error;
		case "priority3":
			return colors.warning;
		case "priority5":
			return colors.info;
		case "priority4":
			return colors.textTertiary;
		case "high":
			return colors.error;
		case "medium":
			return colors.warning;
		case "low":
			return colors.success;
		default:
			return colors.textTertiary;
	}
};

const timeToMinutes = (timeStr) => {
	const [hours, minutes] = timeStr.split(":").map(Number);
	return hours * 60 + minutes;
};

const minutesToTime = (mins) => {
	const hours = String(Math.floor(mins / 60)).padStart(2, "0");
	const minutes = String(mins % 60).padStart(2, "0");
	return `${hours}:${minutes}`;
};

export const getFirstFreeSlot = (task_list) => {
	const DAY_START = 8 * 60; // 8:00 AM
	const DAY_END = 20 * 60; // 8:00 PM
	const DURATION = 30;

	const sortedTasks = task_list
		.filter((t) => t.startTime && t.endTime)
		.map((t) => ({
			start: timeToMinutes(t.startTime),
			end: timeToMinutes(t.endTime),
		}))
		.sort((a, b) => a.start - b.start);

	let currentTime = DAY_START;

	for (let i = 0; i <= sortedTasks.length; i++) {
		const nextStart = sortedTasks[i]?.start ?? DAY_END;

		if (nextStart - currentTime >= DURATION) {
			return {
				startTime: minutesToTime(currentTime),
				endTime: minutesToTime(currentTime + DURATION),
			};
		}

		currentTime = Math.max(currentTime, sortedTasks[i]?.end || currentTime);
	}

	// No available slot, fallback to last 30 mins of the day
	const fallbackStart = DAY_END - DURATION;
	const fallbackEnd = DAY_END;

	return {
		startTime: minutesToTime(fallbackStart),
		endTime: minutesToTime(fallbackEnd),
	};
};

export function taskAgendaFormat(task) {
	return {
		id: task.id,
		is_completed: task.is_completed,
		priority: task.priority,
		category: task.category?.toLowerCase(),
		title: task.title,
		startTime: task.startTime,
		endTime: task.endTime,
		itemCustomHeightType: "LongEvent",
	};
}

export function convertTaskListToAgendaList(tasks) {
	const grouped = tasks.reduce((acc, task) => {
		const taskDate = task.date;
		if (!acc[taskDate]) acc[taskDate] = [];

		acc[taskDate].push(taskAgendaFormat(task));
		return acc;
	}, {});

	return Object.entries(grouped)
		.sort(([a], [b]) => new Date(a) - new Date(b))
		.map(([date, data]) => ({
			title: date,
			data: data.sort((a, b) => {
				if (a.startTime && b.startTime) {
					return a.startTime.localeCompare(b.startTime);
				}
				return 0;
			}),
		}));
}

export function addSingleTaskToAgendaList(agendaList, task) {
	const date = task.date;
	const isExist = agendaList.find((t) => t.title === date);
	if (isExist){
		return agendaList.map((t) => {
			if (t.title === date) {
				t.data.push(taskAgendaFormat(task));
			}
			return t;
		});
	}

	agendaList.push({
		title: date,
		data: [taskAgendaFormat(task)],
	});
	return agendaList;
}

export function updateSingleTaskInAgendaList(agendaList, task) {
	const date = task.date;
	if (!agendaList[date]) agendaList[date] = [];
	const index = agendaList[date].findIndex((t) => t.id === task.id);
	if (index !== -1) {
		agendaList[date][index] = taskAgendaFormat(task);
	}
}

export function deleteSingleTaskFromAgendaList(agendaList, task) {
	const date = task.date;
	if (!agendaList[date]) agendaList[date] = [];
	const index = agendaList[date].findIndex((t) => t.id === task.id);
	if (index !== -1) {
		agendaList[date].splice(index, 1);
	}
}

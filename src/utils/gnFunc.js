import isEmpty from "lodash/isEmpty";
import { colors } from "@/constants/Colors";

export const generateId = (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const cryptoObj = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto : null;

    const timestamp = Date.now().toString(36); // base36 timestamp
    const extraTime = (typeof performance !== 'undefined' ? performance.now() : Math.random()).toFixed(4).replace('.', '');
    
    const idLength = length - timestamp.length - extraTime.length - 2;
    let randomPart = '';

    if (cryptoObj) {
        const bytes = new Uint8Array(idLength);
        crypto.getRandomValues(bytes);
        randomPart = Array.from(bytes).map(b => chars[b % chars.length]).join('');
    } else {
        for (let i = 0; i < idLength; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }

    return `${timestamp}-${extraTime}-${randomPart}`;
};


export const randomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
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


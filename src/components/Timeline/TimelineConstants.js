import { CalendarUtils } from 'react-native-calendars';

const today = new Date();

/**
 * Get date string with optional offset
 */
export const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

export const INITIAL_TIME = { hour: 1, minutes: 0 }; // Start at 1 AM

/**
 * Array of beautiful colors for random event assignment
 */
export const eventColors = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
  '#96CEB4', // Mint Green
  '#FFEAA7', // Warm Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Seafoam
  '#F7DC6F', // Golden Yellow
  '#BB8FCE', // Lavender
  '#85C1E9', // Light Blue
  '#F8C471', // Peach
  '#82E0AA', // Light Green
  '#F1948A', // Salmon
  '#85C1E9', // Powder Blue
  '#D7BDE2', // Light Purple
  '#A9DFBF', // Pale Green
  '#F9E79F', // Light Yellow
  '#AED6F1', // Baby Blue
  '#F5B7B1', // Pink
  '#A3E4D7', // Aqua
];

/**
 * Get a random color from the eventColors array
 */
export const getRandomEventColor = () => {
  return eventColors[Math.floor(Math.random() * eventColors.length)];
};

/**
 * Priority configuration for events
 */
export const priorityConfig = {
  high: { 
    color: '#DC2626', 
    bgColor: '#FEF2F2', 
    accentColor: '#EF4444',
    icon: '⚡', 
    label: 'URGENT',
    gradient: ['#FEF2F2', '#FFFFFF'],
    glowColor: '#DC262620'
  },
  medium: { 
    color: '#D97706', 
    bgColor: '#FFFBEB', 
    accentColor: '#F59E0B',
    icon: '⏰', 
    label: 'NORMAL',
    gradient: ['#FFFBEB', '#FFFFFF'],
    glowColor: '#D9770620'
  },
  low: { 
    color: '#059669', 
    bgColor: '#F0FDF4', 
    accentColor: '#10B981',
    icon: '✓', 
    label: 'LOW',
    gradient: ['#F0FDF4', '#FFFFFF'],
    glowColor: '#05966920'
  }
};

/**
 * Priority emoji mapping
 */
export const priorityEmoji = {
  high: '🔴',
  medium: '🟡',
  low: '🟢'
};

/**
 * Sample timeline events data
 */
export const timelineEvents = [
  {
    start: `${getDate()} 01:00:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Night Shift',
    summary: 'Hi every one this is me from bangladesh so we have todo so many things so be prepare and make happy of people',
    color: '#6366F1', // Indigo
    priority: 'high',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 03:00:00`,
    end: `${getDate()} 04:00:00`,
    title: 'Security Round',
    summary: '3ᵃᵐ - 4ᵃᵐ\n★ Building\nSecurity Check',
    color: '#64748B', // Slate
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  
  // Morning (7 AM - 12 PM)
  {
    start: `${getDate()} 07:00:00`,
    end: `${getDate()} 08:30:00`,
    title: 'Palomorfologia',
    summary: '7ᵃᵐ - 8:30ᵃᵐ\n★ 12\nSzpital Kliniczny im. Heliodora Święcickiego',
    color: '#8B5CF6', // Purple
    priority: 'high',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 09:00:00`,
    end: `${getDate()} 10:30:00`,
    title: 'Dermatologia',
    summary: '9ᵃᵐ - 10:30ᵃᵐ\n★ AULA\nSzpital Kliniczny',
    color: '#10B981', // Emerald
    priority: 'high',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 11:00:00`,
    end: `${getDate()} 12:30:00`,
    title: 'Kardiologia',
    summary: '11ᵃᵐ - 12:30ᵖᵐ\n★ 15\nCentrum Medyczne',
    color: '#F59E0B', // Amber
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  
  // Afternoon (1 PM - 6 PM)
  {
    start: `${getDate()} 13:00:00`,
    end: `${getDate()} 14:30:00`,
    title: 'Neurologia',
    summary: '1ᵖᵐ - 2:30ᵖᵐ\n★ 8\nSzpital Uniwersytecki',
    color: '#3B82F6', // Blue
    priority: 'high',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 15:00:00`,
    end: `${getDate()} 16:30:00`,
    title: 'Pediatria',
    summary: '3ᵖᵐ - 4:30ᵖᵐ\n★ 22\nKlinika Dziecięca',
    color: '#EF4444', // Red
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 17:00:00`,
    end: `${getDate()} 18:00:00`,
    title: 'Consultation',
    summary: '5ᵖᵐ - 6ᵖᵐ\n★ 45\nPrivate Practice',
    color: '#EC4899', // Pink
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  
  // Evening (7 PM - 11 PM)
  {
    start: `${getDate()} 19:00:00`,
    end: `${getDate()} 20:30:00`,
    title: 'Evening Clinic',
    summary: '7ᵖᵐ - 8:30ᵖᵐ\n★ 12\nEvening Shift',
    color: '#F97316', // Orange
    priority: 'medium',
    textColor: '#000000', // Black text
  },
  {
    start: `${getDate()} 21:00:00`,
    end: `${getDate()} 22:30:00`,
    title: 'Emergency Call',
    summary: '9ᵖᵐ - 10:30ᵖᵐ\n★ ER\nEmergency Department',
    color: '#DC2626', // Red
    priority: 'high',
    textColor: '#000000', // Black text
  },
  
  // Late Night (11 PM - 12 AM)
  {
    start: `${getDate()} 23:00:00`,
    end: `${getDate()} 23:59:00`,
    title: 'Night Preparation',
    summary: '11ᵖᵐ - 12ᵃᵐ\n★ Office\nEnd of Day Tasks',
    color: '#475569', // Slate
    priority: 'low',
    textColor: '#000000', // Black text
  },
];
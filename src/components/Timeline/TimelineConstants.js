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



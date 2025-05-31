export const colors = {
    primary: '#0A2540', // Deep blue
    secondary: '#00A2C7', // Vibrant teal
    text: '#333333', // Dark gray for text (main body text)
    background: '#FFFFFF', // White background
    border: '#DDDDDD', // Light gray for general borders

    white: '#FFFFFF',
    black: '#000000',
    gray: '#888888', // Balanced gray
    lightGray: '#EEEEEE', // Very light gray (can be used for dividers)
    darkGray: '#555555', // Darker gray for secondary text

    // Specific colors from TodoList.js
    priorityHigh: '#ef4444',
    priorityMedium: '#f97316',
    priorityLow: '#22c55e', // Note: This is different from 'green' below if that was intentional

    priorityHighBackground: '#fef2f2', // Light red
    priorityMediumBackground: '#fff7ed', // Light orange
    priorityLowBackground: '#f0fdf4', // Light green

    textDarkBlue: '#1e293b',      // For headers, titles
    textMediumGray: '#475569',    // For less prominent text
    textLightGray: '#64748b',     // For hints, disabled-like text, icons
    textPlaceholder: '#94a3b8',   // For placeholder text
    textCompleted: '#94a3b8',     // For completed task text (strikethrough)

    accentBlue: '#6366f1',        // Main accent (buttons, icons)
    accentGreen: '#22c55e',       // Success indicators, icons (distinct from priorityLow if needed)
    accentLightBlue: '#eff6ff',   // Background for active/hover states

    backgroundLight: '#f1f5f9',       // For some button backgrounds, tags
    backgroundUltraLight: '#f8fafc',  // For completed tasks background, gradient parts

    borderColorLight: '#e2e8f0',       // Common border color for elements like inputs
    borderColorUltraLight: '#f1f5f9',  // Softer border, like for task items

    transparentWhite: 'rgba(255,255,255,0.95)', // For quick add bar background
    
    shadow: '#000000', // Already black, use with opacity

    // General semantic colors (can be duplicates if specific shades above are preferred for UI elements)
    red: '#D9534F', // Softer red for general errors (might differ from priorityHigh)
    green: '#5CB85C', // Pleasant green for general success (might differ from priorityLow/accentGreen)
    blue: '#007BFF', // Standard blue
    yellow: '#F0AD4E', // Warm yellow for warnings
    orange: '#ED9121', // Softer orange (might differ from priorityMedium)
    purple: '#540057', // Deep purple
};

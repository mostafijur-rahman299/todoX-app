
export const priorities = [
  {
    id: 1,
    name: "high",
    color: "#FF0000",
    colorLight: "#ff00002b",
  },
  {
    id: 2,
    name: "medium",
    color: "#FFA500",
    colorLight: "#f8b9172b",
  },
  {
    id: 3,
    name: "low",
    color: "#008000",
    colorLight: "#00800038",
  }
]

export const defaultCategories = [
  {
    id: 0,
    name: "all",
    color: "#0000FF"
  },
  {
    id: 1,
    name: "work",
    color: "#0000FF"
  },
  {
    id: 2,
    name: "personal",
    color: "#008000"
  },
  {
    id: 3,
    name: "shopping",
    color: "#FFA500"
  },
  {
    id: 4,
    name: "health",
    color: "#008000"
  },
  {
    id: 5,
    name: "home",
    color: "#0000FF"
  },
  {
    id: 6,
    name: "travel",
    color: "#0000FF"
  },
  {
    id: 7,
    name: "education",
    color: "#0000FF"
  },
  {
    id: 8,
    name: "other",
    color: "#808080"
  }
]

// Add labels/tags data
export const defaultLabels = [
  {
    id: 1,
    name: "urgent",
    color: "#FF0000",
    icon: "flash"
  },
  {
    id: 2,
    name: "important",
    color: "#FFA500",
    icon: "star"
  },
  {
    id: 3,
    name: "meeting",
    color: "#0000FF",
    icon: "people"
  },
  {
    id: 4,
    name: "call",
    color: "#008000",
    icon: "call"
  },
  {
    id: 5,
    name: "email",
    color: "#800080",
    icon: "mail"
  },
  {
    id: 6,
    name: "review",
    color: "#FF69B4",
    icon: "eye"
  }
];

// Add reminder options
export const reminderOptions = [
  {
    id: 1,
    name: "5 minutes before",
    value: 5,
    unit: "minutes"
  },
  {
    id: 2,
    name: "15 minutes before",
    value: 15,
    unit: "minutes"
  },
  {
    id: 3,
    name: "30 minutes before",
    value: 30,
    unit: "minutes"
  },
  {
    id: 4,
    name: "1 hour before",
    value: 1,
    unit: "hours"
  },
  {
    id: 5,
    name: "1 day before",
    value: 1,
    unit: "days"
  }
];

// Add quick action buttons
export const quickActions = [
  {
    id: 1,
    name: "Today",
    icon: "today",
    color: "#22c55e",
    action: "setToday"
  },
  {
    id: 2,
    name: "Priority",
    icon: "flag",
    color: "#ef4444",
    action: "setPriority"
  },
  {
    id: 3,
    name: "Reminders",
    icon: "notifications",
    color: "#3b82f6",
    action: "setReminder"
  }
];

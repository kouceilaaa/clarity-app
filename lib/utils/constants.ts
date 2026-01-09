// ========== APP CONSTANTS ==========

export const APP_CONFIG = {
  NAME: "ClarityWeb",
  DESCRIPTION: "Make any text accessible to everyone",
  URL: "https://clarityweb.app",
  SUPPORT_EMAIL: "support@clarityweb.app",
} as const;

// ========== SIMPLIFICATION CONSTANTS ==========

export const SIMPLIFICATION_CONFIG = {
  MODES: ["simple", "accessible", "summary"] as const,
  MODE_LABELS: {
    simple: "Simple",
    accessible: "Accessible",
    summary: "Summary",
  },
  MODE_DESCRIPTIONS: {
    simple: "Basic vocabulary, very short sentences",
    accessible: "Simplified but not childish",
    summary: "Only the essential points",
  },
  MODE_EXAMPLES: {
    simple: "Like explaining to an 8-year-old",
    accessible: "For everyone",
    summary: "Quick overview",
  },
  MODE_EMOJIS: {
    simple: "🟢",
    accessible: "🟡",
    summary: "🔵",
  },
  MIN_TEXT_LENGTH: 10,
  MAX_TEXT_LENGTH: 50000,
  READING_SPEED_WPM: 200,
} as const;

// ========== THEME CONSTANTS ==========

export const THEME_CONFIG = {
  THEMES: ["normal", "high-contrast", "dark", "cream"] as const,
  THEME_LABELS: {
    normal: "Normal",
    "high-contrast": "High Contrast",
    dark: "Dark Mode",
    cream: "Cream (Dyslexia)",
  },
  DEFAULT_THEME: "normal" as const,
  DEFAULT_FONT_SIZE: 16,
  FONT_SIZE_RANGE: {
    min: 12,
    max: 32,
    step: 2,
  },
  DEFAULT_SPEECH_RATE: 1,
  SPEECH_RATE_RANGE: {
    min: 0.5,
    max: 2,
    step: 0.1,
  },
} as const;

// ========== STORAGE KEYS ==========

export const STORAGE_KEYS = {
  PREFERENCES: "clarityWeb_preferences",
  THEME: "clarityWeb_theme",
  FONT_SIZE: "clarityWeb_fontSize",
  DYSLEXIA_MODE: "clarityWeb_dyslexiaMode",
  SPEECH_RATE: "clarityWeb_speechRate",
  DEFAULT_MODE: "clarityWeb_defaultMode",
} as const;

// ========== API CONFIGURATION ==========

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
} as const;

// ========== QUERY KEYS ==========

export const QUERY_KEYS = {
  HISTORY: "history",
  SIMPLIFICATION: (id: string) => ["simplification", id] as const,
  USER: "user",
  SHARED_LINK: (code: string) => ["sharedLink", code] as const,
} as const;

// ========== FLESCH SCORE RANGES ==========

export const FLESCH_RANGES = {
  VERY_EASY: {
    min: 90,
    max: 100,
    label: "Very Easy",
    age: "7-8 years",
    color: "green",
  },
  EASY: { min: 80, max: 90, label: "Easy", age: "9-10 years", color: "green" },
  FAIRLY_EASY: {
    min: 70,
    max: 80,
    label: "Fairly Easy",
    age: "11-12 years",
    color: "yellow",
  },
  STANDARD: {
    min: 60,
    max: 70,
    label: "Standard",
    age: "13-14 years",
    color: "yellow",
  },
  FAIRLY_DIFFICULT: {
    min: 50,
    max: 60,
    label: "Fairly Difficult",
    age: "15-17 years",
    color: "orange",
  },
  DIFFICULT: {
    min: 30,
    max: 50,
    label: "Difficult",
    age: "18-22 years",
    color: "red",
  },
  VERY_DIFFICULT: {
    min: 0,
    max: 30,
    label: "Very Difficult",
    age: "23+ years",
    color: "red",
  },
} as const;

// ========== ROUTES ==========

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DASHBOARD_ONBOARDING: "/dashboard/onboarding",
  SETTINGS: "/dashboard/settings",
  FAVORITES: "/dashboard/favorites",
  HISTORY: "/dashboard/history",
  SIMPLIFY_TEXT: "/simplify/text",
  SIMPLIFY_URL: "/simplify/url",
  ABOUT: "/about",
  FAQ: "/faq",
  HELP: "/help",
  SHARED: (code: string) => `/shared/${code}`,
} as const;

// ========== SIMPLIFICATION TYPES ==========

/** Available simplification modes */
export type SimplificationMode = "simple" | "accessible" | "summary";

/** Statistics from text simplification */
export interface SimplificationStatistics {
  fleschBefore: number;
  fleschAfter: number;
  wordsCountBefore: number;
  wordsCountAfter: number;
  readingTimeBefore: number;
  readingTimeAfter: number;
  improvement?: number; // Percentage improvement in readability
}

/** Metadata about the simplification process */
export interface SimplificationMetadata {
  model?: string;
  usedAI?: boolean;
  title?: string;
  siteName?: string;
}

/** Complete simplification data record */
export interface SimplificationData {
  id: string;
  originalText: string;
  simplifiedText: string;
  mode: SimplificationMode;
  sourceUrl?: string;
  statistics: SimplificationStatistics;
  isFavorite: boolean;
  createdAt: Date;
  metadata?: SimplificationMetadata;
}

// ========== USER PREFERENCES (localStorage only) ==========

/** User preferences stored in localStorage (NOT in database) */
export interface UserPreferences {
  fontSize: number; // 12-32
  theme: "normal" | "high-contrast" | "dark" | "cream";
  dyslexiaMode: boolean;
  speechRate: number; // 0.5-2
  defaultMode: SimplificationMode;
}

// ========== FILTER TYPES ==========

/** Filters for history list */
export interface HistoryFilters {
  mode: "all" | SimplificationMode;
  dateRange: "today" | "week" | "month" | "all";
  favoritesOnly: boolean;
  search: string;
}

// ========== SHARE LINK ==========

/** Shareable link data */
export interface ShareLink {
  code: string;
  url: string;
  expiresAt: Date | null;
  views: number;
}

// ========== USER TYPES ==========

/** User data (without preferences - stored separately in localStorage) */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========== API RESPONSE TYPES ==========

/** Standard API success response */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/** Standard API error response */
export interface ApiErrorResponse {
  success: false;
  error: string;
}

/** Combined API response type */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

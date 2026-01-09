import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { UserPreferences, SimplificationMode } from "@/lib/types";
import {
  getUserPreferences,
  updatePreferences as updatePreferencesAction,
  resetPreferencesToDefaults,
} from "@/lib/actions/preferences.actions";

// Default preferences
const defaultPreferences: UserPreferences = {
  fontSize: 16,
  theme: "normal",
  dyslexiaMode: false,
  speechRate: 1,
  defaultMode: "accessible" as SimplificationMode,
};

// State interface with loading/error
interface PreferencesState {
  preferences: UserPreferences;
  defaultMode: SimplificationMode;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  isHydrated: boolean;
}

// Initial state
const initialState: PreferencesState = {
  preferences: { ...defaultPreferences },
  defaultMode: "accessible" as SimplificationMode,
  isLoading: false,
  isSyncing: false,
  error: null,
  isHydrated: false,
};

// Async thunk to fetch preferences from MongoDB
export const fetchPreferences = createAsyncThunk(
  "preferences/fetch",
  async (_, { rejectWithValue }) => {
    const result = await getUserPreferences();
    if (!result.success || !result.data) {
      return rejectWithValue(result.error ?? "Failed to fetch preferences");
    }
    return result.data;
  }
);

// Async thunk to sync preferences to MongoDB
export const syncPreferences = createAsyncThunk(
  "preferences/sync",
  async (updates: Partial<UserPreferences>, { rejectWithValue }) => {
    const result = await updatePreferencesAction(updates);
    if (!result.success || !result.data) {
      return rejectWithValue(result.error ?? "Failed to sync preferences");
    }
    return result.data;
  }
);

// Async thunk to reset preferences
export const resetPreferencesThunk = createAsyncThunk(
  "preferences/reset",
  async (_, { rejectWithValue }) => {
    const result = await resetPreferencesToDefaults();
    if (!result.success || !result.data) {
      return rejectWithValue(result.error ?? "Failed to reset preferences");
    }
    return result.data;
  }
);

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    // Local updates (optimistic - will be synced via thunk)
    setFontSize: (state, action: PayloadAction<number>) => {
      state.preferences.fontSize = action.payload;
    },
    setTheme: (state, action: PayloadAction<UserPreferences["theme"]>) => {
      state.preferences.theme = action.payload;
    },
    toggleDyslexiaMode: (state) => {
      state.preferences.dyslexiaMode = !state.preferences.dyslexiaMode;
    },
    setDyslexiaMode: (state, action: PayloadAction<boolean>) => {
      state.preferences.dyslexiaMode = action.payload;
    },
    setSpeechRate: (state, action: PayloadAction<number>) => {
      state.preferences.speechRate = action.payload;
    },
    setDefaultMode: (state, action: PayloadAction<SimplificationMode>) => {
      state.preferences.defaultMode = action.payload;
      state.defaultMode = action.payload;
    },
    resetPreferences: (state) => {
      state.preferences = { ...defaultPreferences };
    },
    clearError: (state) => {
      state.error = null;
    },
    // For local-only updates (when not logged in)
    setPreferencesLocal: (
      state,
      action: PayloadAction<Partial<UserPreferences>>
    ) => {
      Object.assign(state.preferences, action.payload);
    },
    hydratePreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    // Fetch preferences
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload;
        state.defaultMode = action.payload.defaultMode;
        state.isHydrated = true;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isHydrated = true;
      });

    // Sync preferences
    builder
      .addCase(syncPreferences.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncPreferences.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.preferences = action.payload;
        state.defaultMode = action.payload.defaultMode;
      })
      .addCase(syncPreferences.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });

    // Reset preferences
    builder
      .addCase(resetPreferencesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPreferencesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload;
      })
      .addCase(resetPreferencesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFontSize,
  setTheme,
  toggleDyslexiaMode,
  setDyslexiaMode,
  setSpeechRate,
  setDefaultMode,
  resetPreferences,
  clearError,
  setPreferencesLocal,
  hydratePreferences,
} = preferencesSlice.actions;

// Selectors
type RootState = { preferences: PreferencesState };
export const selectPreferences = (state: RootState) =>
  state.preferences.preferences;
export const selectTheme = (state: RootState) =>
  state.preferences.preferences.theme;
export const selectDyslexiaMode = (state: RootState) =>
  state.preferences.preferences.dyslexiaMode;
export const selectFontSize = (state: RootState) =>
  state.preferences.preferences.fontSize;
export const selectSpeechRate = (state: RootState) =>
  state.preferences.preferences.speechRate;
export const selectDefaultMode = (state: RootState) =>
  state.preferences.defaultMode || state.preferences.preferences.defaultMode;
export const selectIsLoading = (state: RootState) =>
  state.preferences.isLoading;
export const selectIsSyncing = (state: RootState) =>
  state.preferences.isSyncing;
export const selectError = (state: RootState) => state.preferences.error;
export const selectIsHydrated = (state: RootState) =>
  state.preferences.isHydrated;

export default preferencesSlice.reducer;

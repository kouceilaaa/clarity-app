"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/stores/hooks";
import { useSession } from "next-auth/react";
import {
  fetchPreferences,
  syncPreferences,
  resetPreferencesThunk,
  setFontSize,
  setTheme,
  toggleDyslexiaMode,
  setDyslexiaMode,
  setSpeechRate,
  setDefaultMode,
  setPreferencesLocal,
  selectPreferences,
  selectTheme,
  selectDyslexiaMode,
  selectFontSize,
  selectSpeechRate,
  selectDefaultMode,
  selectIsLoading,
  selectIsSyncing,
  selectError,
  selectIsHydrated,
} from "@/lib/stores/preferencesSlice";
import type { UserPreferences, SimplificationMode } from "@/lib/types";

const DEBOUNCE_DELAY = 500; // ms
const LOCAL_STORAGE_KEY = "clarity-preferences";

/**
 * Hook for managing user preferences with automatic sync to MongoDB for authenticated users
 * and localStorage fallback for unauthenticated users.
 */
export function usePreferences() {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Selectors
  const preferences = useAppSelector(selectPreferences);
  const theme = useAppSelector(selectTheme);
  const dyslexiaMode = useAppSelector(selectDyslexiaMode);
  const fontSize = useAppSelector(selectFontSize);
  const speechRate = useAppSelector(selectSpeechRate);
  const defaultMode = useAppSelector(selectDefaultMode);
  const isLoading = useAppSelector(selectIsLoading);
  const isSyncing = useAppSelector(selectIsSyncing);
  const error = useAppSelector(selectError);
  const isHydrated = useAppSelector(selectIsHydrated);

  // Debounce refs
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Partial<UserPreferences>>({});

  // Load preferences on mount
  useEffect(() => {
    if (status === "loading") return;

    if (isAuthenticated) {
      // Fetch from MongoDB
      dispatch(fetchPreferences());
    } else {
      // Load from localStorage
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch(setPreferencesLocal(parsed));
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [dispatch, isAuthenticated, status]);

  // Save to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated && isHydrated) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [preferences, isAuthenticated, isHydrated]);

  // Debounced sync function
  const syncWithDebounce = useCallback(
    (updates: Partial<UserPreferences>) => {
      if (!isAuthenticated) return;

      // Accumulate updates
      pendingUpdatesRef.current = {
        ...pendingUpdatesRef.current,
        ...updates,
      };

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        const updatesToSync = { ...pendingUpdatesRef.current };
        pendingUpdatesRef.current = {};
        dispatch(syncPreferences(updatesToSync));
      }, DEBOUNCE_DELAY);
    },
    [dispatch, isAuthenticated]
  );

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Action handlers with optimistic updates
  const updateFontSize = useCallback(
    (size: number) => {
      dispatch(setFontSize(size));
      syncWithDebounce({ fontSize: size });
    },
    [dispatch, syncWithDebounce]
  );

  const updateTheme = useCallback(
    (newTheme: UserPreferences["theme"]) => {
      dispatch(setTheme(newTheme));
      syncWithDebounce({ theme: newTheme });
    },
    [dispatch, syncWithDebounce]
  );

  const toggleDyslexia = useCallback(() => {
    const newValue = !dyslexiaMode;
    dispatch(toggleDyslexiaMode());
    syncWithDebounce({ dyslexiaMode: newValue });
  }, [dispatch, dyslexiaMode, syncWithDebounce]);

  const updateDyslexiaMode = useCallback(
    (enabled: boolean) => {
      dispatch(setDyslexiaMode(enabled));
      syncWithDebounce({ dyslexiaMode: enabled });
    },
    [dispatch, syncWithDebounce]
  );

  const updateSpeechRate = useCallback(
    (rate: number) => {
      dispatch(setSpeechRate(rate));
      syncWithDebounce({ speechRate: rate });
    },
    [dispatch, syncWithDebounce]
  );

  const updateDefaultMode = useCallback(
    (mode: SimplificationMode) => {
      dispatch(setDefaultMode(mode));
      syncWithDebounce({ defaultMode: mode });
    },
    [dispatch, syncWithDebounce]
  );

  const resetAllPreferences = useCallback(async () => {
    if (isAuthenticated) {
      await dispatch(resetPreferencesThunk());
    } else {
      dispatch(
        setPreferencesLocal({
          fontSize: 16,
          theme: "normal",
          dyslexiaMode: false,
          speechRate: 1,
          defaultMode: "accessible",
        })
      );
    }
  }, [dispatch, isAuthenticated]);

  // Update multiple preferences at once
  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      dispatch(setPreferencesLocal(updates));
      syncWithDebounce(updates);
    },
    [dispatch, syncWithDebounce]
  );

  return {
    // State
    preferences,
    theme,
    dyslexiaMode,
    fontSize,
    speechRate,
    defaultMode,
    isLoading,
    isSyncing,
    error,
    isHydrated,
    isAuthenticated,

    // Actions
    updateFontSize,
    updateTheme,
    toggleDyslexia,
    updateDyslexiaMode,
    updateSpeechRate,
    updateDefaultMode,
    updatePreferences,
    resetAllPreferences,
  };
}

export default usePreferences;

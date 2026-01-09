// Redux store exports
export { store, type RootState, type AppDispatch } from "./store";
export { useAppDispatch, useAppSelector } from "./hooks";

// Preferences slice
export {
  // Async thunks
  fetchPreferences,
  syncPreferences,
  resetPreferencesThunk,
  // Local actions
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
  // Selectors
  selectTheme,
  selectDyslexiaMode,
  selectFontSize,
  selectSpeechRate,
  selectDefaultMode,
  selectPreferences,
  selectIsLoading,
  selectIsSyncing,
  selectError,
  selectIsHydrated,
} from "./preferencesSlice";

// UI slice
export {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setLoading,
  selectSidebarOpen,
  selectCurrentModal,
  selectLoadingState,
} from "./uiSlice";

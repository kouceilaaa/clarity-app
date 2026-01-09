import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  currentModal: string | null;
  loadingStates: Record<string, boolean>;
}

const initialState: UIState = {
  sidebarOpen: false,
  currentModal: null,
  loadingStates: {},
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.currentModal = null;
    },
    setLoading: (
      state,
      action: PayloadAction<{ key: string; isLoading: boolean }>
    ) => {
      state.loadingStates[action.payload.key] = action.payload.isLoading;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setLoading,
} = uiSlice.actions;

// Selectors - using inline type to avoid circular dependency
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen;
export const selectCurrentModal = (state: { ui: UIState }) => state.ui.currentModal;
export const selectLoadingState = (key: string) => (state: { ui: UIState }) =>
  state.ui.loadingStates[key] ?? false;

export default uiSlice.reducer;

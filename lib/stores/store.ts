import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./preferencesSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

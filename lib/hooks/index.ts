import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "@/lib/stores";

// Typed versions of useDispatch and useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks
export { usePreferences } from "./usePreferences";
export {
  useScrollAnimation,
  useScrollAnimationClass,
} from "./useScrollAnimation";
export { useSimplificationCache } from "./useSimplificationCache";

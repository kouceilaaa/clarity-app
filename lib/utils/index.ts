import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS class conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export utilities
export * from "./constants";
export * from "./validation";
export * from "./text.utils";
export * from "./date";
export { queryClient } from "./queryClient";


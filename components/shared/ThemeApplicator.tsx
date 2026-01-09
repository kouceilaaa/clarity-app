"use client";

import { useEffect } from "react";
import {
  useAppSelector,
  selectTheme,
  selectDyslexiaMode,
  selectFontSize,
} from "@/lib/stores";

export function ThemeApplicator() {
  const theme = useAppSelector(selectTheme);
  const dyslexiaMode = useAppSelector(selectDyslexiaMode);
  const fontSize = useAppSelector(selectFontSize);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove all theme classes
    root.classList.remove(
      "dark",
      "high-contrast",
      "cream",
      "normal",
      "theme-dark",
      "theme-cream"
    );

    // Apply theme - use 'dark' class for proper Tailwind CSS dark mode support
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.add("theme-dark");
    } else if (theme === "high-contrast") {
      root.classList.add("dark"); // high-contrast is typically dark-based
      root.classList.add("high-contrast");
    } else if (theme === "cream") {
      root.classList.add("cream");
      root.classList.add("theme-cream");
    }
    // For "normal" theme, no additional class needed (uses default light mode)

    // Apply dyslexia mode
    if (dyslexiaMode) {
      body.classList.add("dyslexia-mode");
      root.classList.add("dyslexia-mode");
    } else {
      body.classList.remove("dyslexia-mode");
      root.classList.remove("dyslexia-mode");
    }

    // Apply font size using CSS custom property
    root.style.setProperty("--user-font-size", `${fontSize}px`);
    // Also set it as the base font size
    root.style.fontSize = `${fontSize}px`;
  }, [theme, dyslexiaMode, fontSize]);

  return null;
}

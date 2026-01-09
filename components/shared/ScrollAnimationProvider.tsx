"use client";

import { useEffect } from "react";

/**
 * Client component that initializes scroll animations on mount.
 * Add this to any page that uses scroll-animate classes.
 */
export function ScrollAnimationProvider() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Add in-view class to all animated elements immediately
      document
        .querySelectorAll(
          ".scroll-animate, .scroll-animate-fade, .scroll-animate-scale, .stagger-children"
        )
        .forEach((el) => {
          el.classList.add("in-view");
        });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all elements with scroll animation classes
    const elements = document.querySelectorAll(
      ".scroll-animate, .scroll-animate-fade, .scroll-animate-scale, .stagger-children"
    );

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
}

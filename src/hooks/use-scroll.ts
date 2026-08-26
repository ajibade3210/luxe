"use client";

import { useEffect, useState } from "react";

/**
 * Hook to track whether window is scrolled past a threshold.
 * Uses passive scroll listeners for maximum UI performance.
 */
export function useScroll(threshold = 20): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isScrolled;
}

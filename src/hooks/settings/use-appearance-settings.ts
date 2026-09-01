"use client";

import { useState } from "react";
import type { ButtonRadiusType, ColorScheme } from "@/types";

export function useAppearanceSettings() {
  const [colors, setColors] = useState<ColorScheme>({
    primary: "#000000",
    secondary: "#0058BE",
    button: "#000000",
    pageBackground: "#FAF8F5",
    cardBackground: "#FAF6F0",
    text: "#191C1D",
  });
  const [radius, setRadius] = useState<ButtonRadiusType>("Subtle");

  return {
    colors,
    setColors,
    radius,
    setRadius,
  };
}

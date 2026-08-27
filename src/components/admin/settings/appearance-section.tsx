import type { ButtonRadiusType, ColorScheme } from "@/lib/types";
import { Card } from "./card";

interface AppearanceSectionProps {
  colors: ColorScheme;
  setColors: (c: ColorScheme) => void;
  radius: ButtonRadiusType;
  setRadius: (r: ButtonRadiusType) => void;
}

const COLOR_FIELDS = [
  { label: "Primary Brand", key: "primary", defaultHex: "#000000" },
  { label: "Secondary Accent", key: "secondary", defaultHex: "#0058BE" },
  { label: "Button Action", key: "button", defaultHex: "#000000" },
  { label: "Card Surface", key: "cardBackground", defaultHex: "#FAF6F0" },
  { label: "Main Text", key: "text", defaultHex: "#191C1D" },
] as const;

interface ThemePreset {
  name: string;
  colors: ColorScheme;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Noir & Champagne Gold",
    colors: {
      primary: "#18181B",
      secondary: "#F4E0BE",
      button: "#18181B",
      cardBackground: "#FAF6F0",
      text: "#18181B",
    },
  },
  {
    name: "Electric Cobalt & Coral",
    colors: {
      primary: "#0A25C9",
      secondary: "#FF6B35",
      button: "#0A25C9",
      cardBackground: "#F0F4FF",
      text: "#0D153A",
    },
  },
  {
    name: "Emerald Atelier & Blush",
    colors: {
      primary: "#0F382A",
      secondary: "#F9D5D3",
      button: "#0F382A",
      cardBackground: "#F2F7F4",
      text: "#0A261C",
    },
  },
  {
    name: "Imperial Plum & Acid Lime",
    colors: {
      primary: "#3B1443",
      secondary: "#D4E157",
      button: "#3B1443",
      cardBackground: "#FAF3FB",
      text: "#280C2E",
    },
  },
  {
    name: "Terracotta & Aegean Teal",
    colors: {
      primary: "#B84A28",
      secondary: "#0F766E",
      button: "#B84A28",
      cardBackground: "#FDF5ED",
      text: "#38160D",
    },
  },
  {
    name: "Midnight & Hot Magenta",
    colors: {
      primary: "#090A0F",
      secondary: "#E11D48",
      button: "#E11D48",
      cardBackground: "#F8FAFC",
      text: "#090A0F",
    },
  },
];

const BUTTON_RADIUS_OPTIONS: ButtonRadiusType[] = ["Square", "Subtle", "Rounded", "Pill"];

function sanitizeHexForPicker(hex: string | undefined, fallback: string): string {
  if (!hex) return fallback;
  const clean = hex.startsWith("#") ? hex : `#${hex}`;
  if (/^#[0-9A-Fa-f]{6}$/.test(clean)) return clean;
  if (/^#[0-9A-Fa-f]{3}$/.test(clean)) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
}

export function AppearanceSection({
  colors,
  setColors,
  radius,
  setRadius,
}: AppearanceSectionProps) {
  const handleHexInput = (key: keyof ColorScheme, value: string) => {
    let formatted = value.trim();
    if (formatted && !formatted.startsWith("#")) {
      formatted = `#${formatted}`;
    }
    setColors({ ...colors, [key]: formatted });
  };

  return (
    <Card
      title="Appearance"
      description="Customize palette colors, theme presets, and button corner radii to match your studio aesthetic."
    >
      <div className="space-y-6">
        {/* Curated Theme Presets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#374151] uppercase tracking-wider block">
              Curated Theme Presets
            </span>
            <span className="text-[11px] text-[#6b7280]">1-Click Palette Sync</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {THEME_PRESETS.map(preset => {
              const isSelected =
                colors.primary?.toUpperCase() === preset.colors.primary.toUpperCase() &&
                colors.secondary?.toUpperCase() === preset.colors.secondary.toUpperCase() &&
                colors.button?.toUpperCase() === preset.colors.button.toUpperCase() &&
                (colors.cardBackground || "#FAF6F0").toUpperCase() ===
                  (preset.colors.cardBackground || "#FAF6F0").toUpperCase() &&
                colors.text?.toUpperCase() === preset.colors.text.toUpperCase();

              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setColors({ ...preset.colors })}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? "border-[#111827] bg-[#111827] text-white shadow-xs font-medium"
                      : "border-[#e5e7eb] bg-white text-[#1f2937] hover:border-[#cbd5e1] hover:bg-[#fafaf9]"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold block">{preset.name}</span>
                    <span
                      className={`text-[10px] block ${
                        isSelected ? "text-[#9ca3af]" : "text-[#6b7280]"
                      }`}
                    >
                      {preset.colors.primary} / {preset.colors.secondary}
                    </span>
                  </div>
                  <div className="flex items-center -space-x-1.5 shrink-0 pl-2">
                    <span
                      style={{ backgroundColor: preset.colors.primary }}
                      className="w-4 h-4 rounded-full border border-white/40 shadow-2xs"
                      title={`Primary: ${preset.colors.primary}`}
                    />
                    <span
                      style={{ backgroundColor: preset.colors.secondary }}
                      className="w-4 h-4 rounded-full border border-white/40 shadow-2xs"
                      title={`Secondary: ${preset.colors.secondary}`}
                    />
                    <span
                      style={{ backgroundColor: preset.colors.cardBackground }}
                      className="w-4 h-4 rounded-full border border-white/40 shadow-2xs"
                      title={`Surface: ${preset.colors.cardBackground}`}
                    />
                    <span
                      style={{ backgroundColor: preset.colors.button }}
                      className="w-4 h-4 rounded-full border border-white/40 shadow-2xs"
                      title={`Button: ${preset.colors.button}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Palette */}
        <div className="pt-5 border-t border-[#e5e7eb]">
          <span className="text-xs font-semibold text-[#374151] uppercase tracking-wider block mb-3">
            Custom Color Palette
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
            {COLOR_FIELDS.map(({ label, key, defaultHex }) => {
              const currentValue = colors[key] ?? defaultHex;
              const pickerValue = sanitizeHexForPicker(currentValue, defaultHex);

              return (
                <div
                  key={key}
                  className="p-3 rounded-xl border border-[#e5e7eb] bg-[#fafaf9] space-y-2 shadow-2xs"
                >
                  <label className="text-[11px] font-medium text-[#4b5563] block truncate">
                    {label}
                  </label>
                  <div className="flex items-center gap-2.5 bg-white border border-[#d1d5db] focus-within:border-[#0058be] focus-within:ring-2 focus-within:ring-[#0058be]/10 rounded-lg px-2.5 py-1.5 transition-all shadow-2xs">
                    <div
                      className="relative w-5 h-5 rounded-md shrink-0 border border-black/15 shadow-2xs overflow-hidden cursor-pointer"
                      style={{ backgroundColor: pickerValue }}
                    >
                      <input
                        aria-label={`${label} color picker`}
                        type="color"
                        value={pickerValue}
                        onChange={e =>
                          setColors({ ...colors, [key]: e.target.value.toUpperCase() })
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={currentValue}
                      onChange={e => handleHexInput(key, e.target.value)}
                      placeholder={defaultHex}
                      maxLength={7}
                      className="w-full font-mono text-xs font-semibold text-[#1c1917] !border-0 !p-0 !outline-none !bg-transparent uppercase placeholder:text-[#9ca3af] !min-h-0 !h-auto !rounded-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Button Corner Radius */}
        <div className="pt-5 border-t border-[#e5e7eb] space-y-3">
          <span className="text-xs font-semibold text-[#374151] uppercase tracking-wider block">
            Button Corner Radius
          </span>
          <div
            className="flex flex-wrap items-center gap-2"
            role="radiogroup"
            aria-label="Button corner radius"
          >
            {BUTTON_RADIUS_OPTIONS.map(item => {
              const isSelected = radius === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRadius(item)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? "border-[#111827] bg-[#111827] text-white shadow-xs font-semibold"
                      : "border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#d1d5db] hover:bg-[#fafaf9]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

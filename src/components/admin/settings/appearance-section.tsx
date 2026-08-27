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

const CARD_SURFACE_PRESETS = [
  { name: "Warm Linen", hex: "#FAF6F0" },
  { name: "Alabaster White", hex: "#FFFFFF" },
  { name: "Oatmeal Silk", hex: "#F5EEE6" },
  { name: "Soft Stone", hex: "#F3F2EF" },
  { name: "Pale Blush", hex: "#FBF2EF" },
  { name: "Muted Sage", hex: "#F1F5F2" },
] as const;

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
  const currentCardBg = (colors.cardBackground || "#FAF6F0").toUpperCase();

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
      description="Customize palette colors, card surface tones, and button corner radii to match your studio aesthetic."
    >
      <div className="space-y-6">
        {/* Brand Palette Grid */}
        <div>
          <span className="text-xs font-semibold text-[#374151] uppercase tracking-wider block mb-3">
            Brand Palette & Surface Colors
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
                  <div className="flex items-center gap-2 bg-white border border-[#d1d5db] focus-within:border-[#0058be] focus-within:ring-2 focus-within:ring-[#0058be]/10 rounded-lg px-2.5 py-1.5 transition-all shadow-2xs">
                    <div className="relative !w-6 !h-6 rounded-md overflow-hidden shrink-0 border border-black/10 shadow-2xs">
                      <input
                        aria-label={`${label} color picker`}
                        type="color"
                        value={pickerValue}
                        onChange={e =>
                          setColors({ ...colors, [key]: e.target.value.toUpperCase() })
                        }
                        className="absolute inset-0 !w-full !h-full !p-0 !border-0 cursor-pointer scale-150"
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

        {/* Curated Card Surface Presets */}
        <div className="pt-5 border-t border-[#e5e7eb] space-y-3">
          <span className="text-xs font-semibold text-[#374151] uppercase tracking-wider block">
            Curated Card Surface Presets
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {CARD_SURFACE_PRESETS.map(preset => {
              const isSelected = currentCardBg === preset.hex.toUpperCase();
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setColors({ ...colors, cardBackground: preset.hex })}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? "border-[#111827] bg-[#111827] text-white shadow-xs font-semibold"
                      : "border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#d1d5db] hover:bg-[#fafaf9]"
                  }`}
                >
                  <span
                    style={{ backgroundColor: preset.hex }}
                    className={`w-3.5 h-3.5 rounded-full border shrink-0 ${
                      isSelected ? "border-white/30" : "border-black/10"
                    }`}
                  />
                  <span>{preset.name}</span>
                </button>
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

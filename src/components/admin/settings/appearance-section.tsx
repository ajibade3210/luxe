import type { ButtonRadiusType, ColorScheme } from "@/lib/types";
import { Card } from "./card";

interface AppearanceSectionProps {
  colors: ColorScheme;
  setColors: (c: ColorScheme) => void;
  radius: ButtonRadiusType;
  setRadius: (r: ButtonRadiusType) => void;
}

const CARD_SURFACE_PRESETS = [
  { name: "Warm Linen", hex: "#FAF6F0" },
  { name: "Alabaster White", hex: "#FFFFFF" },
  { name: "Oatmeal Silk", hex: "#F5EEE6" },
  { name: "Soft Stone", hex: "#F3F2EF" },
  { name: "Pale Blush", hex: "#FBF2EF" },
  { name: "Muted Sage", hex: "#F1F5F2" },
] as const;

export function AppearanceSection({
  colors,
  setColors,
  radius,
  setRadius,
}: AppearanceSectionProps) {
  const currentCardBg = colors.cardBackground || "#FAF6F0";

  return (
    <Card
      title="Appearance & Branding"
      description="Customize palette colors, card surface tones, and button corner radii to match your studio aesthetic."
    >
      <span className="eyebrow">Colors (Brand Palette & Card Tone)</span>
      <div className="color-row">
        {(
          [
            ["Primary (Core Brand)", "primary"],
            ["Secondary (Electric Blue)", "secondary"],
            ["Button Action Color", "button"],
            ["Card / Surface Background", "cardBackground"],
            ["Text Color (Main)", "text"],
          ] as const
        ).map(([label, key]) => (
          <label className="color-control" key={key}>
            <span>{label}</span>
            <div className="color-input-row">
              <input
                aria-label={`${label} color`}
                type="color"
                value={colors[key] || (key === "cardBackground" ? "#FAF6F0" : "#000000")}
                onChange={e => setColors({ ...colors, [key]: e.target.value })}
              />
              <code className="font-mono">
                {(colors[key] || (key === "cardBackground" ? "#FAF6F0" : "#000000")).toUpperCase()}
              </code>
            </div>
          </label>
        ))}
      </div>

      {/* Luxury Card Surface Presets */}
      <div className="mt-4 pt-4 border-t border-[#f0e8dc]">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8c8278] block mb-2">
          Curated Card Surface Presets
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {CARD_SURFACE_PRESETS.map(preset => {
            const isSelected = currentCardBg.toUpperCase() === preset.hex;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => setColors({ ...colors, cardBackground: preset.hex })}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? "border-[#1c1917] bg-white text-[#1c1917] ring-1 ring-[#1c1917]"
                    : "border-[#e0d6c8] bg-white text-[#5c544d] hover:bg-[#faf6f0]"
                }`}
              >
                <span
                  style={{ backgroundColor: preset.hex }}
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                />
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="radius-choice mt-6">
        <span className="eyebrow">Button corner radius</span>
        <div className="radius-options" role="radiogroup" aria-label="Button corner radius">
          {(["Square", "Subtle", "Rounded", "Pill"] as ButtonRadiusType[]).map(item => (
            <label className="radius-option" key={item}>
              <input
                type="radio"
                name="button-radius"
                value={item}
                checked={radius === item}
                onChange={() => setRadius(item)}
              />
              <span className="radio-dot" aria-hidden="true" />
              {item}
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}

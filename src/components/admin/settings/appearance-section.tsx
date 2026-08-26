import type { ButtonRadiusType, ColorScheme } from "@/lib/types";
import { Card } from "./card";

interface AppearanceSectionProps {
  colors: ColorScheme;
  setColors: (c: ColorScheme) => void;
  radius: ButtonRadiusType;
  setRadius: (r: ButtonRadiusType) => void;
}

export function AppearanceSection({
  colors,
  setColors,
  radius,
  setRadius,
}: AppearanceSectionProps) {
  return (
    <Card
      title="Appearance & Branding"
      description="Customize palette colors and button corner radii to match your studio aesthetic."
    >
      <span className="eyebrow">Colors (VibeCoder Lumina Palette)</span>
      <div className="color-row">
        {(
          [
            ["Primary (Core Brand)", "primary"],
            ["Secondary (Electric Blue)", "secondary"],
            ["Button Action Color", "button"],
            ["Text Color (Main)", "text"],
          ] as const
        ).map(([label, key]) => (
          <label className="color-control" key={key}>
            <span>{label}</span>
            <div className="color-input-row">
              <input
                aria-label={`${label} color`}
                type="color"
                value={colors[key]}
                onChange={e => setColors({ ...colors, [key]: e.target.value })}
              />
              <code className="font-mono">{colors[key].toUpperCase()}</code>
            </div>
          </label>
        ))}
      </div>

      <div className="radius-choice">
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

import type { ToggleProps } from "@/types";

export function Toggle({ on, onClick, ariaLabel = "Toggle setting" }: ToggleProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`settings-toggle ${on ? "on" : ""}`}
      onClick={onClick}
    >
      <span />
    </button>
  );
}

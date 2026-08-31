/**
 * Generic Utility Helpers
 */

export const delay = (ms = 150) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");

export function sanitizeHandle(value: string, prefix = ""): string {
  if (!value) return "";
  let v = value.trim();
  v = v.replace(/^https?:\/\//i, "");
  if (prefix) {
    const rawPrefix = prefix.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    if (v.toLowerCase().startsWith(rawPrefix.toLowerCase())) {
      v = v.slice(rawPrefix.length).replace(/^\/?/, "");
    }
  }
  v = v.replace(
    /^(www\.)?(instagram\.com|facebook\.com|linkedin\.com\/in|linkedin\.com\/company|linkedin\.com|tiktok\.com\/@|tiktok\.com|x\.com|twitter\.com|youtube\.com\/@|youtube\.com\/c|youtube\.com|threads\.net\/@|threads\.net|threads\.com\/@|threads\.com|pinterest\.com|wa\.me)\/?/i,
    ""
  );
  if (prefix === "linkedin.com/in/" && v.startsWith("company/")) {
    v = v.replace(/^company\//, "");
  }
  if (prefix === "youtube.com/@" && v.startsWith("c/")) {
    v = v.replace(/^c\//, "");
  }
  if (v.startsWith("@") && (prefix.endsWith("@") || prefix.endsWith("/"))) {
    v = v.slice(1);
  }
  return v;
}

export function isValidUrl(url?: string | null): boolean {
  if (!url?.trim()) return false;
  const trimmed = url.trim();
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;
  return urlPattern.test(trimmed);
}

export function normalizeWebsiteUrl(url?: string | null): string {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidTimeFormat(val: string): boolean {
  if (!val) return false;
  const trimmed = val.trim().toUpperCase();
  return /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/.test(trimmed);
}

export function normalizeTimeInput(val: string, fallback: string): string {
  if (!val) return fallback;
  const trimmed = val.trim().toUpperCase();

  // Standard 12-hour: e.g. "09:00 AM", "9:00 AM", "9:00AM", "9 AM", "9PM"
  const match12 = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (match12) {
    const hours = parseInt(match12[1], 10);
    const mins = match12[2] ? parseInt(match12[2], 10) : 0;
    const meridiem = match12[3];
    if (hours >= 1 && hours <= 12 && mins >= 0 && mins <= 59) {
      const paddedHours = hours.toString().padStart(2, "0");
      const paddedMins = mins.toString().padStart(2, "0");
      return `${paddedHours}:${paddedMins} ${meridiem}`;
    }
  }

  // 24-hour: e.g. "18:00", "09:00", "9:00"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let hours = parseInt(match24[1], 10);
    const mins = parseInt(match24[2], 10);
    if (hours >= 0 && hours <= 23 && mins >= 0 && mins <= 59) {
      const meridiem = hours >= 12 ? "PM" : "AM";
      if (hours > 12) hours -= 12;
      if (hours === 0) hours = 12;
      const paddedHours = hours.toString().padStart(2, "0");
      const paddedMins = mins.toString().padStart(2, "0");
      return `${paddedHours}:${paddedMins} ${meridiem}`;
    }
  }

  // Single hour digit: e.g. "9", "18"
  const matchNum = trimmed.match(/^(\d{1,2})$/);
  if (matchNum) {
    const hours = parseInt(matchNum[1], 10);
    if (hours >= 1 && hours <= 12) {
      const meridiem = hours >= 8 && hours <= 11 ? "AM" : "PM";
      const paddedHours = hours.toString().padStart(2, "0");
      return `${paddedHours}:00 ${meridiem}`;
    }
    if (hours >= 13 && hours <= 23) {
      const paddedHours = (hours - 12).toString().padStart(2, "0");
      return `${paddedHours}:00 PM`;
    }
  }

  return fallback;
}

export function isDarkColor(hex?: string): boolean {
  if (!hex) return false;
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6 && clean.length !== 3) return false;
  const fullHex =
    clean.length === 3
      ? clean
          .split("")
          .map(c => c + c)
          .join("")
      : clean;
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return false;
  // Perceived brightness formula (YIQ)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 135;
}

export function normalizeButtonRadius(
  radius?: string | null
): "Square" | "Subtle" | "Rounded" | "Pill" {
  if (!radius) return "Subtle";
  const val = radius.toLowerCase().trim();
  if (val === "0px" || val === "square" || val === "none") return "Square";
  if (val === "12px" || val === "16px" || val === "rounded") return "Rounded";
  if (val === "9999px" || val === "pill" || val === "full") return "Pill";
  return "Subtle";
}

export function getButtonRadiusClass(radius?: string | null): string {
  const normalized = normalizeButtonRadius(radius);
  switch (normalized) {
    case "Square":
      return "rounded-none";
    case "Rounded":
      return "rounded-2xl";
    case "Pill":
      return "rounded-full";
    default:
      return "rounded-lg";
  }
}

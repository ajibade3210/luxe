/**
 * Nigerian and International Phone Validation & Formatting Utilities
 */

/**
 * Validates whether a phone number matches Nigerian mobile or landline numbering format.
 * Accepts local format (070..., 080..., 081..., 090..., 091...),
 * international format (+234..., 234...), or 10-digit format without leading 0.
 * Allows optional whitespace, dashes, brackets.
 */
export function isValidNigerianPhone(phone?: string | null): boolean {
  if (!phone?.trim()) return false;
  const cleaned = phone.trim().replace(/[\s\-()+]/g, "");

  // 11 digits starting with 0 (e.g. 08031234567, 070..., 081..., 090..., 091...)
  if (/^0[789][01]\d{8}$/.test(cleaned) || /^0[7-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // 13 digits starting with 234 (e.g. 2348031234567)
  if (/^234[789][01]\d{8}$/.test(cleaned) || /^234[7-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // 10 digits without leading 0 (e.g. 8031234567)
  if (/^[789][01]\d{8}$/.test(cleaned) || /^[7-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  return false;
}

/**
 * Validates phone numbers (Nigerian formats or standard international E.164 formats).
 */
export function isValidPhone(phone?: string | null): boolean {
  if (!phone?.trim()) return false;
  const trimmed = phone.trim();
  if (isValidNigerianPhone(trimmed)) return true;

  const cleaned = trimmed.replace(/[\s\-()]/g, "");
  // Generic international format (10-15 digits, starting with optional + and 1-9)
  return /^\+?[1-9]\d{9,14}$/.test(cleaned);
}

/**
 * Normalizes phone numbers to standard international format (e.g., +2348031234567).
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return phone;
  const cleaned = phone.replace(/[\s\-()]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // Nigeria local format conversion 080... -> +23480...
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `+234${cleaned.slice(1)}`;
  }

  // Nigeria 10-digit without leading 0 -> +23480...
  if (cleaned.length === 10 && /^[7-9]/.test(cleaned)) {
    return `+234${cleaned}`;
  }

  if (cleaned.startsWith("234") && cleaned.length === 13) {
    return `+${cleaned}`;
  }

  return `+${cleaned}`;
}

/**
 * Formats a phone number for display (e.g., +234 803 123 4567 or 0803 123 4567).
 */
export function formatNigerianPhone(phone?: string | null): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[\s\-()+]/g, "");

  if (cleaned.startsWith("234") && cleaned.length === 13) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `0${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return phone;
}

/**
 * Returns digits-only international format for wa.me links (e.g., 2348031234567).
 */
export function cleanPhoneForWhatsApp(phone?: string | null): string {
  if (!phone) return "";
  const normalized = normalizePhoneNumber(phone);
  return normalized.replace(/\D/g, "");
}

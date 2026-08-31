import { describe, expect, it } from "vitest";
import {
  cleanPhoneForWhatsApp,
  formatNigerianPhone,
  isValidNigerianPhone,
  isValidPhone,
  normalizePhoneNumber,
} from "../phone";

describe("Phone Utilities", () => {
  describe("isValidNigerianPhone", () => {
    it("validates 11-digit local Nigerian numbers", () => {
      expect(isValidNigerianPhone("08031234567")).toBe(true);
      expect(isValidNigerianPhone("07012345678")).toBe(true);
      expect(isValidNigerianPhone("08123456789")).toBe(true);
      expect(isValidNigerianPhone("09012345678")).toBe(true);
      expect(isValidNigerianPhone("09123456789")).toBe(true);
    });

    it("validates numbers with spaces, hyphens, and parentheses", () => {
      expect(isValidNigerianPhone("0803 123 4567")).toBe(true);
      expect(isValidNigerianPhone("+234 803 123 4567")).toBe(true);
      expect(isValidNigerianPhone("(0803) 123-4567")).toBe(true);
    });

    it("validates 13-digit international Nigerian numbers with 234 or +234", () => {
      expect(isValidNigerianPhone("+2348031234567")).toBe(true);
      expect(isValidNigerianPhone("2348031234567")).toBe(true);
      expect(isValidNigerianPhone("+2347012345678")).toBe(true);
    });

    it("validates 10-digit Nigerian numbers without leading 0", () => {
      expect(isValidNigerianPhone("8031234567")).toBe(true);
      expect(isValidNigerianPhone("7012345678")).toBe(true);
    });

    it("rejects invalid inputs like letters or incorrect lengths", () => {
      expect(isValidNigerianPhone("aasdaadda")).toBe(false);
      expect(isValidNigerianPhone("080312345")).toBe(false);
      expect(isValidNigerianPhone("0803123456789")).toBe(false);
      expect(isValidNigerianPhone("")).toBe(false);
      expect(isValidNigerianPhone(null)).toBe(false);
      expect(isValidNigerianPhone(undefined)).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("validates Nigerian phone numbers", () => {
      expect(isValidPhone("08031234567")).toBe(true);
      expect(isValidPhone("+2348031234567")).toBe(true);
    });

    it("validates international E.164 phone numbers", () => {
      expect(isValidPhone("+14155552671")).toBe(true);
      expect(isValidPhone("+447911123456")).toBe(true);
    });

    it("rejects non-numeric gibberish", () => {
      expect(isValidPhone("aasdaadda")).toBe(false);
      expect(isValidPhone("invalid-phone")).toBe(false);
      expect(isValidPhone("")).toBe(false);
    });
  });

  describe("normalizePhoneNumber", () => {
    it("normalizes local Nigerian number 080... to +23480...", () => {
      expect(normalizePhoneNumber("08031234567")).toBe("+2348031234567");
      expect(normalizePhoneNumber("0803 123 4567")).toBe("+2348031234567");
    });

    it("normalizes 10-digit format 803... to +234803...", () => {
      expect(normalizePhoneNumber("8031234567")).toBe("+2348031234567");
    });

    it("leaves already +prefixed numbers intact", () => {
      expect(normalizePhoneNumber("+2348031234567")).toBe("+2348031234567");
      expect(normalizePhoneNumber("+14155552671")).toBe("+14155552671");
    });
  });

  describe("cleanPhoneForWhatsApp", () => {
    it("formats phone number strictly as digits for wa.me URL", () => {
      expect(cleanPhoneForWhatsApp("0803 123 4567")).toBe("2348031234567");
      expect(cleanPhoneForWhatsApp("+234 803 123 4567")).toBe("2348031234567");
      expect(cleanPhoneForWhatsApp("8031234567")).toBe("2348031234567");
    });
  });

  describe("formatNigerianPhone", () => {
    it("formats 13-digit and 11-digit numbers nicely for display", () => {
      expect(formatNigerianPhone("2348031234567")).toBe("+234 803 123 4567");
      expect(formatNigerianPhone("08031234567")).toBe("0803 123 4567");
    });
  });
});

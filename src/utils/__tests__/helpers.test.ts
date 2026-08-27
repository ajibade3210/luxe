import { describe, expect, it } from "vitest";
import {
  isDarkColor,
  isValidTimeFormat,
  normalizeTimeInput,
  sanitizeHandle,
  slugify,
  truncateText,
} from "../helpers";

describe("helper utilities", () => {
  it("truncates long text properly", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
    expect(truncateText("Short", 10)).toBe("Short");
  });

  it("slugifies text into url-friendly strings", () => {
    expect(slugify("Elan Events & Co.")).toBe("elan-events-co-");
    expect(slugify("Shopwus Studio")).toBe("shopwus-studio");
  });

  describe("sanitizeHandle", () => {
    it("returns empty string for empty input", () => {
      expect(sanitizeHandle("")).toBe("");
    });

    it("strips https:// protocols and leading domain prefixes", () => {
      expect(sanitizeHandle("https://threads.com/@elanevents_lagos", "threads.com/")).toBe(
        "elanevents_lagos"
      );
      expect(sanitizeHandle("instagram.com/elan_events", "instagram.com/")).toBe("elan_events");
      expect(sanitizeHandle("https://facebook.com/elevents", "facebook.com/")).toBe("elevents");
      expect(sanitizeHandle("https://linkedin.com/in/elan-events", "linkedin.com/in/")).toBe(
        "elan-events"
      );
      expect(sanitizeHandle("company/elan-events", "linkedin.com/in/")).toBe("elan-events");
      expect(sanitizeHandle("https://www.youtube.com/@JourneyWithIniski", "youtube.com/@")).toBe(
        "JourneyWithIniski"
      );
      expect(sanitizeHandle("c/elanevents", "youtube.com/@")).toBe("elanevents");
      expect(sanitizeHandle("@JourneyWithIniski", "youtube.com/@")).toBe("JourneyWithIniski");
    });

    it("strips leading @ when prefix is already formatted", () => {
      expect(sanitizeHandle("@elanevents", "tiktok.com/@")).toBe("elanevents");
      expect(sanitizeHandle("@elanevents", "x.com/")).toBe("elanevents");
    });

    it("preserves standalone clean handles without mutation", () => {
      expect(sanitizeHandle("elanevents_lagos", "instagram.com/")).toBe("elanevents_lagos");
      expect(sanitizeHandle("+234 800 ELAN VIP", "wa.me/")).toBe("+234 800 ELAN VIP");
    });
  });

  describe("time validation and normalization", () => {
    it("validates valid 12-hour time formats", () => {
      expect(isValidTimeFormat("09:00 AM")).toBe(true);
      expect(isValidTimeFormat("12:30 PM")).toBe(true);
      expect(isValidTimeFormat("06:00 PM")).toBe(true);
      expect(isValidTimeFormat("invalid")).toBe(false);
      expect(isValidTimeFormat("25:00 PM")).toBe(false);
    });

    it("normalizes various user time inputs to standard hh:mm AM/PM format", () => {
      expect(normalizeTimeInput("9", "09:00 AM")).toBe("09:00 AM");
      expect(normalizeTimeInput("9am", "09:00 AM")).toBe("09:00 AM");
      expect(normalizeTimeInput("9:30 am", "09:00 AM")).toBe("09:30 AM");
      expect(normalizeTimeInput("18:00", "06:00 PM")).toBe("06:00 PM");
      expect(normalizeTimeInput("6pm", "06:00 PM")).toBe("06:00 PM");
      expect(normalizeTimeInput("invalid", "09:00 AM")).toBe("09:00 AM");
    });
  });

  describe("isDarkColor", () => {
    it("correctly identifies dark and light hex colors", () => {
      expect(isDarkColor("#10172A")).toBe(true);
      expect(isDarkColor("#000000")).toBe(true);
      expect(isDarkColor("#0E0E10")).toBe(true);
      expect(isDarkColor("#FFFFFF")).toBe(false);
      expect(isDarkColor("#FAF6F0")).toBe(false);
      expect(isDarkColor("#F8FAFC")).toBe(false);
      expect(isDarkColor("")).toBe(false);
    });
  });
});

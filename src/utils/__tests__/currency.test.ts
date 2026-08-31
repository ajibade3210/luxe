import { describe, expect, it } from "vitest";
import { CURRENCY_SYMBOLS, formatMoney, formatServicePrice } from "../currency";

describe("currency utilities", () => {
  it("provides correct currency symbols", () => {
    expect(CURRENCY_SYMBOLS.NGN).toBe("₦");
    expect(CURRENCY_SYMBOLS.USD).toBe("$");
    expect(CURRENCY_SYMBOLS.GBP).toBe("£");
    expect(CURRENCY_SYMBOLS.EUR).toBe("€");
  });

  it("formats NGN currency by default with two decimals for amounts above zero", () => {
    const formatted = formatMoney(50000);
    expect(formatted).toContain("50,000.00");
    expect(formatted).toContain("₦");
  });

  it("formats zero with a single 0 and no decimals", () => {
    expect(formatMoney(0)).toBe("₦0");
    expect(formatMoney(0, "USD")).toBe("$0");
  });

  it("formats USD, GBP, and EUR accurately with .00 suffix", () => {
    const usd = formatMoney(1250, "USD");
    expect(usd).toContain("1,250.00");
    expect(usd).toContain("$");

    const gbp = formatMoney(800, "GBP");
    expect(gbp).toContain("800.00");
    expect(gbp).toContain("£");

    const eur = formatMoney(950, "EUR");
    expect(eur).toContain("950.00");
    expect(eur).toContain("€");
  });

  it("handles custom decimals options", () => {
    const withDecimals = formatMoney(1234.56, "USD", { decimals: 2 });
    expect(withDecimals).toContain("1,234.56");
  });

  it("gracefully handles invalid non-finite numbers", () => {
    expect(formatMoney(Number.NaN, "USD")).toBe("$0");
    expect(formatMoney(Number.POSITIVE_INFINITY, "NGN")).toBe("₦0");
  });

  describe("formatServicePrice", () => {
    it("formats fixed price properly", () => {
      expect(formatServicePrice({ price: 150000, priceType: "fixed" }, "NGN")).toBe("₦150,000");
      expect(formatServicePrice({ price: 2500, priceType: "fixed" }, "USD")).toBe("$2,500");
    });

    it("formats price range with min and max", () => {
      expect(
        formatServicePrice({ minPrice: 100000, maxPrice: 350000, priceType: "range" }, "NGN")
      ).toBe("₦100,000 – ₦350,000");
    });

    it("formats price range with single bound", () => {
      expect(formatServicePrice({ minPrice: 50000, priceType: "range" }, "NGN")).toBe(
        "From ₦50,000"
      );
      expect(formatServicePrice({ maxPrice: 200000, priceType: "range" }, "NGN")).toBe(
        "Up to ₦200,000"
      );
    });

    it("returns null for empty or zero prices", () => {
      expect(formatServicePrice({}, "NGN")).toBeNull();
      expect(formatServicePrice({ price: null }, "NGN")).toBeNull();
    });
  });
});

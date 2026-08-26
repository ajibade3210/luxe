import { describe, expect, it } from "vitest";
import { CURRENCY_SYMBOLS, formatMoney } from "../currency";

describe("currency utilities", () => {
  it("provides correct currency symbols", () => {
    expect(CURRENCY_SYMBOLS.NGN).toBe("₦");
    expect(CURRENCY_SYMBOLS.USD).toBe("$");
    expect(CURRENCY_SYMBOLS.GBP).toBe("£");
    expect(CURRENCY_SYMBOLS.EUR).toBe("€");
  });

  it("formats NGN currency by default with zero decimals", () => {
    const formatted = formatMoney(50000);
    expect(formatted).toContain("50,000");
    expect(formatted).toContain("₦");
  });

  it("formats USD, GBP, and EUR accurately", () => {
    const usd = formatMoney(1250, "USD");
    expect(usd).toContain("1,250");
    expect(usd).toContain("$");

    const gbp = formatMoney(800, "GBP");
    expect(gbp).toContain("800");
    expect(gbp).toContain("£");

    const eur = formatMoney(950, "EUR");
    expect(eur).toContain("950");
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
});

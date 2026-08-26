export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export const formatMoney = (n: number, currency: CurrencyCode = "NGN") => {
  if (currency === "NGN") {
    return `₦${new Intl.NumberFormat("en-NG", {
      maximumFractionDigits: 0,
    }).format(n)}`;
  }
  if (currency === "GBP") {
    return `£${new Intl.NumberFormat("en-GB", {
      maximumFractionDigits: 0,
    }).format(n)}`;
  }
  if (currency === "EUR") {
    return `€${new Intl.NumberFormat("de-DE", {
      maximumFractionDigits: 0,
    }).format(n)}`;
  }
  return `$${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(n)}`;
};

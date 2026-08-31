import type { CurrencyCode, FormatMoneyOptions } from "@/types";

export type { CurrencyCode, FormatMoneyOptions };

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const DEFAULT_CURRENCY: CurrencyCode = "NGN";
const DEFAULT_LOCALE = "en-US";
const FALLBACK_ZERO = "0";

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "en-IE",
};

export const formatMoney = (
  n: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  options?: FormatMoneyOptions
): string => {
  if (!Number.isFinite(n)) {
    return `${CURRENCY_SYMBOLS[currency] ?? ""}${FALLBACK_ZERO}`;
  }

  const locale = CURRENCY_LOCALES[currency] ?? DEFAULT_LOCALE;
  const decimals = options?.decimals ?? (Math.abs(n) > 0 ? 2 : 0);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(n);
};

export const formatCompactMoney = (
  n: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string => {
  const sym = CURRENCY_SYMBOLS[currency] ?? "₦";
  if (!Number.isFinite(n) || n === 0) return `${sym}0`;
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    const val = (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${sym}${val}M`;
  }
  if (abs >= 1_000) {
    const val = (n / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${sym}${val}K`;
  }
  return `${sym}${n}`;
};

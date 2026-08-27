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
const DEFAULT_DECIMALS = 0;
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
  const decimals = options?.decimals ?? DEFAULT_DECIMALS;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(n);
};

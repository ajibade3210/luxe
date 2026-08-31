import type { ExpenseCategory, ExpensePaymentMethod } from "@/types";
import { THEME_PALETTE } from "./theme";

export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  "materials",
  "logistics",
  "marketing",
  "packaging",
  "utilities",
  "equipment",
  "rent",
  "salaries",
  "other",
] as const;

export const EXPENSE_CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { label: string; bg: string; color: string; border: string; text?: string }
> = {
  materials: {
    label: "Materials & Supplies",
    ...THEME_PALETTE.slate,
  },
  logistics: {
    label: "Logistics & Delivery",
    ...THEME_PALETTE.emerald,
  },
  marketing: {
    label: "Marketing & Ads",
    ...THEME_PALETTE.terracotta,
  },
  packaging: {
    label: "Packaging & Boxes",
    ...THEME_PALETTE.bronze,
  },
  utilities: {
    label: "Utilities & Tools",
    ...THEME_PALETTE.amber,
  },
  equipment: {
    label: "Equipment & Studio",
    ...THEME_PALETTE.teal,
  },
  rent: {
    label: "Studio Rent & Space",
    ...THEME_PALETTE.rose,
  },
  salaries: {
    label: "Salaries & Crew",
    ...THEME_PALETTE.emerald,
  },
  other: {
    label: "Other Expenses",
    ...THEME_PALETTE.stone,
  },
};

export const EXPENSE_PAYMENT_METHODS: Record<ExpensePaymentMethod, string> = {
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  card: "Debit/Credit Card",
  pos: "POS Terminal",
  online: "Online Payment",
};

import type { Expense, ExpenseCategory, ExpensePaymentMethod } from "@/types";
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

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp-001",
    businessId: "elan-events",
    title: "Bulk Velvet & Silk Fabric Sourcing",
    amount: 145000,
    category: "materials",
    date: "2026-08-20",
    paymentMethod: "bank_transfer",
    notes: "Raw fabric & trims for Autumn Atelier capsule collection",
    currency: "NGN",
    createdAt: "2026-08-20T10:30:00.000Z",
  },
  {
    id: "exp-002",
    businessId: "elan-events",
    title: "Instagram Sponsored Collection Drop Ads",
    amount: 45000,
    category: "marketing",
    date: "2026-08-18",
    paymentMethod: "card",
    notes: "Meta ads campaign targeting Lagos and Abuja VIP clients",
    currency: "NGN",
    createdAt: "2026-08-18T14:15:00.000Z",
  },
  {
    id: "exp-003",
    businessId: "elan-events",
    title: "Branded Embossed Gift Boxes & Ribbon",
    amount: 38000,
    category: "packaging",
    date: "2026-08-15",
    paymentMethod: "bank_transfer",
    notes: "200 custom embossed gold foil presentation gift boxes",
    currency: "NGN",
    createdAt: "2026-08-15T09:00:00.000Z",
  },
  {
    id: "exp-004",
    businessId: "elan-events",
    title: "Interstate Courier & Same-Day Dispatch",
    amount: 22500,
    category: "logistics",
    date: "2026-08-12",
    paymentMethod: "bank_transfer",
    notes: "VIP weekend deliveries to Ikoyi and Victoria Island",
    currency: "NGN",
    createdAt: "2026-08-12T16:45:00.000Z",
  },
  {
    id: "exp-005",
    businessId: "elan-events",
    title: "Studio High-Speed Fiber Internet & Generator Fuel",
    amount: 35000,
    category: "utilities",
    date: "2026-08-05",
    paymentMethod: "pos",
    notes: "Monthly fiber connectivity and studio power upkeep",
    currency: "NGN",
    createdAt: "2026-08-05T11:20:00.000Z",
  },
];

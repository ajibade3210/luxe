/**
 * Unified Quiet Luxury & Executive Atelier Theme Colors
 * Shared single source of truth for categories, statuses, badges, and telemetry.
 */

export const THEME_PALETTE = {
  bronze: {
    color: "#855e2e",
    bg: "#faf5ee",
    border: "#f0e4d4",
    text: "#6f4c22",
  },
  emerald: {
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    text: "#047857",
  },
  amber: {
    color: "#d97706",
    bg: "#fef3c7",
    border: "#fde68a",
    text: "#b45309",
  },
  slate: {
    color: "#475569",
    bg: "#f1f5f9",
    border: "#e2e8f0",
    text: "#334155",
  },
  terracotta: {
    color: "#c2410c",
    bg: "#fff7ed",
    border: "#ffedd5",
    text: "#9a3412",
  },
  rose: {
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    text: "#b91c1c",
  },
  teal: {
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#ccfbf1",
    text: "#115e59",
  },
  stone: {
    color: "#71717a",
    bg: "#f4f4f5",
    border: "#e4e4e7",
    text: "#52525b",
  },
} as const;

export const LEAD_STATUS_CONFIG = {
  new: {
    label: "New",
    ...THEME_PALETTE.amber,
  },
  contacted: {
    label: "Contacted",
    ...THEME_PALETTE.bronze,
  },
  converted: {
    label: "Converted",
    ...THEME_PALETTE.emerald,
  },
  lost: {
    label: "Lost",
    ...THEME_PALETTE.rose,
  },
} as const;

export const INVOICE_STATUS_CONFIG = {
  draft: {
    label: "Draft",
    ...THEME_PALETTE.slate,
  },
  sent: {
    label: "Sent",
    ...THEME_PALETTE.amber,
  },
  paid: {
    label: "Paid",
    ...THEME_PALETTE.emerald,
  },
  overdue: {
    label: "Overdue",
    ...THEME_PALETTE.rose,
  },
} as const;

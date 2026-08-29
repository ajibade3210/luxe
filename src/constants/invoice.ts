import type { InvoiceStatusFilter } from "@/types";

export const INVOICE_STATUS_FILTERS: { key: InvoiceStatusFilter; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "paid", label: "Paid" },
  { key: "sent", label: "Sent" },
  { key: "draft", label: "Draft" },
  { key: "cancelled", label: "Cancelled" },
];

export const INVOICE_PAGE_CONFIG = {
  title: "Invoices",
  subtitle: "Track client billing, payment receipts, and collection velocity.",
  createInvoiceButtonLabel: "Create Invoice",
  exportCsvButtonLabel: "Export CSV",
  exportingLabel: "Exporting...",
  tableTitle: "All invoices",
  searchPlaceholder: "Search invoices...",
  emptyStateMessage: "No invoices found.",
  metricLabels: {
    totalInvoiced: "Total Invoiced",
    paidRevenue: "Paid Revenue",
    outstandingRevenue: "Outstanding",
  },
  metricDetails: {
    totalInvoiced: "All time billing",
    paidRevenue: "Settled inflows",
    outstandingRevenue: "All settled",
  },
} as const;

export const INVOICE_CSV_COLUMNS = [
  "Invoice Number",
  "Customer Name",
  "Customer Email",
  "Issue Date",
  "Due Date",
  "Status",
  "Currency",
  "Subtotal",
  "Tax Amount",
  "Discount",
  "Total Amount",
] as const;

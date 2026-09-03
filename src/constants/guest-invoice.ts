import type { CurrencyCode, GuestInvoiceData, InvoiceFaqItem } from "@/types";

export const GUEST_INVOICE_LIMITS = {
  DAILY_MAX: 3,
  MONTHLY_MAX: 6,
} as const;

export const GUEST_INVOICE_STORAGE_KEYS = {
  quota: "shopwus_guest_invoice_quota",
  draft: "shopwus_guest_invoice_draft",
} as const;

export const GUEST_CURRENCY_OPTIONS: Array<{
  code: CurrencyCode;
  label: string;
  symbol: string;
}> = [
  { code: "USD", label: "USD ($)", symbol: "$" },
  { code: "NGN", label: "NGN (₦)", symbol: "₦" },
  { code: "GBP", label: "GBP (£)", symbol: "£" },
  { code: "EUR", label: "EUR (€)", symbol: "€" },
];

export const DEFAULT_GUEST_INVOICE: GuestInvoiceData = {
  invoiceNumber: "INV-001",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: "USD",
  senderName: "Apex Retail & Commerce",
  senderEmail: "billing@apexcommerce.co",
  senderAddress: "42 Bond Street, Suite 4B\nNew York, NY 10012",
  senderTaxId: "US-9284729-EIN",
  senderLogo: null,
  clientName: "Eleanor Vance",
  clientEmail: "eleanor@vancebrand.com",
  clientAddress: "128 Mercer Street\nNew York, NY 10012",
  items: [
    {
      id: "item-1",
      description: "Brand Identity Design & Creative Direction",
      quantity: 1,
      unitPrice: 2400,
      total: 2400,
    },
    {
      id: "item-2",
      description: "Custom Merchandise Production & Assets",
      quantity: 1,
      unitPrice: 850,
      total: 850,
    },
  ],
  discountType: "percentage",
  discountValue: 0,
  taxRate: 0,
  notes:
    "Thank you for your business. Please remit payment via bank wire or direct card payment within the specified terms.",
  terms:
    "Payment due within 14 calendar days of invoice date. Late balances are subject to a 1.5% monthly service charge.",
};

export const INVOICE_FAQS: InvoiceFaqItem[] = [
  {
    question: "Is this invoice generator really 100% free?",
    answer:
      "Yes. You can generate, customize, preview, print, and download polished invoices directly in your browser without entering credit card information, paying hidden fees, or undergoing mandatory sign-up.",
  },
  {
    question: "Can I upload my own company logo?",
    answer:
      "Yes. You can upload any JPEG, PNG, or SVG logo. Your logo is processed securely within your browser session and embedded directly onto your exported PDF invoice.",
  },
  {
    question: "Are my clients' personal details saved securely?",
    answer:
      "All invoice inputs and drafts are stored locally on your device via your browser's local storage. We do not transmit or sell guest client lists to third parties.",
  },
  {
    question: "How do I accept card or bank payments directly on my invoices?",
    answer:
      "With a free Shopwus account, every invoice includes an interactive payment link allowing your clients to settle balances instantly via card, bank transfer, or Apple Pay with automated receipt reconciliation.",
  },
  {
    question: "What happens when I need to send invoices frequently?",
    answer:
      "Our guest tool allows up to 3 invoices per day and 6 invoices per month. To unlock unlimited invoices, automated overdue payment reminders, and saved customer profiles, you can create a free Shopwus account at any time.",
  },
];

export const INVOICE_CHECKLIST_STEPS = [
  {
    title: "1. Distinct Business Identity",
    description:
      "Include your registered business name, trading address, tax or VAT identification number, and official billing contact email.",
  },
  {
    title: "2. Unique Invoice Identifier",
    description:
      "Assign a sequential, non-repeating reference (e.g. INV-2026-001) for precise bookkeeping, tax audits, and reconciliation.",
  },
  {
    title: "3. Transparent Itemized Scope",
    description:
      "Clearly detail deliverable milestones, hourly creative rates, quantities, and agreed retainer packages to eliminate billing disputes.",
  },
  {
    title: "4. Explicit Due Dates & Terms",
    description:
      "State an exact calendar due date (e.g. Net 14 or Due on Receipt) alongside clear instructions for wire transfers or payment links.",
  },
];

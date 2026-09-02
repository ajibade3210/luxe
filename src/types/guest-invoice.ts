import type { CurrencyCode } from "@/types";

export interface GuestInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type DiscountType = "percentage" | "fixed";

export interface GuestInvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: CurrencyCode;
  senderName: string;
  senderEmail: string;
  senderAddress: string;
  senderTaxId: string;
  senderLogo: string | null;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: GuestInvoiceItem[];
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  notes: string;
  terms: string;
}

export interface GuestInvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

export interface GuestQuotaRecord {
  dailyCount: number;
  dailyDate: string; // YYYY-MM-DD
  monthlyCount: number;
  monthlyMonth: string; // YYYY-MM
}

export type QuotaExceededReason = "daily_exceeded" | "monthly_exceeded";

export interface GuestQuotaCheckResult {
  allowed: boolean;
  reason?: QuotaExceededReason;
}

export interface InvoiceInputFormProps {
  invoice: GuestInvoiceData;
  onChange: <K extends keyof GuestInvoiceData>(field: K, value: GuestInvoiceData[K]) => void;
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof GuestInvoiceItem, value: string | number) => void;
  onRemoveItem: (id: string) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
}

export interface InvoicePreviewCardProps {
  invoice: GuestInvoiceData;
  totals: GuestInvoiceTotals;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export interface InvoiceActionBarProps {
  onDownloadPdf: () => void;
  onPrint: () => void;
  onReset: () => void;
  isDownloading: boolean;
}

export interface InvoiceQuotaModalProps {
  isOpen: boolean;
  reason?: QuotaExceededReason;
  onClose: () => void;
}

export interface InvoiceFaqItem {
  question: string;
  answer: string;
}

export type MobileTab = "edit" | "preview";

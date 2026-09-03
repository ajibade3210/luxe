import {
  DEFAULT_GUEST_INVOICE,
  GUEST_INVOICE_LIMITS,
  GUEST_INVOICE_STORAGE_KEYS,
} from "@/constants";
import type {
  GuestInvoiceData,
  GuestInvoiceTotals,
  GuestQuotaCheckResult,
  GuestQuotaRecord,
} from "@/types";

/**
 * Computes subtotal, discount, tax, and final total for an invoice.
 */
export function calculateInvoiceTotals(invoice: GuestInvoiceData): GuestInvoiceTotals {
  const subtotal = invoice.items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  const discountVal = Number(invoice.discountValue) || 0;
  let discountAmount = 0;
  if (invoice.discountType === "percentage") {
    discountAmount = Math.max(0, (subtotal * Math.min(100, Math.max(0, discountVal))) / 100);
  } else {
    discountAmount = Math.max(0, Math.min(subtotal, discountVal));
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRateVal = Math.max(0, Number(invoice.taxRate) || 0);
  const taxAmount = (taxableAmount * taxRateVal) / 100;
  const total = taxableAmount + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Returns current calendar dates in YYYY-MM-DD and YYYY-MM formats.
 */
function getCurrentDateKeys(): { todayKey: string; monthKey: string } {
  const now = new Date();
  const todayKey = now.toISOString().split("T")[0];
  const monthKey = todayKey.slice(0, 7);
  return { todayKey, monthKey };
}

/**
 * Safely reads the guest quota state from local storage, auto-resetting
 * daily or monthly counters when date boundaries rollover.
 */
export function getGuestQuotaRecord(): GuestQuotaRecord {
  const { todayKey, monthKey } = getCurrentDateKeys();
  const fallbackRecord: GuestQuotaRecord = {
    dailyCount: 0,
    dailyDate: todayKey,
    monthlyCount: 0,
    monthlyMonth: monthKey,
  };

  if (typeof window === "undefined") {
    return fallbackRecord;
  }

  try {
    const raw = localStorage.getItem(GUEST_INVOICE_STORAGE_KEYS.quota);
    if (!raw) return fallbackRecord;

    const parsed = JSON.parse(raw) as Partial<GuestQuotaRecord>;
    let dailyCount = typeof parsed.dailyCount === "number" ? parsed.dailyCount : 0;
    let monthlyCount = typeof parsed.monthlyCount === "number" ? parsed.monthlyCount : 0;

    // Daily rollover
    if (parsed.dailyDate !== todayKey) {
      dailyCount = 0;
    }

    // Monthly rollover
    if (parsed.monthlyMonth !== monthKey) {
      monthlyCount = 0;
    }

    return {
      dailyCount,
      dailyDate: todayKey,
      monthlyCount,
      monthlyMonth: monthKey,
    };
  } catch {
    return fallbackRecord;
  }
}

/**
 * Evaluates whether a guest user is allowed to generate/download an invoice
 * or if they have hit their 3/day or 6/month gentle checkpoint.
 */
export function checkGuestQuota(): GuestQuotaCheckResult {
  const record = getGuestQuotaRecord();

  if (record.dailyCount >= GUEST_INVOICE_LIMITS.DAILY_MAX) {
    return { allowed: false, reason: "daily_exceeded" };
  }

  if (record.monthlyCount >= GUEST_INVOICE_LIMITS.MONTHLY_MAX) {
    return { allowed: false, reason: "monthly_exceeded" };
  }

  return { allowed: true };
}

/**
 * Increments the guest generation quota in local storage.
 */
export function recordGuestInvoiceGeneration(): GuestQuotaRecord {
  const record = getGuestQuotaRecord();
  const updated: GuestQuotaRecord = {
    ...record,
    dailyCount: record.dailyCount + 1,
    monthlyCount: record.monthlyCount + 1,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(GUEST_INVOICE_STORAGE_KEYS.quota, JSON.stringify(updated));
    } catch {
      // Gracefully handle storage quota or private-browsing restrictions
    }
  }

  return updated;
}

/**
 * Saves the current draft invoice to local storage for persistence across refreshes.
 */
export function saveDraftInvoice(invoice: GuestInvoiceData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_INVOICE_STORAGE_KEYS.draft, JSON.stringify(invoice));
  } catch {
    // Graceful fallback
  }
}

/**
 * Loads saved draft invoice from local storage or returns the default studio template.
 */
export function loadDraftInvoice(): GuestInvoiceData {
  if (typeof window === "undefined") return DEFAULT_GUEST_INVOICE;
  try {
    const raw = localStorage.getItem(GUEST_INVOICE_STORAGE_KEYS.draft);
    if (!raw) return DEFAULT_GUEST_INVOICE;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
      return parsed as GuestInvoiceData;
    }
    return DEFAULT_GUEST_INVOICE;
  } catch {
    return DEFAULT_GUEST_INVOICE;
  }
}

/**
 * Resets the draft invoice to defaults and clears storage.
 */
export function clearDraftInvoice(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_INVOICE_STORAGE_KEYS.draft);
  } catch {
    // Graceful fallback
  }
}

/**
 * Escapes characters for PDF literal strings: (, ), \
 */
function escapePdfText(str: string): string {
  const normalized = (str || "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E]/g, " ");
  return normalized.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/**
 * Generates a clean, valid vector PDF 1.4 document client-side and triggers direct browser download.
 * Produces crisp vector typography, structured tables, and clear layout with zero server dependencies.
 */
export function downloadVectorPdfInvoice(
  invoice: GuestInvoiceData,
  totals: GuestInvoiceTotals
): void {
  const pageWidth = 595.28; // Standard A4 width in points
  const pageHeight = 841.89; // Standard A4 height in points
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;

  // Build stream content for PDF
  const streamLines: string[] = [];

  // Helper to draw text
  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontName: "F1" | "F2" = "F1",
    gray = 0.1
  ) => {
    streamLines.push(
      `BT /${fontName} ${fontSize} Tf ${gray} g 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escapePdfText(text)}) Tj ET`
    );
  };

  // Helper to draw horizontal line
  const addLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    gray = 0.85,
    lineWidth = 0.75
  ) => {
    streamLines.push(
      `${gray} G ${lineWidth} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`
    );
  };

  // Helper to draw filled rectangle
  const addFilledRect = (x: number, y: number, width: number, height: number, grayFill = 0.96) => {
    streamLines.push(
      `${grayFill} g ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`
    );
  };

  let currentY = pageHeight - margin - 20;

  // Header: Business Name & "INVOICE"
  addText(invoice.senderName || "Studio Invoice", margin, currentY, 22, "F2", 0.08);
  addText("INVOICE", pageWidth - margin - 90, currentY, 20, "F2", 0.08);

  currentY -= 16;
  addText(invoice.invoiceNumber || "INV-001", pageWidth - margin - 90, currentY, 11, "F1", 0.4);

  // Sender details
  if (invoice.senderAddress) {
    const lines = invoice.senderAddress.split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      currentY -= 12;
      addText(line.trim(), margin, currentY, 9, "F1", 0.35);
    }
  }
  if (invoice.senderEmail) {
    currentY -= 12;
    addText(invoice.senderEmail, margin, currentY, 9, "F1", 0.35);
  }
  if (invoice.senderTaxId) {
    currentY -= 12;
    addText(`Tax ID: ${invoice.senderTaxId}`, margin, currentY, 9, "F1", 0.35);
  }

  currentY -= 20;
  addLine(margin, currentY, pageWidth - margin, currentY, 0.88, 1);

  // Metadata Grid: Billed To (Left) | Dates (Right)
  currentY -= 22;
  const metaStartY = currentY;

  // Billed to
  addText("BILLED TO", margin, metaStartY, 8, "F2", 0.45);
  let clientY = metaStartY - 14;
  addText(invoice.clientName || "Client Name", margin, clientY, 11, "F2", 0.1);
  if (invoice.clientEmail) {
    clientY -= 13;
    addText(invoice.clientEmail, margin, clientY, 9, "F1", 0.35);
  }
  if (invoice.clientAddress) {
    const cLines = invoice.clientAddress.split("\n");
    for (const cLine of cLines) {
      if (!cLine.trim()) continue;
      clientY -= 12;
      addText(cLine.trim(), margin, clientY, 9, "F1", 0.35);
    }
  }

  // Dates & Payment details on right
  const rightColX = pageWidth - margin - 150;
  addText("INVOICE DATE", rightColX, metaStartY, 8, "F2", 0.45);
  addText(invoice.issueDate || "—", rightColX, metaStartY - 12, 10, "F1", 0.1);

  addText("DUE DATE", rightColX, metaStartY - 28, 8, "F2", 0.45);
  addText(invoice.dueDate || "—", rightColX, metaStartY - 40, 10, "F1", 0.1);

  addText("CURRENCY", rightColX, metaStartY - 56, 8, "F2", 0.45);
  addText(invoice.currency || "USD", rightColX, metaStartY - 68, 10, "F1", 0.1);

  currentY = Math.min(clientY, metaStartY - 80) - 25;

  // Table Header
  const colDesc = margin + 10;
  const colQty = pageWidth - margin - 200;
  const colRate = pageWidth - margin - 130;
  const colTotal = pageWidth - margin - 60;

  addFilledRect(margin, currentY - 6, contentWidth, 22, 0.94);
  addText("DESCRIPTION", colDesc, currentY, 8, "F2", 0.3);
  addText("QTY", colQty, currentY, 8, "F2", 0.3);
  addText("RATE", colRate, currentY, 8, "F2", 0.3);
  addText("TOTAL", colTotal, currentY, 8, "F2", 0.3);

  currentY -= 20;

  // Table Rows
  for (const item of invoice.items) {
    const desc = item.description || "Service Item";
    const qty = String(item.quantity);
    const rate = Number(item.unitPrice || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const itemTotal = Number(item.total || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    addText(desc, colDesc, currentY, 9, "F1", 0.12);
    addText(qty, colQty, currentY, 9, "F1", 0.3);
    addText(rate, colRate, currentY, 9, "F1", 0.3);
    addText(itemTotal, colTotal, currentY, 9, "F2", 0.12);

    currentY -= 12;
    addLine(margin, currentY, pageWidth - margin, currentY, 0.93, 0.5);
    currentY -= 14;
  }

  // Totals Area (Aligned Right)
  const totalsLabelX = pageWidth - margin - 150;
  const totalsValX = pageWidth - margin - 60;

  currentY -= 6;
  addText("Subtotal:", totalsLabelX, currentY, 9, "F1", 0.4);
  addText(
    totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    totalsValX,
    currentY,
    9,
    "F1",
    0.15
  );

  if (totals.discountAmount > 0) {
    currentY -= 14;
    addText(
      `Discount (${invoice.discountType === "percentage" ? `${invoice.discountValue}%` : "Flat"}):`,
      totalsLabelX,
      currentY,
      9,
      "F1",
      0.4
    );
    addText(
      `-${totals.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      totalsValX,
      currentY,
      9,
      "F1",
      0.15
    );
  }

  if (invoice.taxRate > 0) {
    currentY -= 14;
    addText(`Tax (${invoice.taxRate}%):`, totalsLabelX, currentY, 9, "F1", 0.4);
    addText(
      totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      totalsValX,
      currentY,
      9,
      "F1",
      0.15
    );
  }

  currentY -= 16;
  addLine(totalsLabelX, currentY + 12, pageWidth - margin, currentY + 12, 0.8, 1);
  addText("TOTAL DUE:", totalsLabelX, currentY, 11, "F2", 0.08);
  addText(
    `${invoice.currency} ${totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    totalsValX - 25,
    currentY,
    12,
    "F2",
    0.08
  );

  // Notes & Terms
  currentY -= 40;
  if (invoice.notes) {
    addText("NOTES", margin, currentY, 8, "F2", 0.45);
    currentY -= 12;
    addText(invoice.notes.slice(0, 140), margin, currentY, 8.5, "F1", 0.35);
    currentY -= 16;
  }

  if (invoice.terms) {
    addText("TERMS & INSTRUCTIONS", margin, currentY, 8, "F2", 0.45);
    currentY -= 12;
    addText(invoice.terms.slice(0, 140), margin, currentY, 8.5, "F1", 0.35);
  }

  // Footer Watermark (Shopwus PLG loop)
  addLine(margin, margin + 25, pageWidth - margin, margin + 25, 0.9, 0.75);
  addText(
    "Created with Shopwus — The storefront and commerce platform for businesses & online vendors (shopwus.com)",
    margin + 15,
    margin + 14,
    7.5,
    "F1",
    0.5
  );

  // Assemble the PDF file
  const streamContent = streamLines.join("\n");
  const streamLength = streamContent.length;

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page
   /Parent 2 0 R
   /MediaBox [0 0 ${pageWidth} ${pageHeight}]
   /Resources <<
     /Font <<
       /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
       /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
     >>
   >>
   /Contents 4 0 R
>>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000375 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
${420 + streamLength}
%%EOF`;

  const blob = new Blob([pdfBody], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement("a");
  const safeFilename = (invoice.invoiceNumber || "INV-001").replace(/[^a-zA-Z0-9_-]/g, "_");
  downloadAnchor.href = url;
  downloadAnchor.download = `${safeFilename}.pdf`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

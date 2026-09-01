"use client";

import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/shared";
import type { InvoiceModalHeaderProps } from "@/types";

export function InvoiceModalHeader({
  existingInvoice,
  isSavingDraft,
  isSending,
  isResending,
  isDownloadingPdf,
  isSendingWhatsApp = false,
  isCopyingLink = false,
  isMarkingPaid,
  isMarkingUnpaid,
  isDeleting,
  copiedLink,
  onClose,
  onSaveDraft,
  onSendInvoice,
  onResendInvoice,
  onDownloadPdf,
  onSendWhatsApp,
  onCopyLink,
  onMarkAsPaid,
  onMarkAsUnpaid,
  onDeleteInvoice,
}: InvoiceModalHeaderProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMoreMenu]);

  const isAlreadySent =
    existingInvoice && (existingInvoice.status === "sent" || existingInvoice.status === "paid");

  const isBusy =
    isSavingDraft ||
    isSending ||
    isResending ||
    isDownloadingPdf ||
    isSendingWhatsApp ||
    isCopyingLink ||
    isMarkingPaid ||
    isMarkingUnpaid ||
    isDeleting;

  const busyLabel = isDownloadingPdf
    ? "Downloading PDF..."
    : isSendingWhatsApp
      ? "Opening WhatsApp..."
      : isCopyingLink
        ? "Copying link..."
        : isSavingDraft
          ? "Saving draft..."
          : isSending
            ? "Sending email..."
            : isResending
              ? "Resending email..."
              : isMarkingPaid
                ? "Marking paid..."
                : isMarkingUnpaid
                  ? "Reverting..."
                  : isDeleting
                    ? "Deleting..."
                    : "";

  return (
    <div className="bg-white border-b border-[#e5e7eb] px-6 sm:px-8 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
      <div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b7280] hover:text-[#111827] transition-colors cursor-pointer mb-1"
        >
          <ArrowLeft size={13} />
          <span>Back to customers</span>
        </button>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#111827] tracking-tight">
            {existingInvoice ? `Invoice ${existingInvoice.invoiceNumber}` : "Create New Invoice"}
          </h1>
          {existingInvoice?.status === "paid" && (
            <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Check size={11} />
              <span>Payment Received</span>
            </span>
          )}
          {isBusy && busyLabel && (
            <span className="inline-flex items-center gap-1.5 bg-[#fefce8] text-[#854d0e] border border-[#fef08a] px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide animate-pulse">
              <Loader2 size={11} className="animate-spin text-[#854d0e]" />
              <span>{busyLabel}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Single Primary Action Button Outside */}
        {isAlreadySent ? (
          <button
            type="button"
            onClick={onResendInvoice}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#d1d5db] hover:border-[#855e2e] px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            {isResending ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#6b7280]" />
                <span>Resending…</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                <span>Resend via Email</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSendInvoice}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 bg-[#191c1d] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 size={13} className="animate-spin text-white" />
                <span>Sending…</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Send via Email</span>
              </>
            )}
          </button>
        )}

        {/* Options Menu Button (...) */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowMoreMenu(prev => !prev)}
            className="inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#d1d5db] hover:border-[#855e2e] rounded-xl transition-all cursor-pointer shadow-2xs"
            title="More actions"
          >
            <MoreHorizontal size={15} />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 top-full mt-2 w-58 bg-white border border-[#e5e7eb] rounded-2xl shadow-xl z-50 p-2 space-y-1 text-sm animate-in fade-in zoom-in-95 duration-100">
              {/* Save as Draft (if draft/new) */}
              {(!existingInvoice || existingInvoice.status === "draft") && (
                <button
                  type="button"
                  onClick={() => {
                    onSaveDraft();
                  }}
                  disabled={isBusy}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#faf7f2] text-[#374151] hover:text-[#111827] flex items-center gap-3 font-medium cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSavingDraft ? (
                    <Loader2 size={15} className="animate-spin text-[#855e2e]" />
                  ) : (
                    <FileText size={15} />
                  )}
                  <span>{isSavingDraft ? "Saving Draft..." : "Save as Draft"}</span>
                </button>
              )}

              {/* Send via WhatsApp */}
              <button
                type="button"
                onClick={() => {
                  onSendWhatsApp();
                }}
                disabled={isBusy}
                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#f0fdf4] text-[#15803d] flex items-center gap-3 font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {isSendingWhatsApp ? (
                  <Loader2 size={16} className="animate-spin text-[#25D366] shrink-0" />
                ) : (
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                )}
                <span>{isSendingWhatsApp ? "Opening WhatsApp..." : "Send via WhatsApp"}</span>
              </button>

              {/* Download PDF */}
              <button
                type="button"
                onClick={() => {
                  onDownloadPdf();
                }}
                disabled={isBusy}
                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#faf7f2] text-[#374151] hover:text-[#111827] flex items-center gap-3 font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {isDownloadingPdf ? (
                  <Loader2 size={15} className="animate-spin text-[#855e2e]" />
                ) : (
                  <Download size={15} />
                )}
                <span>{isDownloadingPdf ? "Downloading PDF..." : "Download PDF"}</span>
              </button>

              {/* Copy Invoice Link */}
              {existingInvoice && (
                <button
                  type="button"
                  onClick={() => {
                    onCopyLink();
                  }}
                  disabled={isBusy}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#faf7f2] text-[#374151] hover:text-[#111827] flex items-center gap-3 font-medium cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isCopyingLink ? (
                    <Loader2 size={15} className="animate-spin text-[#855e2e]" />
                  ) : copiedLink ? (
                    <Check size={15} className="text-[#15803d]" />
                  ) : (
                    <Copy size={15} />
                  )}
                  <span>
                    {isCopyingLink
                      ? "Copying Link..."
                      : copiedLink
                        ? "Link Copied!"
                        : "Copy Invoice Link"}
                  </span>
                </button>
              )}

              {/* Mark as Paid / Unpaid */}
              {existingInvoice && existingInvoice.status !== "paid" && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onMarkAsPaid();
                  }}
                  disabled={isBusy}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#ecfdf5] text-[#065f46] flex items-center gap-3 font-medium cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isMarkingPaid ? (
                    <Loader2 size={15} className="animate-spin text-[#065f46]" />
                  ) : (
                    <Check size={15} />
                  )}
                  <span>{isMarkingPaid ? "Marking Paid..." : "Mark as Paid"}</span>
                </button>
              )}
              {existingInvoice && existingInvoice.status === "paid" && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onMarkAsUnpaid();
                  }}
                  disabled={isBusy}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#fefce8] text-[#854d0e] flex items-center gap-3 font-medium cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isMarkingUnpaid ? (
                    <Loader2 size={15} className="animate-spin text-[#854d0e]" />
                  ) : (
                    <RotateCcw size={15} />
                  )}
                  <span>{isMarkingUnpaid ? "Reverting..." : "Mark as Unpaid"}</span>
                </button>
              )}

              {/* Delete Draft */}
              {existingInvoice && existingInvoice.status === "draft" && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onDeleteInvoice();
                  }}
                  disabled={isBusy}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#fef2f2] text-[#b91c1c] flex items-center gap-3 font-medium cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 size={15} className="animate-spin text-[#b91c1c]" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  <span>{isDeleting ? "Deleting..." : "Delete Draft"}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

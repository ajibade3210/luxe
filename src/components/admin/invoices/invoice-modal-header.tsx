"use client";

import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Invoice } from "@/lib/types";

interface InvoiceModalHeaderProps {
  existingInvoice?: Invoice;
  isSavingDraft: boolean;
  isSending: boolean;
  isResending: boolean;
  isDownloadingPdf: boolean;
  isMarkingPaid: boolean;
  isMarkingUnpaid: boolean;
  isDeleting: boolean;
  copiedLink: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onSendInvoice: () => void;
  onResendInvoice: () => void;
  onDownloadPdf: () => void;
  onSendWhatsApp: () => void;
  onCopyLink: () => void;
  onMarkAsPaid: () => void;
  onMarkAsUnpaid: () => void;
  onDeleteInvoice: () => void;
}

export function InvoiceModalHeader({
  existingInvoice,
  isSavingDraft,
  isSending,
  isResending,
  isDownloadingPdf,
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

  const isExistingDraft = existingInvoice && existingInvoice.status === "draft";
  const isAlreadySent =
    existingInvoice && (existingInvoice.status === "sent" || existingInvoice.status === "paid");

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
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#111827] tracking-tight">
            {existingInvoice ? `Invoice ${existingInvoice.invoiceNumber}` : "Create New Invoice"}
          </h1>
          {existingInvoice?.status === "paid" && (
            <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Check size={11} />
              <span>Payment Received</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {(!existingInvoice || existingInvoice.status === "draft") && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSavingDraft || isSending}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-3.5 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            {isSavingDraft ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#6b7280]" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <FileText size={13} />
                <span>Save as Draft</span>
              </>
            )}
          </button>
        )}

        {isAlreadySent ? (
          <button
            type="button"
            onClick={onResendInvoice}
            disabled={isResending}
            className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isResending ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Resending…</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                <span>Resend Invoice</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSendInvoice}
            disabled={isSending || isSavingDraft}
            className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Sending…</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Send Invoice</span>
              </>
            )}
          </button>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu(prev => !prev)}
            className="inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#d1d5db] hover:border-[#855e2e] rounded-xl transition-all cursor-pointer shadow-2xs"
            title="More actions"
          >
            <MoreHorizontal size={15} />
          </button>

          {showMoreMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#e5e7eb] rounded-2xl shadow-xl z-50 p-1.5 space-y-0.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onDownloadPdf();
                  }}
                  disabled={isDownloadingPdf}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#faf7f2] text-[#374151] hover:text-[#111827] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                >
                  <Download size={13} />
                  <span>{isDownloadingPdf ? "Preparing PDF..." : "Download PDF"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onSendWhatsApp();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f0fdf4] text-[#15803d] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                >
                  <MessageSquare size={13} />
                  <span>Send via WhatsApp</span>
                </button>

                {existingInvoice && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onCopyLink();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#faf7f2] text-[#374151] hover:text-[#111827] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                  >
                    <Copy size={13} />
                    <span>{copiedLink ? "Copied!" : "Copy Invoice Link"}</span>
                  </button>
                )}

                {existingInvoice && existingInvoice.status !== "paid" && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onMarkAsPaid();
                    }}
                    disabled={isMarkingPaid}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#ecfdf5] text-[#065f46] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                  >
                    <Check size={13} />
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
                    disabled={isMarkingUnpaid}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#fefce8] text-[#854d0e] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>{isMarkingUnpaid ? "Reverting..." : "Mark as Unpaid"}</span>
                  </button>
                )}

                {isExistingDraft && (
                  <>
                    <div className="border-t border-[#f3f4f6] my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onDeleteInvoice();
                      }}
                      disabled={isDeleting}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#fef2f2] text-[#dc2626] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>{isDeleting ? "Deleting..." : "Delete Draft"}</span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

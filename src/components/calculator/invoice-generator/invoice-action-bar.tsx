"use client";

import { Download, Printer, RotateCcw } from "lucide-react";
import type { InvoiceActionBarProps } from "@/types";

export function InvoiceActionBar({
  onDownloadPdf,
  onPrint,
  onReset,
  isDownloading,
}: InvoiceActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-[#eee7dc] shadow-xs">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#665e57] hover:text-[#1f1d1a] hover:bg-[#faf7f2] transition-colors border border-[#e5dfd5]"
        >
          <RotateCcw size={13} />
          <span>Clear Form</span>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1f1d1a] hover:bg-[#faf7f2] transition-colors border border-[#e5dfd5]"
        >
          <Printer size={14} />
          <span>Print Invoice</span>
        </button>

        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isDownloading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#111827] hover:bg-black text-white transition-all shadow-xs hover:shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Download size={14} />
          <span>{isDownloading ? "Generating PDF..." : "Download PDF"}</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { Pencil, Sparkles } from "lucide-react";
import { useState } from "react";
import type { ProfileHeaderCardProps } from "@/types";
import { EditHeaderModal } from "./edit-header-modal";

export function ProfileHeaderCard({ business, onUpdateHeader, onToast }: ProfileHeaderCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headerUrl = business?.emailHeaderUrl;
  const headerType = business?.headerType || "AUTO";
  const includeHeaderInInvoice = business?.includeHeaderInInvoice ?? true;
  const includeHeaderInEmail = business?.includeHeaderInEmail ?? true;
  const businessName = business?.businessName || "";
  const tagline = business?.tagline || "";
  const logoUrl = business?.logoUrl;

  return (
    <>
      <div className="bg-white rounded-3xl border border-[#e5e7eb] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Title & Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#191c1d]">
                Email & Document Header
              </h2>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  headerType === "CUSTOM"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-[#0058be]"
                }`}
              >
                {headerType === "CUSTOM" ? "Custom Upload" : "Auto-Generated"}
              </span>
            </div>
            <p className="text-xs text-[#6b7280] mt-1 max-w-xl leading-relaxed">
              This branded header appears at the top of your transactional client emails, dispatched
              invoices, and PDF receipts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[#faf7f2] hover:bg-[#f0ebe3] text-[#191c1d] border border-[#ded7cb] hover:border-[#c59a78] transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <Pencil size={12} className="text-[#855e2e]" />
            <span>Customize Header</span>
          </button>
        </div>

        {/* Banner Display Preview Box */}
        <div className="relative w-full aspect-[10/3] rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] overflow-hidden shadow-2xs group flex items-center justify-center">
          {headerUrl ? (
            <img
              src={headerUrl}
              alt="Email Header Banner"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6 space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0058be] flex items-center justify-center mx-auto">
                <Sparkles size={18} />
              </div>
              <p className="text-xs font-semibold text-[#191c1d]">Default Header Active</p>
              <p className="text-[11px] text-[#6b7280]">
                Click "Customize Header" to generate or upload your custom branded banner.
              </p>
            </div>
          )}
        </div>
      </div>

      <EditHeaderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessName={businessName}
        tagline={tagline}
        logoUrl={logoUrl}
        currentHeaderUrl={headerUrl}
        currentHeaderType={headerType}
        initialIncludeInInvoice={includeHeaderInInvoice}
        initialIncludeInEmail={includeHeaderInEmail}
        onSaveHeader={onUpdateHeader}
        onToast={onToast}
      />
    </>
  );
}

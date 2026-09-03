"use client";

import { ExternalLink, Loader2, Save } from "lucide-react";
import { APP_CONFIG } from "@/constants";
import type { SettingsSaveBarProps } from "@/types";

export function SettingsSaveBar({
  saving,
  slug,
  slugStatus,
  onSave,
  bottomBarRef,
  isAtBottom,
}: SettingsSaveBarProps) {
  const isSaveDisabled = saving || slugStatus === "checking" || slugStatus === "taken";

  return (
    <>
      {/* Bottom Action Bar */}
      <div
        ref={bottomBarRef}
        className="pt-6 sm:pt-8 pb-2 border-t border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <p className="text-xs sm:text-sm text-[#6b7280]">
          Changes will immediately update your store profile and public storefront.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaveDisabled}
            className="inline-flex items-center justify-center gap-2.5 bg-[#111827] hover:bg-black text-white px-6 h-11 rounded-xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <Save size={16} />
            )}
            <span>{saving ? "Saving..." : "Save Preferences"}</span>
          </button>

          <a
            href={`/${slug || APP_CONFIG.defaultSlug}?from=settings`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-5 h-11 rounded-xl text-xs sm:text-sm font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-2xs"
          >
            <ExternalLink size={15} />
            <span>Live Store</span>
          </a>
        </div>
      </div>

      {/* Floating Save Button (Visible across all viewports until user reaches the bottom) */}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaveDisabled}
        aria-label="Save preferences"
        title="Save Preferences"
        className={`fixed bottom-7 right-6 sm:right-9 z-40 w-14 h-14 rounded-full bg-[#111827] hover:bg-black text-white shadow-2xl hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
          isAtBottom
            ? "opacity-0 translate-y-4 pointer-events-none scale-90"
            : "opacity-100 translate-y-0 pointer-events-auto scale-100 hover:scale-105"
        }`}
      >
        {saving ? <Loader2 size={22} className="animate-spin text-white" /> : <Save size={22} />}
      </button>
    </>
  );
}

"use client";

import { ExternalLink, Loader2, Save } from "lucide-react";
import { APP_CONFIG } from "@/constants";
import type { SettingsSaveBarProps } from "@/types";

export function SettingsSaveBar({
  saving,
  slug,
  onSave,
  bottomBarRef,
  isAtBottom,
}: SettingsSaveBarProps) {
  return (
    <>
      {/* Bottom Action Bar */}
      <div
        ref={bottomBarRef}
        className="pt-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <p className="text-xs text-[#6b7280]">
          Changes will immediately update your studio profile and public showcase.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-5 h-10 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin text-white" />
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? "Saving..." : "Save"}</span>
          </button>

          <a
            href={`/${slug || APP_CONFIG.defaultSlug}?from=settings`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-5 h-10 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-2xs"
          >
            <ExternalLink size={14} />
            <span>Live Studio</span>
          </a>
        </div>
      </div>

      {/* Floating Save Button (Always visible on mobile & tab until user reaches the bottom) */}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        aria-label="Save studio preferences"
        title="Save Changes"
        className={`fixed bottom-6 right-5 z-40 lg:hidden w-12 h-12 rounded-full bg-[#111827] hover:bg-black text-white shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-60 ${
          isAtBottom
            ? "opacity-0 translate-y-4 pointer-events-none scale-90"
            : "opacity-100 translate-y-0 pointer-events-auto scale-100"
        }`}
      >
        {saving ? <Loader2 size={18} className="animate-spin text-white" /> : <Save size={18} />}
      </button>
    </>
  );
}

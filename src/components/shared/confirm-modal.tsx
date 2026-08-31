"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import type { ConfirmModalProps } from "@/types";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Remove",
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={() => !isLoading && onClose()}
    >
      <div
        className="bg-white border border-[#eee7dc] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1f1d1a]">{title}</h3>
          <p className="text-xs text-[#665e57] mt-1 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="bg-white hover:bg-[#f8f4ed] text-[#2a1d15] border border-[#ded5c8] hover:border-[#c59a78] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="bg-[#191c1d] hover:bg-black !text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>{confirmLabel}…</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

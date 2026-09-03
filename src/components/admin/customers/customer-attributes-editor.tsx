"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CustomerAttributesEditorProps } from "@/types";

export function CustomerAttributesEditor({
  attributes,
  isViewMode,
  attributeError: _attributeError,
  keyInputRefs,
  onAddAttributeRow,
  onRemoveAttributeRow,
  onAttributeChange,
}: CustomerAttributesEditorProps) {
  if (isViewMode) {
    const populated = attributes.filter(a => a.key.trim() && a.value.trim());
    return (
      <div className="space-y-2.5 pt-2 border-t border-[#f3f4f6]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827]">
            Customer Attributes
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151]">
            {populated.length} items
          </span>
        </div>

        {populated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
            {populated.map((attr, idx) => (
              <div
                key={`view-attr-${attr.key}-${idx}`}
                className="bg-white border border-[#e5e7eb] shadow-2xs rounded-xl p-2.5 flex flex-col gap-0.5 break-words"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] break-words">
                  {attr.key}
                </span>
                <span className="text-xs font-semibold text-[#111827] break-words">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#9ca3af] italic bg-white p-3.5 rounded-2xl border border-[#e5e7eb] shadow-2xs">
            No custom attributes recorded for this customer.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="pt-3 border-t border-[#f3f4f6] space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827]">
              Customer Attributes
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151]">
              {attributes.filter(a => a.key.trim() || a.value.trim()).length}/25
            </span>
          </div>
          <p className="text-[11px] text-[#6b7280]">
            Dedicated key & value pairs (e.g. Waist, Bust, Preferred Window).
          </p>
        </div>

        <button
          type="button"
          disabled={attributes.length >= 25}
          onClick={onAddAttributeRow}
          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] hover:border-[#9ca3af] px-3 py-1.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <Plus size={12} />
          <span>Add Attribute</span>
        </button>
      </div>

      {/* Attributes Scrollable Container */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {attributes.map((attr, idx) => (
          <div
            key={`attr-row-${idx}`}
            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center bg-white p-2.5 rounded-2xl border border-[#e5e7eb] shadow-2xs"
          >
            {/* Key input */}
            <div>
              <input
                ref={el => {
                  keyInputRefs.current[idx] = el;
                }}
                type="text"
                maxLength={50}
                value={attr.key}
                onChange={e => onAttributeChange(idx, "key", e.target.value)}
                placeholder="Attribute name (e.g. Waist)"
                className="w-full text-xs text-[#111827] placeholder:text-[#9ca3af] bg-white border border-[#d1d5db] rounded-xl px-3 py-1.5 focus:outline-none transition-all"
              />
            </div>

            {/* Value input */}
            <div>
              <input
                type="text"
                maxLength={100}
                value={attr.value}
                onChange={e => onAttributeChange(idx, "value", e.target.value)}
                placeholder="Value (e.g. 32 inches)"
                className="w-full text-xs text-[#111827] placeholder:text-[#9ca3af] bg-white border border-[#d1d5db] rounded-xl px-3 py-1.5 focus:outline-none transition-all"
              />
            </div>

            {/* Delete button */}
            <div className="flex justify-end sm:justify-center">
              <button
                type="button"
                onClick={() => onRemoveAttributeRow(idx)}
                className="p-1.5 text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#f3f4f6] rounded-lg transition-colors cursor-pointer"
                title="Remove attribute"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

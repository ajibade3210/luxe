"use client";

import { Plus, Trash2 } from "lucide-react";
import type { InvoiceItem } from "@/lib/api";
import type { CurrencyCode } from "@/types";
import { formatMoney } from "@/utils";

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currency: CurrencyCode;
  onItemChange: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export function InvoiceItemsTable({
  items,
  currency,
  onItemChange,
  onAddItem,
  onRemoveItem,
}: InvoiceItemsTableProps) {
  return (
    <div className="space-y-3 pt-2">
      <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">
        Items Details *
      </label>

      <div className="space-y-2.5">
        {items.map(item => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-[#f9fafb] p-3 rounded-2xl border border-[#f3f4f6]"
          >
            {/* Description */}
            <div className="flex-1">
              <input
                value={item.description}
                onChange={e => onItemChange(item.id, "description", e.target.value)}
                placeholder="Item description"
                className="w-full bg-white border border-[#e5e7eb] rounded-xl px-3 py-2 text-xs text-[#111827] focus:border-[#111827] focus:outline-none"
              />
            </div>

            {/* QTY */}
            <div className="w-20">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e => onItemChange(item.id, "quantity", Number(e.target.value) || 1)}
                placeholder="Qty"
                className="w-full bg-white border border-[#e5e7eb] rounded-xl px-3 py-2 text-xs text-[#111827] text-center focus:border-[#111827] focus:outline-none"
              />
            </div>

            {/* Unit Price */}
            <div className="w-28">
              <input
                type="number"
                min="0"
                step="500"
                value={item.unitPrice}
                onChange={e => onItemChange(item.id, "unitPrice", Number(e.target.value) || 0)}
                placeholder="Cost"
                className="w-full bg-white border border-[#e5e7eb] rounded-xl px-3 py-2 text-xs text-[#111827] text-right focus:border-[#111827] focus:outline-none"
              />
            </div>

            {/* Amount */}
            <div className="w-28 text-right px-2">
              <span className="text-xs font-mono font-bold text-[#111827]">
                {formatMoney(item.amount, currency)}
              </span>
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#fee2e2] rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddItem}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111827] hover:text-[#855e2e] transition-colors py-1 cursor-pointer"
      >
        <Plus size={14} />
        <span>Add Item</span>
      </button>
    </div>
  );
}

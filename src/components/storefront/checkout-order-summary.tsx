"use client";

import { Tag } from "lucide-react";
import type { CheckoutOrderSummaryProps } from "@/types";
import { formatCurrency } from "@/utils/currency";

export function CheckoutOrderSummary({
  items,
  subtotal,
  deliveryFee,
  isFreeShipping,
  grandTotal,
  matchedZone: _matchedZone,
  deliveryType,
}: CheckoutOrderSummaryProps) {
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Order Summary Box */}
      <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-3.5 space-y-2">
        <div className="flex justify-between font-semibold text-[#191c1d]">
          <span>Items ({totalItemCount}):</span>
          <span className="font-sans font-bold tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <div className="text-[11px] text-[#6b7280] space-y-0.5 max-h-24 overflow-y-auto">
          {items.map(i => (
            <div key={i.id} className="flex justify-between">
              <span>
                {i.product.name} {i.variantTitle ? `(${i.variantTitle})` : ""} × {i.quantity}
              </span>
              <span className="font-sans font-bold tabular-nums">
                {formatCurrency(
                  (i.price !== undefined ? i.price : Number(i.product.price)) * i.quantity
                )}
              </span>
            </div>
          ))}
        </div>

        {isFreeShipping && (
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <Tag size={11} /> You unlocked Free Delivery!
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-4 space-y-2 text-xs">
        <div className="flex justify-between text-[#6b7280]">
          <span>Subtotal:</span>
          <span className="font-sans font-bold tabular-nums text-[#191c1d]">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-[#6b7280]">
          <span>Delivery ({deliveryType === "STORE_PICKUP" ? "Pickup" : "Shipping"}):</span>
          <span className="font-sans font-bold tabular-nums text-[#191c1d]">
            {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
          </span>
        </div>
        <div className="pt-2 border-t border-[#eee] flex justify-between font-bold text-sm text-[#191c1d]">
          <span>Grand Total:</span>
          <span className="font-sans font-bold tabular-nums">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}

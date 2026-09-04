"use client";

import { MapPin, Truck } from "lucide-react";
import { NIGERIAN_STATES } from "@/constants";
import type { CheckoutDeliveryFormProps } from "@/types";
import { formatCurrency } from "@/utils/currency";

export function CheckoutDeliveryForm({
  deliveryConfig,
  deliveryType,
  onDeliveryTypeChange,
  address,
  onAddressChange,
  matchedZone,
  deliveryFee: _deliveryFee,
  isFreeShipping,
}: CheckoutDeliveryFormProps) {
  return (
    <div className="space-y-3 pt-3 border-t border-[#f0f0f0]">
      <h3 className="font-bold text-xs uppercase tracking-wider text-[#191c1d]">
        2. Delivery Method
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {deliveryConfig?.enableHomeDelivery !== false && (
          <label
            className={`p-3 rounded-2xl border flex flex-col gap-1 cursor-pointer transition-all ${
              deliveryType === "HOME_DELIVERY"
                ? "border-[#191c1d] bg-black/5"
                : "border-[#e5e7eb] bg-[#fafaf9] hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "HOME_DELIVERY"}
              onChange={() => onDeliveryTypeChange("HOME_DELIVERY")}
              className="sr-only"
            />
            <div className="flex items-center gap-1.5 font-bold text-[#191c1d]">
              <Truck size={14} /> Doorstep Delivery
            </div>
            <span className="text-[11px] text-[#6b7280]">
              {isFreeShipping
                ? "Free"
                : matchedZone
                  ? formatCurrency(matchedZone.fee)
                  : "Calculated by state"}
            </span>
          </label>
        )}

        {deliveryConfig?.enableStorePickup !== false && (
          <label
            className={`p-3 rounded-2xl border flex flex-col gap-1 cursor-pointer transition-all ${
              deliveryType === "STORE_PICKUP"
                ? "border-[#191c1d] bg-black/5"
                : "border-[#e5e7eb] bg-[#fafaf9] hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "STORE_PICKUP"}
              onChange={() => onDeliveryTypeChange("STORE_PICKUP")}
              className="sr-only"
            />
            <div className="flex items-center gap-1.5 font-bold text-[#191c1d]">
              <MapPin size={14} /> Store Pickup
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">Free Collection</span>
          </label>
        )}
      </div>

      {/* Store Pickup Notice */}
      {deliveryType === "STORE_PICKUP" && (
        <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-3.5 space-y-1 text-xs">
          <div className="font-semibold text-[#191c1d]">Pickup Location:</div>
          <div className="text-[#6b7280]">{deliveryConfig?.pickupLocation || "Store Location"}</div>
          {deliveryConfig?.pickupInstructions && (
            <div className="text-[11px] text-[#855e2e] italic mt-1 pt-1 border-t border-[#eee]">
              Note: {deliveryConfig.pickupInstructions}
            </div>
          )}
        </div>
      )}

      {/* Delivery Address Fields if Home Delivery */}
      {deliveryType === "HOME_DELIVERY" && (
        <div className="space-y-2.5 pt-2">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">State *</label>
              <select
                required
                value={address.state}
                onChange={e => onAddressChange({ ...address, state: e.target.value })}
                className="w-full px-3 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
              >
                {NIGERIAN_STATES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                City / Area *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lekki Phase 1"
                value={address.city}
                onChange={e => onAddressChange({ ...address, city: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              Street Delivery Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 14 Admiralty Way, Block B, Flat 4"
              value={address.addressLine1}
              onChange={e => onAddressChange({ ...address, addressLine1: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              Delivery Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Leave with security guard / gate code 4920"
              value={address.deliveryNote || ""}
              onChange={e => onAddressChange({ ...address, deliveryNote: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

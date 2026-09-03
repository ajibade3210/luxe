"use client";

import { Check, X } from "lucide-react";
import { NIGERIAN_STATES } from "@/constants";
import type { DeliveryZoneModalProps } from "@/types";

export function DeliveryZoneModal({
  isOpen,
  onClose,
  editingZone,
  zoneName,
  zoneFee,
  zoneEstimatedDays,
  selectedStates,
  isSubmitting,
  onZoneNameChange,
  onZoneFeeChange,
  onZoneEstimatedDaysChange,
  onToggleState,
  onSelectAllStates,
  onDeselectAllStates,
  onSubmit,
}: DeliveryZoneModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#ded5c8] overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-[#eee] bg-[#fafaf9]">
          <h3 className="text-sm font-bold text-[#191c1d]">
            {editingZone ? "Edit Delivery Zone" : "New Delivery Zone"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6b7280] hover:text-[#191c1d] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Zone Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Lagos Mainland & Island, Abuja Express, Interstate"
              value={zoneName}
              onChange={e => onZoneNameChange(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Delivery Fee (₦) *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="2500"
                value={zoneFee}
                onChange={e => onZoneFeeChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl font-sans tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Estimated Time
              </label>
              <input
                type="text"
                placeholder="e.g. 1-2 business days"
                value={zoneEstimatedDays}
                onChange={e => onZoneEstimatedDaysChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-[#374151]">
                Covered States ({selectedStates.length} selected)
              </label>
              <div className="flex items-center gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={onSelectAllStates}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={onDeselectAllStates}
                  className="text-[#6b7280] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-3 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl max-h-48 overflow-y-auto">
              {NIGERIAN_STATES.map(s => {
                const isSelected = selectedStates.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => onToggleState(s)}
                    className={`text-left px-2 py-1 rounded-lg text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#191c1d] text-white font-medium"
                        : "hover:bg-gray-200 text-[#374151]"
                    }`}
                  >
                    <span>{s}</span>
                    {isSelected && <Check size={11} />}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-[#9ca3af] mt-1">
              Leaving all states unselected treats this zone as the standard nationwide flat-rate
              fallback.
            </p>
          </div>

          <div className="pt-4 border-t border-[#eee] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#6b7280] hover:text-[#191c1d] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#191c1d] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : editingZone ? "Save Changes" : "Create Zone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

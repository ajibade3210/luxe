"use client";

import { Check, Edit2, Plus, Store, Trash2, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NIGERIAN_STATES } from "@/constants";
import {
  useCreateDeliveryZoneMutation,
  useDeleteDeliveryZoneMutation,
  useDeliverySettingsQuery,
  useDeliveryZonesQuery,
  useUpdateDeliverySettingsMutation,
  useUpdateDeliveryZoneMutation,
} from "@/hooks/queries";
import type { DeliveryZone } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { Card } from "./card";
import { DeliveryZoneModal } from "./delivery-zone-modal";
import { Toggle } from "./toggle";

export function DeliverySection() {
  const { data: settings } = useDeliverySettingsQuery();
  const { data: zones = [], isLoading: isZonesLoading } = useDeliveryZonesQuery();

  const updateSettingsMutation = useUpdateDeliverySettingsMutation();
  const createZoneMutation = useCreateDeliveryZoneMutation();
  const updateZoneMutation = useUpdateDeliveryZoneMutation();
  const deleteZoneMutation = useDeleteDeliveryZoneMutation();

  // Local settings form state
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [enableStorePickup, setEnableStorePickup] = useState(true);
  const [pickupInstructions, setPickupInstructions] = useState("");
  const [enableHomeDelivery, setEnableHomeDelivery] = useState(true);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);

  // Zone modal state
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [zoneToDelete, setZoneToDelete] = useState<{ id: string; name: string } | null>(null);
  const [zoneName, setZoneName] = useState("");
  const [zoneFee, setZoneFee] = useState<string>("");
  const [zoneEstimatedDays, setZoneEstimatedDays] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  useEffect(() => {
    if (settings) {
      setAddressLine1(settings.addressLine1 || "");
      setAddressLine2(settings.addressLine2 || "");
      setCity(settings.city || "");
      setState(settings.state || "");
      setPostalCode(settings.postalCode || "");
      setEnableStorePickup(settings.enableStorePickup ?? true);
      setPickupInstructions(settings.pickupInstructions || "");
      setEnableHomeDelivery(settings.enableHomeDelivery ?? true);
      setFreeDeliveryThreshold(
        settings.freeDeliveryThreshold ? String(settings.freeDeliveryThreshold) : ""
      );
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    await updateSettingsMutation.mutateAsync({
      addressLine1: addressLine1.trim() || null,
      addressLine2: addressLine2.trim() || null,
      city: city.trim() || null,
      state: state.trim() || null,
      postalCode: postalCode.trim() || null,
      enableStorePickup,
      pickupInstructions: pickupInstructions.trim() || null,
      enableHomeDelivery,
      freeDeliveryThreshold: freeDeliveryThreshold ? Number(freeDeliveryThreshold) : null,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleOpenCreateZone = () => {
    setEditingZone(null);
    setZoneName("");
    setZoneFee("");
    setZoneEstimatedDays("");
    setSelectedStates([]);
    setIsZoneModalOpen(true);
  };

  const handleOpenEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setZoneName(zone.name);
    setZoneFee(String(zone.fee));
    setZoneEstimatedDays(zone.estimatedDays || "");
    setSelectedStates(zone.states || []);
    setIsZoneModalOpen(true);
  };

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim() || !zoneFee) return;

    if (editingZone) {
      await updateZoneMutation.mutateAsync({
        id: editingZone.id,
        input: {
          name: zoneName.trim(),
          fee: Number(zoneFee),
          estimatedDays: zoneEstimatedDays.trim() || null,
          states: selectedStates,
        },
      });
    } else {
      await createZoneMutation.mutateAsync({
        name: zoneName.trim(),
        fee: Number(zoneFee),
        estimatedDays: zoneEstimatedDays.trim() || null,
        states: selectedStates,
      });
    }

    setIsZoneModalOpen(false);
  };

  const confirmDeleteZone = async () => {
    if (!zoneToDelete) return;
    await deleteZoneMutation.mutateAsync(zoneToDelete.id);
    setZoneToDelete(null);
  };

  const toggleStateSelection = (stateName: string) => {
    if (selectedStates.includes(stateName)) {
      setSelectedStates(selectedStates.filter(s => s !== stateName));
    } else {
      setSelectedStates([...selectedStates, stateName]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Origin Store Address & Pickup */}
      <Card
        title="Store Origin & Physical Location"
        description="Your physical location used as the dispatch origin and customer collection point."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                placeholder="e.g. 14 Victoria Island Road, Plot 5B"
                value={addressLine1}
                onChange={e => setAddressLine1(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Apartment / Suite (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Suite 201"
                value={addressLine2}
                onChange={e => setAddressLine2(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">City</label>
              <input
                type="text"
                placeholder="e.g. Lagos"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">State</label>
              <input
                type="text"
                placeholder="e.g. Lagos State"
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Postal Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 101241"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
              />
            </div>
          </div>

          {/* Store Pickup Toggle & Instructions */}
          <div className="pt-4 border-t border-[#f0f0f0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#191c1d] flex items-center gap-1.5">
                  <Store size={14} className="text-[#855e2e]" /> Enable Store Pickup
                </span>
                <p className="text-[11px] text-[#6b7280]">
                  Allow buyers to select free in-person collection at checkout.
                </p>
              </div>
              <Toggle
                on={enableStorePickup}
                onClick={() => setEnableStorePickup(!enableStorePickup)}
              />
            </div>

            {enableStorePickup && (
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Pickup Instructions for Customers
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Orders are ready within 2 hours. Pickups available Mon-Sat 9am-6pm. Ask for Funmi at the reception."
                  value={pickupInstructions}
                  onChange={e => setPickupInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Doorstep Home Delivery Toggle */}
          <div className="pt-4 border-t border-[#f0f0f0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#191c1d] flex items-center gap-1.5">
                  <Truck size={14} className="text-[#855e2e]" /> Enable Doorstep Home Delivery
                </span>
                <p className="text-[11px] text-[#6b7280]">
                  Dispatch products directly to customer doorstep via courier services.
                </p>
              </div>
              <Toggle
                on={enableHomeDelivery}
                onClick={() => setEnableHomeDelivery(!enableHomeDelivery)}
              />
            </div>

            {enableHomeDelivery && (
              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Free Shipping Threshold (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af] font-sans font-bold tabular-nums">
                    ₦
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50000"
                    value={freeDeliveryThreshold}
                    onChange={e => setFreeDeliveryThreshold(e.target.value)}
                    className="w-full pl-7 pr-3.5 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl font-sans tabular-nums"
                  />
                </div>
                <p className="text-[10px] text-[#9ca3af] mt-1">
                  Orders exceeding this subtotal automatically receive free delivery.
                </p>
              </div>
            )}
          </div>

          {/* Save Settings Trigger */}
          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={updateSettingsMutation.isPending}
              className="px-5 py-2 bg-[#191c1d] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSaved ? <Check size={14} /> : null}
              <span>
                {isSaved
                  ? "Saved!"
                  : updateSettingsMutation.isPending
                    ? "Saving..."
                    : "Save Delivery Settings"}
              </span>
            </button>
          </div>
        </div>
      </Card>

      {/* 2. Zonal Delivery Rates & Custom Courier Zones */}
      <Card
        title="Delivery Zones & Zonal Rates"
        description="Set specific shipping fees based on destination states or regions (e.g., Lagos, Interstate, Nationwide)."
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#6b7280]">
              Active shipping zones: <b>{zones.length}</b>
            </p>
            <button
              type="button"
              onClick={handleOpenCreateZone}
              className="inline-flex items-center gap-1.5 bg-[#191c1d] hover:bg-black text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Delivery Zone</span>
            </button>
          </div>

          {isZonesLoading ? (
            <div className="p-8 text-center text-xs text-[#6b7280]">
              <div className="animate-spin w-4 h-4 border-2 border-[#191c1d] border-t-transparent rounded-full mx-auto mb-2" />
              Loading zones...
            </div>
          ) : zones.length === 0 ? (
            <div className="p-8 text-center text-[#6b7280] border border-dashed border-[#e5e7eb] rounded-2xl bg-[#fafaf9]">
              <Truck size={28} className="mx-auto mb-2 text-[#9ca3af]" />
              <p className="text-xs font-bold text-[#191c1d]">No delivery zones created yet</p>
              <p className="text-[11px] mt-0.5">
                Add standard delivery zones to calculate shipping rates at checkout.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#f0f0f0] border border-[#e5e7eb] rounded-2xl overflow-hidden bg-white">
              {zones.map(zone => (
                <div
                  key={zone.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[#fafaf9] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#191c1d]">{zone.name}</span>
                      {zone.estimatedDays && (
                        <span className="text-[10px] text-[#6b7280] bg-gray-100 px-2 py-0.5 rounded-md">
                          {zone.estimatedDays}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6b7280] mt-1">
                      {zone.states.length === 0
                        ? "All states (Flat Rate fallback)"
                        : `Covers ${zone.states.length} state(s): ${zone.states.slice(0, 4).join(", ")}${zone.states.length > 4 ? ` +${zone.states.length - 4} more` : ""}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-sans font-bold tabular-nums text-xs text-[#191c1d]">
                      {formatCurrency(Number(zone.fee))}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditZone(zone)}
                        className="p-1.5 text-[#6b7280] hover:text-[#191c1d] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoneToDelete({ id: zone.id, name: zone.name })}
                        className="p-1.5 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Zone Create / Edit Modal */}
      <DeliveryZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        editingZone={editingZone}
        zoneName={zoneName}
        zoneFee={zoneFee}
        zoneEstimatedDays={zoneEstimatedDays}
        selectedStates={selectedStates}
        isSubmitting={createZoneMutation.isPending || updateZoneMutation.isPending}
        onZoneNameChange={setZoneName}
        onZoneFeeChange={setZoneFee}
        onZoneEstimatedDaysChange={setZoneEstimatedDays}
        onToggleState={toggleStateSelection}
        onSelectAllStates={() => setSelectedStates([...NIGERIAN_STATES])}
        onDeselectAllStates={() => setSelectedStates([])}
        onSubmit={handleSaveZone}
      />

      {/* Delete Confirmation Modal */}
      {zoneToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="bg-white border border-[#eee7dc] rounded-2xl shadow-xl p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#191c1d]">Delete Delivery Zone</h4>
              <button
                type="button"
                onClick={() => setZoneToDelete(null)}
                className="text-[#9ca3af] hover:text-[#191c1d] p-1"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-[#665e57]">
              Are you sure you want to delete delivery zone <b>&ldquo;{zoneToDelete.name}&rdquo;</b>
              ?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setZoneToDelete(null)}
                className="inline-flex items-center justify-center bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteZone}
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Delete Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

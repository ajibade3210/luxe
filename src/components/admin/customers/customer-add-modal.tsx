"use client";

import { AlertCircle, Check, Loader2, X } from "lucide-react";

import { useState } from "react";
import { AVAILABLE_SERVICES } from "@/hooks/use-customers";
import type { NewCustomerInput } from "@/lib/api";

interface CustomerAddModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: NewCustomerInput) => Promise<boolean>;
}

export function CustomerAddModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CustomerAddModalProps) {
  const [formData, setFormData] = useState<NewCustomerInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: AVAILABLE_SERVICES[0],
    amount: 0,
    isActive: true,
  });

  const [contactError, setContactError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");

    if (!formData.name?.trim()) {
      return;
    }

    if (!formData.email?.trim() && !formData.phone?.trim()) {
      setContactError("Please provide at least one contact channel (Email or Phone/WhatsApp).");
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: AVAILABLE_SERVICES[0],
        amount: 0,
        isActive: true,
      });
      setContactError("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#eae3d7] rounded-3xl max-w-xl w-full p-6 sm:p-9 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-[#f0e8dc]">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#191c1d] tracking-tight">
            Add New Customer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1.5 -my-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-all cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4.5">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Name *
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-2.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Olivia & Liam Sterling"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Email
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-2.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={e => {
                    setFormData({ ...formData, email: e.target.value });
                    if (contactError) setContactError("");
                  }}
                  placeholder="client@luxuryholding.com"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: WhatsApp Number & Customer Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                WhatsApp Number
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-2.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  value={formData.phone || ""}
                  onChange={e => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (contactError) setContactError("");
                  }}
                  placeholder="+234 800 000 0000"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Customer Status
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-2.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={e =>
                    setFormData({ ...formData, isActive: e.target.value === "active" })
                  }
                  className="w-full bg-transparent text-xs text-[#191c1d] focus:outline-none cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Service Needed & Amount Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#f0e8dc]">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Service Needed
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-2.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <select
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-transparent text-xs text-[#191c1d] focus:outline-none cursor-pointer"
                >
                  {AVAILABLE_SERVICES.map(svc => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Amount Budget (₦)
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-2.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={formData.amount || ""}
                  onChange={e => setFormData({ ...formData, amount: Number(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full text-xs text-[#191c1d] font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Validation Error */}
          {contactError && (
            <div className="flex items-center gap-2 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-xs text-[#991b1b]">
              <AlertCircle size={14} className="shrink-0 text-[#dc2626]" />
              <span>{contactError}</span>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#f0e8dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#ded7cb] text-xs font-semibold text-[#5c5f60] hover:bg-[#faf8f5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#191c1d] hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Save Customer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

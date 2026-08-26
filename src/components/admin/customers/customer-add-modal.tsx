"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { AVAILABLE_SERVICES } from "@/hooks/use-customers";
import type { NewCustomerInput } from "@/lib/api";
import type { ServiceStatus } from "@/lib/types";

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
    serviceName: "",
    service: AVAILABLE_SERVICES[0],
    amount: 0,
    status: "pending",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        serviceName: "",
        service: AVAILABLE_SERVICES[0],
        amount: 0,
        status: "pending",
      });
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#eae3d7] rounded-3xl max-w-xl w-full p-7 sm:p-9 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#f0e8dc]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
              Client Directory · New Relationship
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#191c1d] tracking-tight mt-0.5">
              Add New Customer
            </h3>
            <p className="text-xs text-[#5c5f60] mt-1">
              Register a client profile, allocate project scope, and set initial payment status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Customer / Client Name *
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
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
                Email Address *
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@luxuryholding.com"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Phone / WhatsApp Number
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Company / Organization
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Sterling Estates Limited"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0e8dc]">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Service Scope (Optional)
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  value={formData.serviceName || ""}
                  onChange={e => setFormData({ ...formData, serviceName: e.target.value })}
                  placeholder="e.g. Floral Styling & Scenography (Optional)"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Service Specialization
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3 py-2 text-xs focus-within:border-[#855e2e] focus-within:bg-white transition-all">
                <select
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-transparent text-xs text-[#191c1d] focus:outline-none"
                >
                  {AVAILABLE_SERVICES.map(svc => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Contract Value (₦)
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
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

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Initial Status
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3 py-2 text-xs focus-within:border-[#855e2e] focus-within:bg-white transition-all">
                <select
                  value={formData.status}
                  onChange={e =>
                    setFormData({ ...formData, status: e.target.value as ServiceStatus })
                  }
                  className="w-full bg-transparent text-xs text-[#191c1d] focus:outline-none"
                >
                  <option value="pending">Pending (Review / Invoicing)</option>
                  <option value="active">Active Service</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0e8dc]">
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

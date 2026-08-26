"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { AVAILABLE_SERVICES } from "@/hooks/use-customers";
import type { Customer, ServiceStatus } from "@/lib/types";

interface CustomerServiceModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (
    customerId: string,
    customerName: string,
    data: { name: string; service: string; amount: number; status: ServiceStatus }
  ) => Promise<boolean>;
}

export function CustomerServiceModal({
  isOpen,
  customer,
  onClose,
  onSubmit,
}: CustomerServiceModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categories: [AVAILABLE_SERVICES[0] as string],
    amount: 35000,
    status: "pending" as ServiceStatus,
  });

  if (!isOpen || !customer) return null;

  const handleToggleCategory = (cat: string) => {
    setFormData(prev => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        if (prev.categories.length === 1) return prev;
        return { ...prev, categories: prev.categories.filter(c => c !== cat) };
      }
      return { ...prev, categories: [...prev.categories, cat] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const success = await onSubmit(customer.id, customer.name, {
        name: formData.name,
        service: formData.categories.join(" · ") || AVAILABLE_SERVICES[0],
        amount: formData.amount,
        status: formData.status,
      });
      if (success) {
        setFormData({
          name: "",
          categories: [AVAILABLE_SERVICES[0] as string],
          amount: 35000,
          status: "pending",
        });
        onClose();
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#eae3d7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#f0e8dc]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
              Add Service · {customer.name}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#191c1d] tracking-tight mt-0.5">
              New Service
            </h3>
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
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
              Service Name *
            </label>
            <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:bg-white transition-all">
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Floral Scenography & Styling"
                className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d]">
                Category
              </label>
              <span className="text-[10px] text-[#8e9192] italic">Select one or more</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2 bg-[#faf8f5] border border-[#ded7cb] rounded-2xl">
              {AVAILABLE_SERVICES.map(cat => {
                const isSelected = formData.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#191c1d] text-white border-[#191c1d] shadow-2xs"
                        : "bg-white text-[#5c5f60] border-[#ded7cb] hover:border-[#855e2e] hover:text-[#191c1d]"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Budget / Value (₦)
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:bg-white transition-all">
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={formData.amount}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      amount: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full text-xs text-[#191c1d] font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Status
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3 py-2 text-xs focus-within:border-[#855e2e] focus-within:bg-white transition-all">
                <select
                  value={formData.status}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      status: e.target.value as ServiceStatus,
                    })
                  }
                  className="w-full bg-transparent text-xs text-[#191c1d] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0e8dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#ded7cb] text-xs font-semibold text-[#5c5f60] hover:bg-[#faf8f5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="inline-flex items-center gap-2 bg-[#191c1d] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAdding ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Check size={13} />
                  <span>Add Service</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

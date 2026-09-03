"use client";

import { AlertCircle, Check, ChevronDown, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { APP_CONFIG } from "@/constants";
import { useStudioProfileQuery } from "@/hooks/queries";
import type { CustomerServiceModalProps, ServiceStatus } from "@/types";

export function CustomerServiceModal({
  isOpen,
  customer,
  onClose,
  onSubmit,
}: CustomerServiceModalProps) {
  const { data: profile } = useStudioProfileQuery();
  const dbServices = useMemo(() => profile?.services || [], [profile?.services]);
  const dbCategories = useMemo(() => {
    const fromProfile = profile?.portfolioCategories || [];
    const fromServices = (profile?.services || []).map(s => s.category);
    return Array.from(new Set([...fromProfile, ...fromServices].filter(Boolean)));
  }, [profile?.portfolioCategories, profile?.services]);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categories: [] as string[],
    amount: APP_CONFIG.defaultServiceAmount as number,
    status: "pending" as ServiceStatus,
  });

  useEffect(() => {
    if (isOpen && dbServices.length > 0 && !formData.name) {
      const first = dbServices[0];
      setFormData(prev => ({
        ...prev,
        name: first.name,
        categories: first.category ? [first.category] : dbCategories.slice(0, 1),
        amount: first.price ? Number(first.price) : APP_CONFIG.defaultServiceAmount,
      }));
    } else if (isOpen && dbCategories.length > 0 && formData.categories.length === 0) {
      setFormData(prev => ({
        ...prev,
        categories: [dbCategories[0]],
      }));
    }
  }, [isOpen, dbServices, dbCategories, formData.name, formData.categories.length]);

  if (!isOpen || !customer) return null;

  const handleSelectService = (serviceName: string) => {
    const found = dbServices.find(s => s.name === serviceName);
    if (found) {
      setFormData(prev => ({
        ...prev,
        name: found.name,
        categories: found.category ? [found.category] : prev.categories,
        amount: found.price ? Number(found.price) : prev.amount,
      }));
    } else {
      setFormData(prev => ({ ...prev, name: serviceName }));
    }
  };

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
    if (!formData.name) return;
    setIsAdding(true);
    try {
      const success = await onSubmit(customer.id, customer.name, {
        name: formData.name,
        service: formData.categories.join(" · ") || formData.name,
        amount: formData.amount,
        status: formData.status,
      });
      if (success) {
        setFormData({
          name: dbServices[0]?.name || "",
          categories: dbCategories.slice(0, 1),
          amount: dbServices[0]?.price
            ? Number(dbServices[0].price)
            : APP_CONFIG.defaultServiceAmount,
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
            {dbServices.length > 0 ? (
              <div className="signup-field relative flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs transition-all">
                <select
                  required
                  value={formData.name}
                  onChange={e => handleSelectService(e.target.value)}
                  className="w-full text-xs text-[#191c1d] bg-transparent focus:outline-none appearance-none cursor-pointer pr-6"
                >
                  <option value="" disabled>
                    Select a service from catalog
                  </option>
                  {dbServices.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} {s.price ? `(₦${Number(s.price).toLocaleString()})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 text-[#6b7280] pointer-events-none"
                />
              </div>
            ) : (
              <div className="p-3.5 bg-[#fefce8] border border-[#fef08a] rounded-2xl flex items-center justify-between gap-3 text-xs text-[#854d0e]">
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="text-[#a16207] shrink-0" />
                  <span>No services saved in your studio catalog.</span>
                </div>
                <Link
                  href="/vendor/settings"
                  onClick={onClose}
                  className="font-semibold underline hover:text-[#713f12] shrink-0 text-xs"
                >
                  Go to Preferences &rarr;
                </Link>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d]">
                Category
              </label>
              {dbCategories.length > 0 && (
                <span className="text-[10px] text-[#8e9192] italic">Select one or more</span>
              )}
            </div>
            {dbCategories.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#faf8f5] border border-[#ded7cb] rounded-2xl">
                {dbCategories.map(cat => {
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
            ) : (
              <div className="p-3.5 bg-[#fefce8] border border-[#fef08a] rounded-2xl flex items-center justify-between gap-3 text-xs text-[#854d0e]">
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="text-[#a16207] shrink-0" />
                  <span>No categories saved in your studio catalog.</span>
                </div>
                <Link
                  href="/vendor/settings"
                  onClick={onClose}
                  className="font-semibold underline hover:text-[#713f12] shrink-0 text-xs"
                >
                  Go to Preferences &rarr;
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Budget / Value (₦)
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs transition-all">
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
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3 py-2 text-xs transition-all">
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
              disabled={isAdding || !formData.name || dbServices.length === 0}
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

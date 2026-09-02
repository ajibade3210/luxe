"use client";

import { ChevronDown, MessageSquare, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import type { CustomerDetailDrawerProps, ServiceStatus } from "@/types";
import { formatMoney, formatStatusLabel } from "@/utils";

export function CustomerDetailDrawer({
  customer,
  customerInvoices,
  onClose,
  onToggleStatus,
  onOpenMessageModal,
  onOpenInvoiceModal,
  onOpenAddServiceModal,
  onConfirmResendInvoice,
  onDeleteDraftInvoice,
  onDeleteService,
  onUpdateServiceStatus,
}: CustomerDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!customer) return null;

  const servicesList = customer.services || [];

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="drawer-close"
          onClick={onClose}
          aria-label="Close customer details"
        >
          <X />
        </button>
        <div className="flex items-center justify-between">
          <span className="eyebrow">Customer details</span>
          <button
            type="button"
            onClick={() => onToggleStatus(customer.id, !customer.isActive)}
            title={`Click to mark as ${customer.isActive ? "Inactive" : "Active"}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              customer.isActive
                ? "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] hover:bg-[#d1fae5]"
                : "bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb] hover:bg-[#e5e7eb]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                customer.isActive ? "bg-[#10b981]" : "bg-[#9ca3af]"
              }`}
            />
            <span>{customer.isActive ? "Active" : "Inactive"}</span>
          </button>
        </div>
        <h2>{customer.name}</h2>
        <p className="drawer-email">
          {customer.email}
          {customer.phone ? ` · ${customer.phone}` : ""}
        </p>
        {customer.company && <p className="drawer-company">{customer.company}</p>}

        {/* Top Send Message Action */}
        <div className="pt-3 pb-1">
          <button
            type="button"
            disabled={!customer.isActive}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold w-full transition-all shadow-xs ${
              customer.isActive
                ? "bg-[#111827] hover:bg-black text-white cursor-pointer"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb] cursor-not-allowed opacity-60"
            }`}
            onClick={() => {
              if (!customer.isActive) return;
              onOpenMessageModal(customer);
            }}
            title={customer.isActive ? "Send Message" : "Customer is inactive"}
          >
            <MessageSquare size={14} />
            <span>Send Message</span>
          </button>
        </div>

        {/* Client notes */}
        {customer.notes && (
          <div className="drawer-block">
            <span className="eyebrow">Client notes</span>
            <p>{customer.notes}</p>
          </div>
        )}

        {/* Invoicing Section */}
        <div className="drawer-block">
          <div className="flex items-center justify-between pb-1">
            <span className="eyebrow">Invoices & Billing</span>
            <button
              type="button"
              disabled={!customer.isActive}
              onClick={() => {
                if (!customer.isActive) return;
                onOpenInvoiceModal(customer);
              }}
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                customer.isActive
                  ? "text-[#855e2e] hover:text-[#5c3e1a] bg-[#faf7f2] hover:bg-[#f5eee3] border-[#ded5c8] cursor-pointer"
                  : "text-[#9ca3af] bg-[#f3f4f6] border-[#e5e7eb] cursor-not-allowed opacity-60"
              }`}
              title={customer.isActive ? "New Invoice" : "Customer is inactive"}
            >
              <Plus size={11} />
              <span>New Invoice</span>
            </button>
          </div>

          {customerInvoices.length > 0 ? (
            <div className="space-y-2 pt-2">
              {customerInvoices.map(inv => (
                <div
                  key={inv.id}
                  className="bg-[#faf8f5] border border-[#eee7dc] rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-[#191c1d]">{inv.invoiceNumber}</b>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          inv.status === "paid"
                            ? "bg-[#ecfdf5] text-[#065f46]"
                            : inv.status === "sent"
                              ? "bg-[#eff6ff] text-[#1e40af]"
                              : "bg-[#fefce8] text-[#854d0e]"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6b7280] block mt-0.5">
                      {formatMoney(inv.total)} · Due {inv.dueDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit / View in Modal */}
                    <button
                      type="button"
                      onClick={() => onOpenInvoiceModal(customer, inv)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#d1d5db] hover:bg-[#f3f4f6] text-[11px] font-semibold text-[#374151] cursor-pointer"
                    >
                      {inv.status === "draft" ? "Edit" : "View"}
                    </button>

                    {/* Resend button if sent */}
                    {inv.status === "sent" && (
                      <button
                        type="button"
                        disabled={!customer.isActive}
                        onClick={() => {
                          if (!customer.isActive) return;
                          onConfirmResendInvoice(inv);
                        }}
                        title={
                          customer.isActive ? "Resend invoice to customer" : "Customer is inactive"
                        }
                        className={`p-1.5 rounded-lg border transition-colors ${
                          customer.isActive
                            ? "bg-white border-[#d1d5db] hover:bg-[#eff6ff] text-[#1e40af] hover:border-[#bfdbfe] cursor-pointer"
                            : "bg-[#f3f4f6] border-[#e5e7eb] text-[#9ca3af] cursor-not-allowed opacity-60"
                        }`}
                      >
                        <RefreshCw size={12} />
                      </button>
                    )}

                    {/* Delete button: ONLY IF DRAFT */}
                    {inv.status === "draft" && (
                      <button
                        type="button"
                        disabled={!customer.isActive}
                        onClick={() => {
                          if (!customer.isActive) return;
                          onDeleteDraftInvoice(inv.id);
                        }}
                        title={customer.isActive ? "Delete unsent draft" : "Customer is inactive"}
                        className={`p-1.5 rounded-lg border ${
                          customer.isActive
                            ? "bg-white border-[#fecaca] hover:bg-[#fee2e2] text-[#dc2626] cursor-pointer"
                            : "bg-[#f3f4f6] border-[#e5e7eb] text-[#9ca3af] cursor-not-allowed opacity-60"
                        }`}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#8c827a] py-2 italic">No invoices generated yet.</div>
          )}
        </div>

        {/* Services / Projects list */}
        <div className="drawer-block">
          <div className="flex items-center justify-between pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">
                Services
              </span>
              <span className="text-[11px] font-semibold text-[#855e2e] bg-[#fbf7f0] border border-[#eee7dc] px-2 py-0.5 rounded-md">
                {servicesList.length}
              </span>
            </div>
            <button
              type="button"
              disabled={!customer.isActive}
              onClick={() => {
                if (!customer.isActive) return;
                onOpenAddServiceModal();
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                customer.isActive
                  ? "text-[#191c1d] hover:text-[#855e2e] bg-white hover:bg-[#faf7f2] border-[#ded5c8] hover:border-[#855e2e] shadow-2xs cursor-pointer"
                  : "text-[#9ca3af] bg-[#f3f4f6] border-[#e5e7eb] cursor-not-allowed opacity-60"
              }`}
              title={customer.isActive ? "Add Service" : "Customer is inactive"}
            >
              <Plus size={13} />
              <span>Add Service</span>
            </button>
          </div>

          {servicesList.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {servicesList.map(service => (
                <div
                  key={service.id}
                  className="group bg-white hover:bg-[#faf8f5] border border-[#e5e7eb] hover:border-[#d1d5db] rounded-xl p-3.5 transition-all shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#191c1d] tracking-tight leading-snug truncate">
                        {service.name}
                      </h4>
                      <span className="text-[11px] text-[#6b7280] block mt-0.5 truncate">
                        {service.service}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!customer.isActive}
                      onClick={() => {
                        if (!customer.isActive) return;
                        onDeleteService(customer.id, service.id, service.name);
                      }}
                      title={customer.isActive ? "Delete service scope" : "Customer is inactive"}
                      className={`p-1.5 rounded-md transition-all shrink-0 ${
                        customer.isActive
                          ? "text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fee2e2] cursor-pointer"
                          : "text-[#d1d5db] cursor-not-allowed opacity-40"
                      }`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#f3f4f6]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                        Value:
                      </span>
                      <span className="text-xs font-bold text-[#191c1d] tabular-nums">
                        {formatMoney(service.amount)}
                      </span>
                    </div>

                    <div className="relative inline-flex items-center shrink-0">
                      <select
                        disabled={!customer.isActive}
                        value={service.status}
                        onChange={e => {
                          if (!customer.isActive) return;
                          const nextStatus = e.target.value as ServiceStatus;
                          onUpdateServiceStatus(
                            customer.id,
                            service.id,
                            nextStatus,
                            service.name,
                            formatStatusLabel(nextStatus)
                          );
                        }}
                        className={`appearance-none pr-6 pl-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all focus:outline-none ${
                          !customer.isActive
                            ? "bg-[#f3f4f6] text-[#9ca3af] border-[#e5e7eb] cursor-not-allowed opacity-60"
                            : service.status === "active"
                              ? "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0] hover:bg-[#d1fae5] cursor-pointer"
                              : service.status === "completed"
                                ? "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe] hover:bg-[#dbeafe] cursor-pointer"
                                : service.status === "cancelled"
                                  ? "bg-[#fef2f2] text-[#991b1b] border-[#fecaca] hover:bg-[#fee2e2] cursor-pointer"
                                  : "bg-[#f3f4f6] text-[#374151] border-[#d1d5db] hover:bg-[#e5e7eb] cursor-pointer"
                        }`}
                        title={
                          customer.isActive
                            ? "Click to switch service status"
                            : "Customer is inactive"
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown
                        size={11}
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#8c827a] py-3 italic bg-[#faf8f5] rounded-lg text-center border border-dashed border-[#ded5c8]">
              No services recorded yet.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

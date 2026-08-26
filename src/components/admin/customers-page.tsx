"use client";

import {
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  createCustomer,
  deleteInvoice,
  exportCustomersCSV,
  getCustomers,
  getInvoices,
  type Invoice,
  type NewCustomerInput,
  resendInvoice,
} from "@/lib/api";
import type { Customer, ProjectStatus } from "@/lib/types";
import { formatMoney, formatStatusLabel, Metric, PageTitle } from "./admin-layout";
import { InvoiceModal } from "./invoices/invoice-modal";

const AVAILABLE_SERVICES = [
  "Full Wedding Production & Styling",
  "Corporate Galas & Summits",
  "Private Dinners & Floral Scenography",
  "VIP Concierge Production",
  "Bespoke Atelier Styling",
];

export function CustomersPage({ onToast }: { onToast?: (message: string) => void }) {
  const [items, setItems] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceModalCustomer, setInvoiceModalCustomer] = useState<Customer | undefined>(undefined);
  const [invoiceModalInvoice, setInvoiceModalInvoice] = useState<Invoice | undefined>(undefined);

  // Form State for Add Customer Modal
  const [formData, setFormData] = useState<NewCustomerInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectName: "",
    service: AVAILABLE_SERVICES[0],
    amount: 50000,
    status: "pending",
  });

  useEffect(() => {
    getCustomers().then(setItems);
    getInvoices().then(setInvoices);

    const handleCustomersUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Customer[]>;
      if (customEvent.detail) {
        setItems(customEvent.detail);
      }
    };

    const handleInvoicesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Invoice[]>;
      if (customEvent.detail) {
        setInvoices(customEvent.detail);
      }
    };

    window.addEventListener("luxe_customers_updated", handleCustomersUpdate);
    window.addEventListener("luxe_invoices_updated", handleInvoicesUpdate);

    return () => {
      window.removeEventListener("luxe_customers_updated", handleCustomersUpdate);
      window.removeEventListener("luxe_invoices_updated", handleInvoicesUpdate);
    };
  }, []);

  const selectedCustomer = items.find(c => c.id === selected);
  const customerInvoices = selectedCustomer
    ? invoices.filter(
        inv =>
          inv.customerId === selectedCustomer.id || inv.customerEmail === selectedCustomer.email
      )
    : [];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await exportCustomersCSV();
      if (onToast) {
        onToast(`Customer list exported successfully (${res.count} records).`);
      }
    } catch {
      if (onToast) {
        onToast("Failed to export customer list.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      if (onToast) onToast("Please enter both customer name and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newCustomer = await createCustomer(formData);
      setItems(prev => [newCustomer, ...prev]);
      setShowAddModal(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectName: "",
        service: AVAILABLE_SERVICES[0],
        amount: 50000,
        status: "pending",
      });
      if (onToast) {
        onToast(`Customer "${newCustomer.name}" added successfully.`);
      }
    } catch {
      if (onToast) {
        onToast("Failed to create customer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenInvoiceModalForCustomer = (customer: Customer, existing?: Invoice) => {
    setInvoiceModalCustomer(customer);
    setInvoiceModalInvoice(existing);
    setShowInvoiceModal(true);
  };

  const handleResendInvoiceDirectly = async (invoiceId: string) => {
    try {
      const res = await resendInvoice(invoiceId);
      if (onToast) {
        onToast(`Invoice ${res.invoiceNumber} re-sent to ${res.customerEmail}.`);
      }
    } catch {
      if (onToast) {
        onToast("Failed to resend invoice.");
      }
    }
  };

  const handleDeleteDraftDirectly = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId);
      if (onToast) {
        onToast("Draft invoice deleted successfully.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete draft.";
      if (onToast) onToast(msg);
    }
  };

  const totalRevenue = items.reduce((acc, c) => acc + (c.totalRevenue || 0), 0);
  const activeProjectsCount = items.reduce(
    (acc, c) => acc + c.projects.filter(p => p.status === "active").length,
    0
  );

  return (
    <section className="content">
      <PageTitle
        eyebrow="Client relationships"
        title="Customers"
        description="The people behind the remarkable moments."
        action={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#ded5c8] hover:border-[#855e2e] px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Download size={14} className={isExporting ? "animate-bounce" : ""} />
              <span>{isExporting ? "Exporting..." : "Export List"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-[#191c1d] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Customer</span>
            </button>
          </div>
        }
      />

      <div className="metrics">
        <Metric
          label="Total customers"
          value={String(items.length).padStart(2, "0")}
          detail="Active relationships"
        />
        <Metric
          label="Active projects"
          value={String(activeProjectsCount).padStart(2, "0")}
          detail="In progress"
        />
        <Metric label="Revenue" value={formatMoney(totalRevenue)} detail="Across all projects" />
      </div>

      <div className="table-card">
        <div className="table-head">
          <h2>All customers</h2>
          <span>{items.length} records</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Project</th>
                <th>Value</th>
                <th>Status</th>
                <th>Invoicing</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(c => {
                const p = c.projects[0] || {
                  name: "Atelier Project",
                  service: "Bespoke Styling",
                  status: "pending" as ProjectStatus,
                  amount: c.totalRevenue,
                };
                const isPending = p.status === "pending";
                const matchingInvoice = invoices.find(
                  inv => inv.customerId === c.id || inv.customerEmail === c.email
                );

                return (
                  <tr key={c.id} onClick={() => setSelected(c.id)} className="cursor-pointer">
                    <td>
                      <b>{c.name}</b>
                      <small>{c.email}</small>
                    </td>
                    <td>
                      {p.name}
                      <small>{p.service}</small>
                    </td>
                    <td>{formatMoney(c.totalRevenue)}</td>
                    <td>
                      <span className={`status ${p.status}`}>{formatStatusLabel(p.status)}</span>
                    </td>
                    <td>
                      {matchingInvoice ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenInvoiceModalForCustomer(c, matchingInvoice);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                              matchingInvoice.status === "paid"
                                ? "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]"
                                : matchingInvoice.status === "sent"
                                  ? "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]"
                                  : "bg-[#fefce8] text-[#854d0e] border-[#fef08a]"
                            }`}
                          >
                            <FileText size={11} />
                            <span>
                              {matchingInvoice.status === "draft"
                                ? "Draft Invoice"
                                : matchingInvoice.status === "sent"
                                  ? "Sent Invoice"
                                  : "Paid"}
                            </span>
                          </button>
                        </div>
                      ) : (
                        isPending && (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenInvoiceModalForCustomer(c);
                            }}
                            className="inline-flex items-center gap-1.5 bg-[#fbf9f5] hover:bg-[#855e2e] text-[#855e2e] hover:text-white border border-[#ded5c8] hover:border-[#855e2e] px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                          >
                            <Send size={11} />
                            <span>Create Invoice</span>
                          </button>
                        )
                      )}
                    </td>
                    <td>
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Drawer */}
      {selectedCustomer && (
        <div className="drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="drawer" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="drawer-close"
              onClick={() => setSelected(null)}
              aria-label="Close customer details"
            >
              <X />
            </button>
            <span className="eyebrow">Customer details</span>
            <h2>{selectedCustomer.name}</h2>
            <p className="drawer-email">
              {selectedCustomer.email}
              {selectedCustomer.phone ? ` · ${selectedCustomer.phone}` : ""}
            </p>
            {selectedCustomer.company && (
              <p className="drawer-company">{selectedCustomer.company}</p>
            )}

            {/* Invoicing Section in Drawer */}
            <div className="drawer-block">
              <div className="flex items-center justify-between pb-1">
                <span className="eyebrow">Invoices & Billing</span>
                <button
                  type="button"
                  onClick={() => handleOpenInvoiceModalForCustomer(selectedCustomer)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#855e2e] hover:text-[#5c3e1a] cursor-pointer"
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
                          onClick={() => handleOpenInvoiceModalForCustomer(selectedCustomer, inv)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#d1d5db] hover:bg-[#f3f4f6] text-[11px] font-semibold text-[#374151] cursor-pointer"
                        >
                          {inv.status === "draft" ? "Edit" : "View"}
                        </button>

                        {/* Resend button if sent */}
                        {inv.status === "sent" && (
                          <button
                            type="button"
                            onClick={() => handleResendInvoiceDirectly(inv.id)}
                            title="Resend Invoice to client email"
                            className="p-1.5 rounded-lg bg-white border border-[#d1d5db] hover:bg-[#eff6ff] text-[#1e40af] cursor-pointer"
                          >
                            <RefreshCw size={12} />
                          </button>
                        )}

                        {/* Delete button: ONLY IF DRAFT */}
                        {inv.status === "draft" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteDraftDirectly(inv.id)}
                            title="Delete unsent draft"
                            className="p-1.5 rounded-lg bg-white border border-[#fecaca] hover:bg-[#fee2e2] text-[#dc2626] cursor-pointer"
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

            {/* Projects list */}
            <div className="drawer-block">
              <span className="eyebrow">Projects</span>
              {selectedCustomer.projects.map(project => (
                <div className="drawer-project" key={project.id}>
                  <div>
                    <b>{project.name}</b>
                    <small>{project.service}</small>
                  </div>
                  <div className="drawer-project-meta flex items-center gap-2.5">
                    <strong>{formatMoney(project.amount)}</strong>
                    <span className={`status ${project.status}`}>
                      {formatStatusLabel(project.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {selectedCustomer.notes && (
              <div className="drawer-block">
                <span className="eyebrow">Client notes</span>
                <p>{selectedCustomer.notes}</p>
              </div>
            )}

            <div className="drawer-actions">
              <a
                className="dark-button bg-[#000000] border-[#000000]"
                href={`mailto:${selectedCustomer.email}`}
              >
                Email customer <ArrowRight size={15} />
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
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
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
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
                      className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                    Email Address *
                  </label>
                  <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="olivia@sterling.com"
                      className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                    Phone Number
                  </label>
                  <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                    Company / Entity
                  </label>
                  <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                    <input
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Private Client / Organization"
                      className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0e8dc] pt-3 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#855e2e] block">
                  Initial Project & Engagement Scope
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                      Project Title
                    </label>
                    <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                      <input
                        value={formData.projectName}
                        onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                        placeholder="e.g. Royal Anniversary Gala"
                        className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                      Service Offering
                    </label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs text-[#191c1d] focus:border-[#855e2e] focus:outline-none"
                    >
                      {AVAILABLE_SERVICES.map(srv => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                      Contract Value ($)
                    </label>
                    <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={formData.amount}
                        onChange={e =>
                          setFormData({ ...formData, amount: Number(e.target.value) || 0 })
                        }
                        placeholder="50000"
                        className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                      Initial Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={e =>
                        setFormData({ ...formData, status: e.target.value as ProjectStatus })
                      }
                      className="w-full bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs text-[#191c1d] focus:border-[#855e2e] focus:outline-none"
                    >
                      <option value="pending">Pending (Awaiting Invoice/Deposit)</option>
                      <option value="active">Active (Production In Progress)</option>
                      <option value="completed">Completed (Archived)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0e8dc]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#ded5c8] text-xs font-semibold text-[#5c5f60] hover:bg-[#f5ede3] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#191c1d] hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Creating…</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Save & Create Customer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Editor & Live Preview Modal */}
      {showInvoiceModal && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setInvoiceModalCustomer(undefined);
            setInvoiceModalInvoice(undefined);
          }}
          onToast={msg => {
            if (onToast) onToast(msg);
          }}
          initialCustomer={invoiceModalCustomer}
          existingInvoice={invoiceModalInvoice}
          allCustomers={items}
          onInvoiceSaved={saved => {
            setInvoices(prev => {
              const idx = prev.findIndex(i => i.id === saved.id);
              if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = saved;
                return copy;
              }
              return [saved, ...prev];
            });
          }}
        />
      )}
    </section>
  );
}

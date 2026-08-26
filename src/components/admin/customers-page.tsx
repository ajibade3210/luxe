"use client";

import {
  Check,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
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

  // Send Message Modal State
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Resend Invoice Confirmation State
  const [confirmResendInvoice, setConfirmResendInvoice] = useState<Invoice | null>(null);

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

  // Open Message Modal with custom greeting
  const handleOpenMessageModal = (customer: Customer) => {
    setMessageText(
      `Dear ${customer.name},\n\nThank you for choosing Élan Atelier. We would love to follow up on your project details and ensure everything is progressing flawlessly.\n\nWarm regards,\nÉlan Atelier Team`
    );
    setShowSendMessageModal(true);
  };

  // Send WhatsApp message
  const handleSendWhatsAppMessage = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
    setShowSendMessageModal(false);
    if (onToast) onToast("WhatsApp consultation message prepared and opened.");
  };

  // Send Email message
  const handleSendEmailMessage = (email: string, name: string, text: string) => {
    const subject = encodeURIComponent(`Élan Atelier · Update for ${name}`);
    const body = encodeURIComponent(text);
    if (typeof window !== "undefined") {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
    setShowSendMessageModal(false);
    if (onToast) onToast(`Email dispatched to ${email}.`);
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
                  amount: c.totalRevenue || 0,
                  status: "pending" as ProjectStatus,
                };
                const cInvoices = invoices.filter(
                  inv => inv.customerId === c.id || inv.customerEmail === c.email
                );
                const hasSent = cInvoices.some(i => i.status === "sent" || i.status === "paid");
                const isPending = p.status === "pending";

                return (
                  <tr key={c.id} onClick={() => setSelected(c.id)} className="cursor-pointer">
                    <td>
                      <b>{c.name}</b>
                      <small>
                        {c.email}
                        {c.phone ? ` · ${c.phone}` : ""}
                      </small>
                    </td>
                    <td>
                      <b>{p.name}</b>
                      <small>{p.service}</small>
                    </td>
                    <td>
                      <span className="font-mono font-bold text-[#191c1d]">
                        {formatMoney(p.amount || c.totalRevenue || 0)}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${p.status}`}>{formatStatusLabel(p.status)}</span>
                    </td>
                    <td>
                      {cInvoices.length > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
                          {cInvoices.length === 1 ? (
                            <>
                              <Check size={11} />
                              <span>{hasSent ? "Invoice Sent" : "Draft Invoice"}</span>
                            </>
                          ) : (
                            <>
                              <FileText size={11} />
                              <span>{cInvoices.length} Invoices</span>
                            </>
                          )}
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
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#855e2e] hover:text-[#5c3e1a] cursor-pointer bg-[#faf7f2] hover:bg-[#f5eee3] px-2.5 py-1 rounded-lg border border-[#ded5c8] transition-colors"
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

                        {/* Resend button if sent (triggers confirmation prompt) */}
                        {inv.status === "sent" && (
                          <button
                            type="button"
                            onClick={() => setConfirmResendInvoice(inv)}
                            title="Resend invoice to customer"
                            className="p-1.5 rounded-lg bg-white border border-[#d1d5db] hover:bg-[#eff6ff] text-[#1e40af] hover:border-[#bfdbfe] transition-colors cursor-pointer"
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

            {/* Drawer Actions: Send Message Button */}
            <div className="drawer-actions">
              <button
                type="button"
                className="dark-button bg-[#111827] hover:bg-black border-[#111827] w-full justify-center"
                onClick={() => handleOpenMessageModal(selectedCustomer)}
              >
                <MessageSquare size={15} />
                <span>Send Message</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Send Message Modal */}
      {showSendMessageModal && selectedCustomer && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowSendMessageModal(false)}
        >
          <div
            className="bg-white border border-[#eae3d7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#f0e8dc]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
                  Client Communication
                </span>
                <h3 className="text-xl font-serif font-bold text-[#191c1d] tracking-tight mt-0.5">
                  Send Message
                </h3>
                <p className="text-xs text-[#5c5f60] mt-0.5">
                  Recipient: <b className="text-[#191c1d]">{selectedCustomer.name}</b>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSendMessageModal(false)}
                className="p-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Channels Availability Summary */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                  selectedCustomer.phone
                    ? "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]"
                    : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]"
                }`}
              >
                <MessageSquare size={12} />
                <span>
                  {selectedCustomer.phone
                    ? selectedCustomer.phone
                    : "No Phone (WhatsApp unavailable)"}
                </span>
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                  selectedCustomer.email
                    ? "bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]"
                    : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]"
                }`}
              >
                <Mail size={12} />
                <span>
                  {selectedCustomer.email ? selectedCustomer.email : "No Email (Email unavailable)"}
                </span>
              </span>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Message Content *
              </label>
              <textarea
                rows={5}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Type your bespoke message or client update here..."
                className="w-full bg-[#faf8f5] border border-[#ded7cb] rounded-2xl p-4 text-xs text-[#191c1d] focus:border-[#855e2e] focus:ring-1 focus:ring-[#855e2e] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Actions: WhatsApp or Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* WhatsApp Button */}
              <button
                type="button"
                disabled={!selectedCustomer.phone?.trim()}
                onClick={() => handleSendWhatsAppMessage(selectedCustomer.phone || "", messageText)}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  selectedCustomer.phone?.trim()
                    ? "bg-[#15803d] hover:bg-[#166534] text-white shadow-xs hover:-translate-y-0.5 cursor-pointer"
                    : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb] cursor-not-allowed opacity-60"
                }`}
              >
                <MessageSquare size={14} />
                <span>
                  {selectedCustomer.phone?.trim() ? "Send via WhatsApp" : "WhatsApp (No phone)"}
                </span>
              </button>

              {/* Email Button */}
              <button
                type="button"
                disabled={!selectedCustomer.email?.trim()}
                onClick={() =>
                  handleSendEmailMessage(selectedCustomer.email, selectedCustomer.name, messageText)
                }
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  selectedCustomer.email?.trim()
                    ? "bg-[#111827] hover:bg-black text-white shadow-xs hover:-translate-y-0.5 cursor-pointer"
                    : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb] cursor-not-allowed opacity-60"
                }`}
              >
                <Mail size={14} />
                <span>
                  {selectedCustomer.email?.trim() ? "Send via Email" : "Email (No email)"}
                </span>
              </button>
            </div>
          </div>
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
                className="p-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
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
                    Project / Event Scope
                  </label>
                  <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                    <input
                      value={formData.projectName}
                      onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                      placeholder="e.g. Lake Como 3-Day Wedding Gala"
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
                    Contract Value ($)
                  </label>
                  <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={formData.amount}
                      onChange={e =>
                        setFormData({ ...formData, amount: Number(e.target.value) || 0 })
                      }
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
                        setFormData({ ...formData, status: e.target.value as ProjectStatus })
                      }
                      className="w-full bg-transparent text-xs text-[#191c1d] focus:outline-none"
                    >
                      <option value="pending">Pending (Review / Invoicing)</option>
                      <option value="active">Active Project</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0e8dc]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
      )}

      {/* Invoice Modal for Customer Billing */}
      {showInvoiceModal && invoiceModalCustomer && (
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
        />
      )}

      {/* Resend Invoice Confirmation Modal */}
      {confirmResendInvoice && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setConfirmResendInvoice(null)}
        >
          <div
            className="bg-white border border-[#eae3d7] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#f0e8dc]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] block">
                  Invoice Re-Dispatch
                </span>
                <h3 className="text-lg font-serif font-bold text-[#191c1d] tracking-tight mt-0.5">
                  Resend Invoice {confirmResendInvoice.invoiceNumber}?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfirmResendInvoice(null)}
                className="p-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-[#5c5f60] space-y-2">
              <p>
                Are you sure you want to re-send this invoice to{" "}
                <b className="text-[#191c1d]">{confirmResendInvoice.customerName}</b>?
              </p>
              <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#eee7dc] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8c827a]">Recipient:</span>
                  <b className="text-[#191c1d]">{confirmResendInvoice.customerEmail}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c827a]">Total Due:</span>
                  <b className="font-mono text-[#191c1d]">
                    {formatMoney(confirmResendInvoice.total)}
                  </b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c827a]">Due Date:</span>
                  <span className="text-[#191c1d]">{confirmResendInvoice.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0e8dc]">
              <button
                type="button"
                onClick={() => setConfirmResendInvoice(null)}
                className="px-4 py-2 rounded-xl border border-[#ded7cb] text-xs font-semibold text-[#5c5f60] hover:bg-[#faf8f5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const inv = confirmResendInvoice;
                  setConfirmResendInvoice(null);
                  await handleResendInvoiceDirectly(inv.id);
                }}
                className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Confirm Resend</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

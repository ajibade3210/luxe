"use client";

import { ChevronLeft, ChevronRight, Download, FileText, Search, UserCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  convertLeadToCustomer,
  exportLeadsCSV,
  getInvoices,
  getLeads,
  type Invoice,
} from "@/lib/api";
import type { Customer, Lead } from "@/lib/types";
import { formatDate, formatMoney, formatStatusLabel, Metric, PageTitle } from "./admin-layout";
import { InvoiceModal } from "./invoices/invoice-modal";

export function LeadsPage({ onToast }: { onToast: (s: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isExporting, setIsExporting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Invoice Modal state when issuing invoice
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState<Customer | undefined>(undefined);
  const [invoiceModalInvoice, setInvoiceModalInvoice] = useState<Invoice | undefined>(undefined);

  useEffect(() => {
    getLeads(searchQuery).then(setItems);
    const handleLeadsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Lead[]>;
      if (customEvent.detail) {
        setItems(customEvent.detail);
      }
    };
    window.addEventListener("luxe_leads_updated", handleLeadsUpdate);
    return () => window.removeEventListener("luxe_leads_updated", handleLeadsUpdate);
  }, [searchQuery]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    getLeads(val).then(setItems);
  };

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await exportLeadsCSV();
      onToast(`Lead inquiries list exported successfully (${res.count} records).`);
    } catch {
      onToast("Failed to export leads list.");
    } finally {
      setIsExporting(false);
    }
  };

  // 1. Convert to Customer (Moves lead out of lead register to customer register)
  const handleConvertToCustomer = async (leadId: string) => {
    setIsConverting(true);
    try {
      const { customer } = await convertLeadToCustomer(leadId);
      // Remove lead from active lead register
      setItems(prev => prev.filter(l => l.id !== leadId));
      setSelected(null);
      onToast(`Lead converted to customer and moved to customer register: ${customer.name}.`);
    } catch {
      onToast("Failed to convert lead to customer.");
    } finally {
      setIsConverting(false);
    }
  };

  // 2. Issue Invoice for Lead (Overrides and replaces previous invoice for this lead)
  const handleIssueInvoice = async (lead: Lead) => {
    const allInvoices = await getInvoices();
    const existing = allInvoices.find(
      inv => inv.customerId === lead.id || inv.customerEmail === lead.email
    );

    const tempCustomer: Customer = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: "",
      totalRevenue: lead.budget || 25000,
      projects: [
        {
          id: `p-${Date.now()}`,
          customerId: lead.id,
          name: lead.service ? `${lead.service} Production` : "Studio Project",
          service: lead.service || "Bespoke Styling",
          amount: lead.budget || 25000,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };
    setInvoiceCustomer(tempCustomer);
    setInvoiceModalInvoice(existing);
    setShowInvoiceModal(true);
  };

  const selectedLead = items.find(l => l.id === selected);
  const metrics = useMemo(
    () => ({
      total: items.length,
      newToday: items.filter(l => l.status === "new").length,
      conversion: Math.round(
        (items.filter(l => l.status === "converted").length / (items.length || 1)) * 100
      ),
    }),
    [items]
  );

  return (
    <section className="content">
      <PageTitle
        eyebrow="Relationship management"
        title="Leads & inquiries"
        description="A considered view of every client opportunity."
        action={
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#ded5c8] hover:border-[#855e2e] px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <Download size={14} className={isExporting ? "animate-bounce" : ""} />
            <span>{isExporting ? "Exporting..." : "Export List"}</span>
          </button>
        }
      />

      <div className="metrics">
        <Metric
          label="Total leads"
          value={String(metrics.total).padStart(2, "0")}
          detail="All time"
        />
        <Metric
          label="New today"
          value={String(metrics.newToday).padStart(2, "0")}
          detail="Needs attention"
        />
        <Metric label="Conversion rate" value={`${metrics.conversion}%`} detail="Last 30 days" />
      </div>

      <div className="table-card">
        <div className="table-head">
          <h2>Recent inquiries</h2>
          <div className="table-search-box">
            <Search size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Service requested</th>
                <th>Event date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map(lead => (
                <tr key={lead.id} onClick={() => setSelected(lead.id)} className="cursor-pointer">
                  <td>
                    <b>{lead.name}</b>
                    <small>{lead.email}</small>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <span className="font-semibold text-[#191c1d]">{lead.service}</span>
                      {lead.services && lead.services.length > 1 && (
                        <span
                          className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-[#f4ece1] text-[#855e2e] font-mono font-bold shrink-0"
                          title={`${lead.services.length} requested services/scopes`}
                        >
                          +{lead.services.length - 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(lead.eventDate)}</td>
                  <td>
                    <span className={`status ${lead.status}`}>
                      {formatStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td>
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#f0e8dc] bg-[#fdfbf7] text-xs text-[#5c5f60] rounded-b-3xl">
          <div className="flex items-center gap-2">
            <span>
              Showing <b className="text-[#191c1d]">{items.length === 0 ? 0 : startIndex + 1}</b>–
              <b className="text-[#191c1d]">{Math.min(startIndex + pageSize, items.length)}</b> of{" "}
              <b className="text-[#191c1d]">{items.length}</b> records
            </span>
            <div className="hidden sm:flex items-center gap-1.5 ml-3 border-l border-[#ded7cb] pl-3">
              <span className="text-[11px] text-[#8c827a]">Per page:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#ded7cb] rounded-lg px-2 py-0.5 text-xs text-[#191c1d] focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded7cb] bg-white text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={13} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    page === currentPage
                      ? "bg-[#191c1d] text-white shadow-2xs"
                      : "bg-white border border-[#ded7cb] text-[#5c5f60] hover:bg-[#faf8f5] hover:text-[#191c1d]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded7cb] bg-white text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="drawer" onClick={e => e.stopPropagation()}>
            <button type="button" className="drawer-close" onClick={() => setSelected(null)}>
              <X />
            </button>
            <span className="eyebrow">Inquiry details</span>
            <h2>{selectedLead.name}</h2>
            <p className="drawer-email">
              {selectedLead.email} · {selectedLead.phone || "No phone provided"}
            </p>

            <div className="detail-grid">
              <div>
                <span className="eyebrow">Primary service</span>
                <b>{selectedLead.service}</b>
              </div>
              <div>
                <span className="eyebrow">Event date</span>
                <b>{formatDate(selectedLead.eventDate)}</b>
              </div>
              <div>
                <span className="eyebrow">Budget</span>
                <b>{formatMoney(selectedLead.budget || 0)}</b>
              </div>
              <div>
                <span className="eyebrow">Status</span>
                <b>{formatStatusLabel(selectedLead.status)}</b>
              </div>
            </div>

            {/* Services Scope List if multiple */}
            {selectedLead.services && selectedLead.services.length > 0 && (
              <div className="drawer-block">
                <span className="eyebrow">
                  Requested Services & Scopes ({selectedLead.services.length})
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {selectedLead.services.map(svc => (
                    <span
                      key={svc}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#faf8f5] border border-[#ded7cb] text-[#191c1d]"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <blockquote>{selectedLead.message}</blockquote>

            <div className="drawer-actions space-y-2">
              {/* Button 1: Convert to Customer (Moves lead to customer register) */}
              <button
                type="button"
                disabled={isConverting}
                className="dark-button bg-[#111827] hover:bg-black border-[#111827] w-full justify-center disabled:opacity-50"
                onClick={() => handleConvertToCustomer(selectedLead.id)}
              >
                <UserCheck size={14} />
                <span>{isConverting ? "Converting..." : "Convert to Customer"}</span>
              </button>

              {/* Button 2: Issue Invoice */}
              <button
                type="button"
                className="outline-button w-full justify-center"
                onClick={() => handleIssueInvoice(selectedLead)}
              >
                <FileText size={14} />
                <span>Issue Invoice</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && invoiceCustomer && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setInvoiceCustomer(undefined);
            setInvoiceModalInvoice(undefined);
          }}
          onToast={onToast}
          initialCustomer={invoiceCustomer}
          existingInvoice={invoiceModalInvoice}
        />
      )}
    </section>
  );
}

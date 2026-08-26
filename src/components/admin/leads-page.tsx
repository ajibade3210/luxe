"use client";

import { ChevronRight, Download, FileText, UserCheck, X } from "lucide-react";
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
  const [isExporting, setIsExporting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Invoice Modal state when issuing invoice
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState<Customer | undefined>(undefined);
  const [invoiceModalInvoice, setInvoiceModalInvoice] = useState<Invoice | undefined>(undefined);

  useEffect(() => {
    getLeads().then(setItems);
    const handleLeadsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Lead[]>;
      if (customEvent.detail) {
        setItems(customEvent.detail);
      }
    };
    window.addEventListener("luxe_leads_updated", handleLeadsUpdate);
    return () => window.removeEventListener("luxe_leads_updated", handleLeadsUpdate);
  }, []);

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
          <span>{items.length} records</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Event date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(lead => (
                <tr key={lead.id} onClick={() => setSelected(lead.id)} className="cursor-pointer">
                  <td>
                    <b>{lead.name}</b>
                    <small>{lead.email}</small>
                  </td>
                  <td>{lead.service}</td>
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
                <span className="eyebrow">Service</span>
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

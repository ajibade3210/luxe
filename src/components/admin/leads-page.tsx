"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { useLeads } from "@/hooks/use-leads";
import { getInvoices, type Invoice } from "@/lib/api";
import type { Customer, Lead } from "@/types";
import { Metric, PageTitle, useAdminToast } from "./admin-layout";
import { InvoiceModal } from "./invoices/invoice-modal";
import { LeadDetailDrawer } from "./leads/lead-detail-drawer";
import { LeadMessageModal } from "./leads/lead-message-modal";
import { LeadTable } from "./leads/lead-table";

export function LeadsPage({ onToast }: { onToast?: (s: string) => void }) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;

  const {
    items,
    setSelectedLeadId,
    selectedLead,
    searchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    paginatedItems,
    isExporting,
    isConverting,
    metrics,
    handleSearch,
    handleExport,
    handleConvertToCustomer,
    handleUpdateStatus,
  } = useLeads(notify);

  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState<Customer | undefined>(undefined);
  const [invoiceModalInvoice, setInvoiceModalInvoice] = useState<Invoice | undefined>(undefined);

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
      services: [
        {
          id: `svc-${Date.now()}`,
          customerId: lead.id,
          name: lead.service ? `${lead.service} Production` : "Bespoke Service",
          service: lead.service || "Bespoke Styling",
          amount: lead.budget || 25000,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setInvoiceCustomer(tempCustomer);
    setInvoiceModalInvoice(existing);
    setShowInvoiceModal(true);

    if (lead.status === "new") {
      handleUpdateStatus(lead.id, "contacted");
    }
  };

  const handleSendWhatsAppMessage = async (lead: Lead, phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
    setShowSendMessageModal(false);
    await handleUpdateStatus(lead.id, "contacted");
    notify("Message prepared via WhatsApp. Lead status updated to Contacted.");
  };

  const handleSendEmailMessage = async (lead: Lead, email: string, name: string, text: string) => {
    const subject = encodeURIComponent(`Élan Atelier · Consultation for ${name}`);
    const body = encodeURIComponent(text);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    if (typeof window !== "undefined") {
      window.location.href = mailtoUrl;
    }
    setShowSendMessageModal(false);
    await handleUpdateStatus(lead.id, "contacted");
    notify("Consultation email prepared. Lead status updated to Contacted.");
  };

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
            <span>{isExporting ? "Exporting..." : "Export"}</span>
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

      <LeadTable
        items={items}
        paginatedItems={paginatedItems}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onSelectLead={setSelectedLeadId}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        startIndex={startIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <LeadDetailDrawer
        lead={selectedLead}
        isConverting={isConverting}
        onClose={() => setSelectedLeadId(null)}
        onOpenMessageModal={() => setShowSendMessageModal(true)}
        onConvertToCustomer={handleConvertToCustomer}
        onIssueInvoice={handleIssueInvoice}
      />

      <LeadMessageModal
        isOpen={showSendMessageModal}
        lead={selectedLead}
        onClose={() => setShowSendMessageModal(false)}
        onSendWhatsApp={handleSendWhatsAppMessage}
        onSendEmail={handleSendEmailMessage}
      />

      {showInvoiceModal && invoiceCustomer && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setInvoiceCustomer(undefined);
            setInvoiceModalInvoice(undefined);
          }}
          onToast={notify}
          initialCustomer={invoiceCustomer}
          existingInvoice={invoiceModalInvoice}
        />
      )}
    </section>
  );
}

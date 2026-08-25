"use client";

import { ArrowRight, Check, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getLeads, updateLeadStatus } from "@/lib/api";
import type { Lead, LeadStatus } from "@/lib/types";
import { formatDate, formatMoney, formatStatusLabel, Metric, PageTitle } from "./admin-layout";

export function LeadsPage({ onToast }: { onToast: (s: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<Lead[]>([]);

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
          <button className="outline-button">
            Export list <ArrowRight size={14} />
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
                <tr key={lead.id} onClick={() => setSelected(lead.id)}>
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
      {selectedLead && (
        <div className="drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="drawer" onClick={e => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setSelected(null)}>
              <X />
            </button>
            <span className="eyebrow">Inquiry details</span>
            <h2>{selectedLead.name}</h2>
            <p className="drawer-email">
              {selectedLead.email} · {selectedLead.phone}
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
            <div className="drawer-actions">
              <button
                className="dark-button bg-[#000000] border-[#000000]"
                onClick={async () => {
                  await updateLeadStatus(selectedLead.id, "contacted");
                  setItems(
                    items.map(x => (x.id === selectedLead.id ? { ...x, status: "contacted" } : x))
                  );
                  onToast("Lead marked as contacted");
                }}
              >
                Mark contacted <Check size={15} />
              </button>
              <button
                className="outline-button"
                onClick={async () => {
                  await updateLeadStatus(selectedLead.id, "converted");
                  setItems(
                    items.map(x =>
                      x.id === selectedLead.id ? { ...x, status: "converted" as LeadStatus } : x
                    )
                  );
                  onToast("Lead converted to customer");
                }}
              >
                Convert to customer
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

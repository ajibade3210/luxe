"use client";

import { Mail, MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Lead } from "@/lib/types";

interface LeadMessageModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSendWhatsApp: (lead: Lead, phone: string, text: string) => void;
  onSendEmail: (lead: Lead, email: string, name: string, text: string) => void;
}

export function LeadMessageModal({
  isOpen,
  lead,
  onClose,
  onSendWhatsApp,
  onSendEmail,
}: LeadMessageModalProps) {
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (lead) {
      setMessageText(
        `Dear ${lead.name},\n\nThank you for reaching out to Élan Atelier regarding your upcoming ${lead.service || "event"}.\n\nWe would love to schedule a consultation to discuss your vision and curate a bespoke proposal.\n\nWarm regards,\nÉlan Atelier Team`
      );
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#eae3d7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#f0e8dc]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
              Inquiry Follow-up
            </span>
            <h3 className="text-xl font-serif font-bold text-[#191c1d] tracking-tight mt-0.5">
              Send Message
            </h3>
            <p className="text-xs text-[#5c5f60] mt-0.5">
              Recipient: <b className="text-[#191c1d]">{lead.name}</b>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
            aria-label="Close message modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Channels Availability */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              lead.phone
                ? "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]"
            }`}
          >
            <MessageSquare size={12} />
            <span>{lead.phone ? lead.phone : "No Phone (WhatsApp unavailable)"}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              lead.email
                ? "bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]"
            }`}
          >
            <Mail size={12} />
            <span>{lead.email ? lead.email : "No Email (Email unavailable)"}</span>
          </span>
        </div>

        {/* Message Content */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
            Message Content *
          </label>
          <textarea
            rows={5}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type your bespoke message or consultation reply here..."
            className="w-full bg-[#faf8f5] border border-[#ded7cb] rounded-2xl p-4 text-xs text-[#191c1d] focus:border-[#855e2e] focus:ring-1 focus:ring-[#855e2e] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={!lead.phone?.trim()}
            onClick={() => onSendWhatsApp(lead, lead.phone || "", messageText)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              lead.phone?.trim()
                ? "bg-[#15803d] hover:bg-[#166534] text-white shadow-xs hover:-translate-y-0.5 cursor-pointer"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb] cursor-not-allowed opacity-60"
            }`}
            title={
              lead.phone?.trim()
                ? "Open in WhatsApp and mark as Contacted"
                : "Phone number required for WhatsApp"
            }
          >
            <MessageSquare size={14} />
            <span>Send WhatsApp</span>
          </button>

          <button
            type="button"
            disabled={!lead.email?.trim()}
            onClick={() => onSendEmail(lead, lead.email, lead.name, messageText)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              lead.email?.trim()
                ? "bg-[#1e40af] hover:bg-[#1e3a8a] text-white shadow-xs hover:-translate-y-0.5 cursor-pointer"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb] cursor-not-allowed opacity-60"
            }`}
            title={lead.email?.trim() ? "Send via Email and mark as Contacted" : "Email required"}
          >
            <Mail size={14} />
            <span>Send Email</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/shared";
import type { Customer } from "@/types";

interface CustomerMessageModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onToast?: (message: string) => void;
}

export function CustomerMessageModal({
  isOpen,
  customer,
  onClose,
  onToast,
}: CustomerMessageModalProps) {
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (customer) {
      setMessageText(
        `Dear ${customer.name},\n\nThank you for choosing Élan Atelier. We would love to follow up on your project details and ensure everything is progressing flawlessly.\n\nWarm regards,\nÉlan Atelier Team`
      );
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleSendWhatsAppMessage = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
    onClose();
    onToast?.("WhatsApp consultation message prepared and opened.");
  };

  const handleSendEmailMessage = (email: string, name: string, text: string) => {
    const subject = encodeURIComponent(`Élan Atelier · Update for ${name}`);
    const body = encodeURIComponent(text);
    if (typeof window !== "undefined") {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
    onClose();
    onToast?.(`Email dispatched to ${email}.`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#eae3d7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#f0e8dc]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
              Client Communication
            </span>
            <h3 className="text-xl font-serif font-bold text-[#191c1d] tracking-tight mt-0.5">
              Send Message
            </h3>
            <p className="text-xs text-[#5c5f60] mt-0.5">
              Recipient: <b className="text-[#191c1d]">{customer.name}</b>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              customer.phone
                ? "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]"
            }`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>{customer.phone ? customer.phone : "No Phone (WhatsApp unavailable)"}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              customer.email
                ? "bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]"
            }`}
          >
            <Mail size={12} />
            <span>{customer.email ? customer.email : "No Email (Email unavailable)"}</span>
          </span>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={!customer.phone?.trim()}
            onClick={() => handleSendWhatsAppMessage(customer.phone || "", messageText)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              customer.phone?.trim()
                ? "bg-[#15803d] hover:bg-[#166534] text-white shadow-xs hover:-translate-y-0.5 cursor-pointer"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb] cursor-not-allowed opacity-60"
            }`}
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>{customer.phone?.trim() ? "Send via WhatsApp" : "WhatsApp (No phone)"}</span>
          </button>

          <button
            type="button"
            disabled={!customer.email?.trim()}
            onClick={() => handleSendEmailMessage(customer.email, customer.name, messageText)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              customer.email?.trim()
                ? "bg-[#111827] hover:bg-black text-white shadow-xs hover:-translate-y-0.5 cursor-pointer"
                : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb] cursor-not-allowed opacity-60"
            }`}
          >
            <Mail size={14} />
            <span>{customer.email?.trim() ? "Send via Email" : "Email (No email)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

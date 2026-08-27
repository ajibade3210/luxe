import { Send, X } from "lucide-react";
import type { ConsultationModalProps } from "@/types";

export function ConsultationModal({
  isOpen,
  onClose,
  profile,
  quoteForm,
  setQuoteForm,
  quoteSubmitting,
  onSubmit,
  primaryColor,
  buttonColor,
  radiusClass,
}: ConsultationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#171716]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#e5dcd1] rounded-3xl max-w-lg w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#78716c] hover:text-[#1c1917] p-1 cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span
            style={{ color: primaryColor }}
            className="text-[10px] uppercase tracking-[0.18em] font-semibold"
          >
            Inquiry Desk
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal mt-1">
            Book a Consultation
          </h3>
          <p className="text-xs text-[#78716c] mt-1">
            Tell {profile.businessName} about your project, order, or service inquiry.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#4a443e] font-medium mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Folashade Adeleke"
              value={quoteForm.name}
              onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
              className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#1f2937] font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="folashade@example.com"
                value={quoteForm.email}
                onChange={e => setQuoteForm({ ...quoteForm, email: e.target.value })}
                className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
              />
            </div>

            <div>
              <label className="block text-[#1f2937] font-medium mb-1">WhatsApp</label>
              <input
                type="tel"
                placeholder="+234 800 000 0000"
                value={quoteForm.phone}
                onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#1f2937] font-medium mb-1">Service Needed</label>
              <select
                value={quoteForm.service}
                onChange={e => setQuoteForm({ ...quoteForm, service: e.target.value })}
                className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
              >
                {(profile.services || []).map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1f2937] font-medium mb-1">Estimated Date</label>
              <input
                type="date"
                value={quoteForm.eventDate}
                onChange={e => setQuoteForm({ ...quoteForm, eventDate: e.target.value })}
                className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1f2937] font-medium mb-1">Order Details</label>
            <textarea
              rows={3}
              placeholder="Share details about your requirements, timeline, quantity, or aesthetic preferences..."
              value={quoteForm.message}
              onChange={e => setQuoteForm({ ...quoteForm, message: e.target.value })}
              className="w-full bg-white border border-[#e5e7eb] rounded p-3.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={quoteSubmitting}
              style={{ backgroundColor: buttonColor }}
              className={`w-full text-white text-xs font-medium py-3.5 shadow-sm hover:brightness-95 transition-all cursor-pointer flex items-center justify-center gap-2 ${radiusClass}`}
            >
              {quoteSubmitting ? (
                <span>Submitting inquiry...</span>
              ) : (
                <>
                  <span>Submit Consultation Request</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

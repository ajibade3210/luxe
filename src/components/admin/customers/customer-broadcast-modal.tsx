import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Image as ImageIcon,
  Mail,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/shared";
import {
  BROADCAST_LIMITS,
  createEmailBroadcastMailto,
  createWhatsAppBroadcastUrl,
  createWhatsAppDirectUrl,
  sendBroadcast,
} from "@/services/api/broadcast.service";
import type { BroadcastChannel, CustomerBroadcastModalProps } from "@/types";

export function CustomerBroadcastModal({
  isOpen,
  selectedCustomers,
  onClose,
  onToast,
}: CustomerBroadcastModalProps) {
  const [channel, setChannel] = useState<BroadcastChannel>("whatsapp");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const totalCount = selectedCustomers.length;
  const withPhone = selectedCustomers.filter(c => c.phone && c.phone.trim().length > 0);
  const withEmail = selectedCustomers.filter(c => c.email && c.email.trim().length > 0);

  const maxLength =
    channel === "email"
      ? BROADCAST_LIMITS.EMAIL_MAX_LENGTH
      : channel === "whatsapp"
        ? BROADCAST_LIMITS.WHATSAPP_MAX_LENGTH
        : BROADCAST_LIMITS.BOTH_MAX_LENGTH;

  useEffect(() => {
    if (isOpen) {
      setSubject("Exclusive Studio Update · Élan Atelier");
      setMessage(
        "Dear Esteemed Client,\n\nWe are pleased to share our latest seasonal atelier updates and upcoming event milestones.\n\nWarm regards,\nÉlan Atelier Team"
      );
      setImageUrl("");
      setShowQueue(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const remainingChars = maxLength - message.length;
  const isOverLimit = remainingChars < 0;

  const handleExecuteBroadcast = async () => {
    if (totalCount === 0) {
      onToast?.("Please select at least one customer to broadcast to.");
      return;
    }

    if (!message.trim()) {
      onToast?.("Please compose a message before broadcasting.");
      return;
    }

    if (isOverLimit) {
      onToast?.(`Message exceeds the ${maxLength} character limit for ${channel}.`);
      return;
    }

    if ((channel === "email" || channel === "both") && !subject.trim()) {
      onToast?.("Please provide a subject line for email delivery.");
      return;
    }

    try {
      setIsSubmitting(true);

      await sendBroadcast({
        channel,
        customerIds: selectedCustomers.map(c => c.id),
        message: message.trim(),
        subject: subject.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });

      if (channel === "whatsapp" || channel === "both") {
        const waUrl = createWhatsAppBroadcastUrl(message.trim(), imageUrl.trim() || undefined);
        if (typeof window !== "undefined") {
          window.open(waUrl, "_blank");
        }
      }

      if (channel === "email" || channel === "both") {
        const emails = withEmail.map(c => c.email);
        if (emails.length > 0) {
          const mailtoUrl = createEmailBroadcastMailto(
            emails,
            subject.trim(),
            message.trim(),
            imageUrl.trim() || undefined
          );
          if (typeof window !== "undefined") {
            window.location.href = mailtoUrl;
          }
        }
      }

      onToast?.(
        `Broadcast dispatched to ${totalCount} client${totalCount === 1 ? "" : "s"} via ${channel.toUpperCase()}.`
      );
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to execute broadcast";
      onToast?.(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#eee7dc] rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-xl space-y-5 relative max-h-[90vh] overflow-y-auto font-sans"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#f0e8dc]">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#191c1d] tracking-tight">
              Broadcast Message
            </h3>
            <p className="text-xs text-[#747878] mt-0.5 font-medium">
              Targeting {totalCount} active customer{totalCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e9192] hover:text-[#191c1d] hover:bg-[#faf8f5] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#faf8f5] text-[#855e2e] border border-[#e8ded1]">
            <span>{totalCount} Selected Active</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
              withPhone.length > 0
                ? "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]"
                : "bg-[#faf8f5] text-[#8c827a] border border-[#e8ded1]"
            }`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>{withPhone.length} WhatsApp numbers</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
              withEmail.length > 0
                ? "bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]"
                : "bg-[#faf8f5] text-[#8c827a] border border-[#e8ded1]"
            }`}
          >
            <Mail size={13} />
            <span>{withEmail.length} Email addresses</span>
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#747878] uppercase tracking-wider block">
            Select Broadcast Channel
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setChannel("whatsapp")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                channel === "whatsapp"
                  ? "bg-[#ecfdf5] text-[#065f46] border-[#10b981] font-semibold"
                  : "bg-white text-[#5c5f60] border-[#ded7cb] hover:bg-[#faf8f5]"
              }`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                channel === "email"
                  ? "bg-[#eff6ff] text-[#1e40af] border-[#3b82f6] font-semibold"
                  : "bg-white text-[#5c5f60] border-[#ded7cb] hover:bg-[#faf8f5]"
              }`}
            >
              <Mail size={13} />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel("both")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                channel === "both"
                  ? "bg-[#faf5ee] text-[#855e2e] border-[#855e2e] font-semibold"
                  : "bg-white text-[#5c5f60] border-[#ded7cb] hover:bg-[#faf8f5]"
              }`}
            >
              <Send size={13} />
              <span>Both (WA + Email)</span>
            </button>
          </div>
        </div>

        {(channel === "email" || channel === "both") && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#747878] uppercase tracking-wider block">
              Email Subject Line <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Autumn Gala Atelier Invitations"
              className="w-full px-3.5 py-2.5 bg-white border border-[#ded7cb] rounded-xl text-xs text-[#191c1d] focus:outline-none transition-colors"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#747878] uppercase tracking-wider block">
            Media Attachment / Image Link{" "}
            <span className="text-[#8c827a] font-normal lowercase">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-white border border-[#ded7cb] rounded-xl overflow-hidden transition-colors shadow-2xs">
              <span className="pl-3.5 pr-2 text-[#8c827a] flex items-center justify-center shrink-0">
                <ImageIcon size={15} />
              </span>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://cdn.example.com/invitation-card.jpg"
                className="w-full py-2.5 pr-3.5 bg-transparent border-0 text-xs text-[#191c1d] focus:outline-none placeholder:text-[#9ca3af]"
              />
            </div>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="px-3 py-2.5 text-xs font-semibold text-[#8c827a] hover:text-red-500 rounded-xl border border-[#ded7cb] hover:bg-[#faf8f5] cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          {imageUrl && (
            <div className="mt-2 p-2 bg-[#faf8f5] border border-[#ded7cb] rounded-xl flex items-center gap-3">
              <img
                src={imageUrl}
                alt="Attachment preview"
                className="w-12 h-12 object-cover rounded-lg border border-[#e0d5c4]"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/100x100?text=Preview";
                }}
              />
              <span className="text-[11px] text-[#5c5f60] truncate flex-1">{imageUrl}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#747878] uppercase tracking-wider block">
              Broadcast Message Copy
            </label>
            <span
              className={`text-[11px] font-mono font-semibold ${
                isOverLimit
                  ? "text-red-600 font-bold"
                  : remainingChars < 50
                    ? "text-amber-600"
                    : "text-[#8c827a]"
              }`}
            >
              {message.length} / {maxLength} chars ({remainingChars} left)
            </span>
          </div>

          <textarea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={`w-full p-3.5 bg-white border rounded-xl text-xs text-[#191c1d] focus:outline-none transition-colors leading-relaxed ${
              isOverLimit ? "border-red-500 focus:border-red-500" : "border-[#ded7cb]"
            }`}
            placeholder="Type your bespoke broadcast message here..."
          />

          {isOverLimit && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
              <AlertCircle size={13} />
              <span>
                Message exceeds the {maxLength} character limit for {channel}. Please shorten your
                copy.
              </span>
            </div>
          )}
        </div>

        {channel === "whatsapp" && withPhone.length > 0 && (
          <div className="pt-1 border-t border-[#f4eee6]">
            <button
              type="button"
              onClick={() => setShowQueue(prev => !prev)}
              className="text-xs font-semibold text-[#855e2e] hover:underline cursor-pointer flex items-center justify-between w-full py-1"
            >
              <span>View Individual 1-by-1 WhatsApp Dispatches ({withPhone.length})</span>
              {showQueue ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showQueue && (
              <div className="mt-2 max-h-36 overflow-y-auto p-2 bg-[#faf8f5] border border-[#ded7cb] rounded-xl space-y-1.5">
                {withPhone.map(cust => (
                  <div
                    key={cust.id}
                    className="flex items-center justify-between px-3 py-2 bg-white border border-[#eee7dc] rounded-lg text-xs"
                  >
                    <div>
                      <b className="text-[#191c1d] font-semibold">{cust.name}</b>
                      <span className="text-[#747878] ml-2">{cust.phone}</span>
                    </div>
                    <a
                      href={createWhatsAppDirectUrl(
                        cust.phone || "",
                        message,
                        imageUrl || undefined
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#047857] bg-[#ecfdf5] hover:bg-[#d1fae5] px-2.5 py-1 rounded-md transition-colors"
                    >
                      <span>Send Direct</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0e8dc]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#ded7cb] text-xs font-semibold text-[#5c5f60] hover:bg-[#faf8f5] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecuteBroadcast}
            disabled={isSubmitting || isOverLimit || totalCount === 0 || !message.trim()}
            className="inline-flex items-center gap-2 bg-[#191c1d] hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={13} className={isSubmitting ? "animate-spin" : ""} />
            <span>
              {isSubmitting
                ? "Broadcasting..."
                : `Broadcast to ${totalCount} Active Client${totalCount === 1 ? "" : "s"}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

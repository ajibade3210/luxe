import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
} from "lucide-react";
import type { BusinessProfile } from "@/lib/types";

interface StudioHighlightsCardProps {
  profile: BusinessProfile;
  totalCustomers?: number;
  setQuoteModalOpen: (v: boolean) => void;
  handleCopyLink: () => void;
  whatsAppLink: string;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export function StudioHighlightsCard({
  profile,
  totalCustomers = 0,
  setQuoteModalOpen,
  handleCopyLink,
  whatsAppLink,
  primaryColor,
  secondaryColor: _secondaryColor,
  buttonColor,
  radiusClass,
}: StudioHighlightsCardProps) {
  // Live Store Open / Closed Status computation
  const getStoreStatus = () => {
    if (profile.byAppointmentOnly) {
      return {
        isOpen: true,
        isAppointment: true,
        label: "By Appointment Only",
        dotColor: "bg-amber-500",
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200/80",
        detail: `${profile.operatingHours || "Mon–Sat"} · ${profile.timeFrom || "09:00 AM"} – ${profile.timeTo || "06:00 PM"}`,
      };
    }

    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat

    let isDayOpen = true;
    const hours = (profile.operatingHours || "Mon–Sat").toLowerCase();
    if (hours.includes("mon–fri") || hours.includes("mon-fri")) {
      isDayOpen = day >= 1 && day <= 5;
    } else if (hours.includes("mon–sat") || hours.includes("mon-sat")) {
      isDayOpen = day >= 1 && day <= 6;
    } else if (hours.includes("everyday")) {
      isDayOpen = true;
    }

    const parseTimeToMinutes = (timeStr: string): number => {
      if (!timeStr) return 0;
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return 0;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === "PM" && h < 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      return h * 60 + m;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const fromMinutes = parseTimeToMinutes(profile.timeFrom || "09:00 AM");
    const toMinutes = parseTimeToMinutes(profile.timeTo || "06:00 PM");

    const isTimeOpen = currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
    const isOpen = isDayOpen && isTimeOpen;

    if (isOpen) {
      return {
        isOpen: true,
        isAppointment: false,
        label: "Open Now",
        dotColor: "bg-emerald-500",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
        detail: `Open today until ${profile.timeTo || "06:00 PM"}`,
      };
    }

    return {
      isOpen: false,
      isAppointment: false,
      label: "Closed Now",
      dotColor: "bg-stone-400",
      badgeBg: "bg-stone-100 text-stone-700 border-stone-200/80",
      detail: `Opens ${profile.timeFrom || "09:00 AM"} (${profile.operatingHours || "Mon–Sat"})`,
    };
  };

  const status = getStoreStatus();
  const address = profile.physicalAddress || profile.location;
  const hasSubstantialCustomers = totalCustomers >= 10;

  return (
    <div className="bg-[#faf6f0] border border-[#e8dfd3] rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(40,30,20,0.06)] flex flex-col justify-between max-w-[480px] w-full h-[580px]">
      <div className="space-y-4 sm:space-y-5">
        {/* Top Row: Verified Business Assurance Badge & Client Metric */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e2d5c5] shadow-2xs">
            <ShieldCheck size={14} className="text-[#0058be]" />
            <span className="text-[11px] font-semibold text-[#1c1917] tracking-wide">
              Verified Atelier
            </span>
          </div>

          {hasSubstantialCustomers && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e2d5c5] shadow-2xs">
              <CheckCircle2 size={13} style={{ color: primaryColor }} />
              <span className="text-[11px] font-semibold text-[#1c1917]">
                {totalCustomers}+ Clients Served
              </span>
            </div>
          )}
        </div>

        {/* Live Operational Status Card */}
        <div className="bg-white border border-[#e8dfd3] rounded-2xl p-4 sm:p-4.5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {status.isOpen && (
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dotColor}`}
                  />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.dotColor}`}
                />
              </span>
              <span className="text-xs font-semibold text-[#1c1917]">{status.label}</span>
            </div>

            <span
              className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${status.badgeBg}`}
            >
              {status.isAppointment ? "Private Atelier" : profile.operatingHours || "Mon–Sat"}
            </span>
          </div>

          <div className="text-xs text-[#6b645c] flex items-center gap-2">
            <Clock3 size={13} className="text-[#8c8278] shrink-0" />
            <span>{status.detail}</span>
          </div>
        </div>

        {/* Contact Details Stack (Moved from Left Stationery Card) */}
        <div className="bg-white border border-[#e8dfd3] rounded-2xl p-4 sm:p-5 shadow-2xs divide-y divide-[#f0e8dc] text-xs">
          <div className="pb-2.5 flex items-center justify-between gap-3">
            <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
              <Clock3 size={14} style={{ color: primaryColor }} /> Operating Hours:
            </span>
            <span className="font-semibold text-[#1c1917] text-right">
              {profile.operatingHours}: {profile.timeFrom} – {profile.timeTo}
            </span>
          </div>

          {address && (
            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                <MapPin size={14} style={{ color: primaryColor }} /> Studio Flagship:
              </span>
              <span className="font-semibold text-[#1c1917] truncate max-w-[200px] text-right">
                {address}
              </span>
            </div>
          )}

          <div className="py-2.5 flex items-center justify-between gap-3">
            <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
              <Phone size={14} style={{ color: primaryColor }} /> WhatsApp Line:
            </span>
            <span className="font-mono font-semibold text-[#1c1917] text-right">
              {profile.whatsAppNumber || profile.phone}
            </span>
          </div>

          <div className="pt-2.5 flex items-center justify-between gap-3">
            <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
              <Mail size={14} style={{ color: primaryColor }} /> Studio Email:
            </span>
            <span className="font-semibold text-[#1c1917] truncate max-w-[190px] text-right">
              {profile.emailAddress || profile.email}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer (Moved from Left Stationery Card) */}
      <div className="pt-3 space-y-2.5 border-t border-[#ebd8ca]">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setQuoteModalOpen(true)}
            style={{ backgroundColor: buttonColor }}
            className={`text-white text-xs font-bold uppercase tracking-wider py-3.5 shadow-xs hover:brightness-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${radiusClass}`}
          >
            <span>Get a Quote</span>
            <ArrowRight size={13} />
          </button>

          <a
            href={whatsAppLink}
            target="_blank"
            rel="noreferrer"
            className={`bg-white hover:bg-[#faf6f0] text-[#1c1917] border border-[#d6c7b7] text-xs font-bold uppercase tracking-wider py-3.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${radiusClass}`}
          >
            <MessageCircle size={14} className="text-[#25D366]" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        <div className="flex items-center justify-center text-xs text-[#78716c]">
          <button
            type="button"
            onClick={handleCopyLink}
            style={{ color: primaryColor }}
            className="font-medium hover:underline flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Share2 size={13} />
            <span>Copy Profile Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}

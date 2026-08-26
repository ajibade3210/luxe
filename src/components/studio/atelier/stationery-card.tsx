import {
  ArrowRight,
  Check,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCw,
  Share2,
} from "lucide-react";
import type { BusinessProfile } from "@/lib/types";

interface StationeryCardProps {
  profile: BusinessProfile;
  slug?: string;
  isFlipped: boolean;
  setIsFlipped: (v: boolean) => void;
  setQuoteModalOpen: (v: boolean) => void;
  handleCopyLink: () => void;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  monogram: string;
  averageRating?: string | number;
  totalReviews?: number;
  whatsAppLink: string;
  radiusClass: string;
}

export function StationeryCard({
  profile,
  slug: _slug,
  isFlipped,
  setIsFlipped,
  setQuoteModalOpen,
  handleCopyLink,
  primaryColor,
  secondaryColor,
  buttonColor,
  monogram,
  averageRating: _averageRating,
  totalReviews: _totalReviews,
  whatsAppLink,
  radiusClass,
}: StationeryCardProps) {
  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="card-flip-container cursor-pointer select-none"
    >
      <div
        className={`card-flip-inner transition-transform duration-700 ${
          isFlipped ? "is-flipped" : ""
        }`}
      >
        {/* FRONT FACE: Luxury Minimalist Stationery Card */}
        <div className="card-face card-front rounded-3xl p-6 sm:p-8 bg-[#faf6f0] border border-[#e8dfd3] shadow-[0_12px_36px_rgba(40,30,20,0.06)] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Top Bar with Flip Button */}
          <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#5c544d] hover:text-[#1c1917] bg-transparent hover:bg-[#efe8de] px-3.5 py-1.5 rounded-full border border-[#d6c7b7] transition-all cursor-pointer shadow-2xs"
            >
              <RotateCw size={12} />
              <span className="font-medium text-[11px]">Flip Card</span>
            </button>
          </div>

          {/* Centered Identity: Logo, Business Name, Address */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div
              style={{
                backgroundColor: secondaryColor,
                color: primaryColor,
                borderColor: primaryColor,
              }}
              className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 flex items-center justify-center font-serif text-7xl sm:text-8xl font-normal overflow-hidden shadow-sm shrink-0"
            >
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                monogram
              )}
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal leading-tight">
                {profile.businessName}
              </h2>
              <span className="text-xs uppercase tracking-[0.16em] text-[#8c8278] font-medium block">
                {profile.physicalAddress || profile.location}
              </span>
            </div>
          </div>
        </div>

        {/* BACK FACE: Studio Details & Concierge Desk */}
        <div className="card-face card-back rounded-3xl p-6 sm:p-8 bg-[#faf6f0] border border-[#e8dfd3] shadow-[0_12px_36px_rgba(40,30,20,0.06)] flex flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: secondaryColor,
                  color: primaryColor,
                  borderColor: primaryColor,
                }}
                className="w-10 h-10 rounded-full border flex items-center justify-center font-serif text-lg font-normal overflow-hidden shadow-2xs shrink-0"
              >
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt={profile.businessName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  monogram
                )}
              </div>
              <div>
                <div className="text-base font-serif font-semibold text-[#1c1917] leading-tight">
                  {profile.businessName}
                </div>
                <div className="text-[10px] text-[#8c8278] uppercase tracking-[0.14em] font-medium mt-0.5">
                  Studio Details & Concierge
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#5c544d] hover:text-[#1c1917] bg-transparent hover:bg-[#faf6f0] px-3.5 py-1.5 rounded-full border border-[#d6c7b7] transition-all cursor-pointer shadow-2xs active:scale-95 z-20"
            >
              <RotateCw size={12} />
              <span className="font-medium text-[11px]">Return to Front</span>
            </button>
          </div>

          {/* Philosophy Quote */}
          <div className="my-3 pl-4 border-l-[3px] border-[#0058be] py-0.5">
            <p className="text-xs sm:text-[14px] text-[#191c1d] font-sans italic leading-relaxed">
              &ldquo;{profile.description}&rdquo;
            </p>
          </div>

          {/* Contact Details Stack */}
          <div className="border-t border-[#ebd8ca]/80 divide-y divide-[#ebd8ca]/70 text-xs my-1">
            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                <Clock3 size={15} style={{ color: primaryColor }} /> Operating Hours:
              </span>
              <span className="font-semibold text-[#1c1917] text-right">
                {profile.operatingHours}: {profile.timeFrom} – {profile.timeTo}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                <MapPin size={15} style={{ color: primaryColor }} /> Studio Flagship:
              </span>
              <span className="font-semibold text-[#1c1917] truncate max-w-[220px] text-right">
                {profile.physicalAddress || profile.location}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                <Phone size={15} style={{ color: primaryColor }} /> WhatsApp Line:
              </span>
              <span className="font-mono font-semibold text-[#1c1917] text-right">
                {profile.whatsAppNumber || profile.phone}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                <Mail size={15} style={{ color: primaryColor }} /> Studio Email:
              </span>
              <span className="font-semibold text-[#1c1917] truncate max-w-[200px] text-right">
                {profile.emailAddress || profile.email}
              </span>
            </div>
          </div>

          {/* Verification Banner */}
          <div className="bg-[#faf6f0] border border-[#ebd8ca] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs my-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#1c1917]">
              <div
                style={{ backgroundColor: primaryColor }}
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
              >
                <Check size={11} strokeWidth={3} />
              </div>
              <span>Verified Shopwus Studio</span>
            </div>
            <span className="font-mono text-[11px] text-[#78716c] uppercase">
              ID: {profile.slug?.toUpperCase() || "ELAN-EVENTS"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5 z-10">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setQuoteModalOpen(true);
                }}
                style={{ backgroundColor: buttonColor }}
                className={`text-white text-xs font-bold uppercase tracking-wider py-3 shadow-xs hover:brightness-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${radiusClass}`}
              >
                <span>Get a Quote</span>
                <ArrowRight size={13} />
              </button>

              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                className={`bg-white hover:bg-[#faf6f0] text-[#1c1917] border border-[#d6c7b7] text-xs font-bold uppercase tracking-wider py-3 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${radiusClass}`}
              >
                <MessageCircle size={14} className="text-[#25D366]" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            <div className="flex items-center justify-center text-xs text-[#78716c] pt-1">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleCopyLink();
                }}
                style={{ color: primaryColor }}
                className="font-medium hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 size={13} />
                <span>Copy Profile Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

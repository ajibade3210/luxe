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
  Star,
} from "lucide-react";
import type { BusinessProfile } from "@/lib/types";
import { getSocialChannelStyle } from "./social-badge";

interface StationeryCardProps {
  profile: BusinessProfile;
  slug: string;
  isFlipped: boolean;
  setIsFlipped: (v: boolean) => void;
  setQuoteModalOpen: (v: boolean) => void;
  handleCopyLink: () => void;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  monogram: string;
  averageRating: string | number;
  totalReviews: number;
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
  averageRating,
  totalReviews,
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
        {/* FRONT FACE: Luxury Stationery Card */}
        <div className="card-face card-front relative rounded-3xl p-6 sm:p-8 bg-[#faf6f0] border border-[#e8dfd3] shadow-[0_12px_36px_rgba(40,30,20,0.06)] flex flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: secondaryColor,
                  color: primaryColor,
                  borderColor: primaryColor,
                }}
                className="w-12 h-12 rounded-full border flex items-center justify-center font-serif text-xl font-normal overflow-hidden shadow-2xs shrink-0"
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
                <h3 className="font-serif text-lg font-normal text-[#1c1917] leading-tight">
                  {profile.businessName}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#8c8278]">
                  {profile.location}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#5c544d] hover:text-[#1c1917] bg-transparent hover:bg-[#efe8de] px-3 py-1.5 rounded-full border border-[#d6c7b7] transition-all cursor-pointer shadow-2xs"
            >
              <RotateCw size={12} />
              <span className="font-medium text-[11px]">Flip Card</span>
            </button>
          </div>

          <div className="my-6 space-y-2">
            <span
              style={{ color: primaryColor }}
              className="text-[10px] uppercase tracking-[0.18em] font-semibold block"
            >
              Crest of Excellence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal leading-snug">
              {profile.tagline ||
                "We design unforgettable weddings, corporate galas, and private celebrations."}
            </h2>
          </div>

          <div className="pt-4 border-t border-[#ebd8ca] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex text-[#eab308]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <span className="font-semibold text-[#1c1917]">{averageRating}</span>
              <span className="text-[#8c8278]">({totalReviews} client reviews)</span>
            </div>

            <div className="flex items-center gap-2">
              {profile.socialChannels
                ?.filter(c => c.connected)
                .slice(0, 4)
                .map(channel => {
                  const style = getSocialChannelStyle(channel.type);
                  return (
                    <a
                      key={channel.id}
                      href={channel.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        backgroundColor: style.bg,
                        borderColor: style.border,
                        color: style.color,
                      }}
                      className="w-7 h-7 rounded-full border flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                      title={channel.label}
                    >
                      {style.icon}
                    </a>
                  );
                })}
            </div>
          </div>
        </div>

        {/* BACK FACE: Studio Details & Concierge Desk */}
        <div className="card-face card-back relative rounded-3xl p-6 sm:p-8 bg-[#faf6f0] border border-[#e8dfd3] shadow-[0_12px_36px_rgba(40,30,20,0.06)] flex flex-col justify-between overflow-hidden">
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

            <div className="flex items-center justify-between text-xs text-[#78716c] pt-1">
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

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-[#78716c] hover:text-[#1c1917] flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCw size={12} />
                <span>Flip back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Check, RotateCw } from "lucide-react";
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
  setQuoteModalOpen: _setQuoteModalOpen,
  handleCopyLink: _handleCopyLink,
  primaryColor,
  secondaryColor,
  buttonColor: _buttonColor,
  monogram,
  averageRating: _averageRating,
  totalReviews: _totalReviews,
  whatsAppLink: _whatsAppLink,
  radiusClass: _radiusClass,
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

          {/* Centered Identity: Logo and Business Name */}
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
            </div>
          </div>
        </div>

        {/* BACK FACE: Studio Vision & Atelier Statement */}
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
                  Studio Philosophy
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

          {/* Philosophy Statement */}
          <div className="my-auto py-6 px-4 border-l-2 border-[#d6c7b7]">
            <p className="text-sm sm:text-base text-[#1c1917] font-serif italic leading-relaxed">
              &ldquo;{profile.description}&rdquo;
            </p>
            {profile.tagline && (
              <span className="text-xs uppercase tracking-[0.16em] text-[#8c8278] font-medium block mt-4 font-sans">
                — {profile.tagline}
              </span>
            )}
          </div>

          {/* Verification Banner */}
          <div className="bg-white border border-[#ebd8ca] rounded-2xl px-5 py-3 flex items-center justify-between text-xs shadow-2xs">
            <div className="flex items-center gap-2 font-semibold text-[#1c1917]">
              <div
                style={{ backgroundColor: primaryColor }}
                className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-white text-[10px]"
              >
                <Check size={11} strokeWidth={3} />
              </div>
              <span>Verified Shopwus Studio</span>
            </div>
            <span className="font-mono text-[11px] text-[#78716c] uppercase">
              ID: {profile.slug?.toUpperCase() || "ELAN-EVENTS"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

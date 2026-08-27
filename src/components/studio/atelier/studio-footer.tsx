import Image from "next/image";
import Link from "next/link";
import type { StudioFooterProps } from "@/types";

const HOME_ROUTE = "/";

export function StudioFooter({
  profile,
  primaryColor,
  secondaryColor,
  monogram,
}: StudioFooterProps) {
  const hasSocials = profile.socialChannels?.some(c => c.connected);
  const hasPortfolio =
    profile.showPortfolio !== false && Boolean(profile.portfolio && profile.portfolio.length > 0);
  const hasServices =
    profile.showServices !== false && Boolean(profile.services && profile.services.length > 0);
  const hasReviews =
    profile.showReviews !== false && Boolean(profile.reviews && profile.reviews.length > 0);

  return (
    <footer className="bg-[#faf8f5] border-t border-[#e8dfd3] mt-24 py-14 text-xs text-[#78716c]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: secondaryColor,
              }}
              className="w-8 h-8 rounded-full border flex items-center justify-center font-serif text-base overflow-hidden shadow-2xs shrink-0"
            >
              {profile.logoUrl ? (
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  width={32}
                  height={32}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                monogram
              )}
            </div>
            <div>
              <div className="font-serif text-base text-[#1c1917] font-medium">
                {profile.businessName}
              </div>
              <div className="text-[10px] text-[#8c8278]">
                {profile.physicalAddress || profile.location}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#635c55]">
            {hasSocials && (
              <a href="#social" className="hover:text-[#b84c24] transition-colors">
                Socials
              </a>
            )}
            {hasPortfolio && (
              <a href="#portfolio" className="hover:text-[#b84c24] transition-colors">
                Portfolio
              </a>
            )}
            {hasServices && (
              <a href="#services" className="hover:text-[#b84c24] transition-colors">
                Services
              </a>
            )}
            {hasReviews && (
              <a href="#reviews" className="hover:text-[#b84c24] transition-colors">
                Reviews
              </a>
            )}
            <a href="/login" className="hover:text-[#b84c24] transition-colors">
              Studio Login
            </a>
          </div>
        </div>

        <div className="border-t border-[#ebd8ca]/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8a8075]">
          <div>
            © {new Date().getFullYear()} {profile.businessName}. All rights reserved.
          </div>
          <Link
            href={HOME_ROUTE}
            className="text-[10px] text-[#a89e92] hover:text-[#78716c] transition-colors underline-offset-2 hover:underline"
          >
            Powered by Shopwus Platform
          </Link>
        </div>
      </div>
    </footer>
  );
}

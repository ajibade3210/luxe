import type { BusinessProfile } from "@/lib/types";

interface StudioFooterProps {
  profile: BusinessProfile;
  primaryColor: string;
  secondaryColor: string;
  monogram: string;
}

export function StudioFooter({
  profile,
  primaryColor,
  secondaryColor,
  monogram,
}: StudioFooterProps) {
  return (
    <footer className="bg-[#faf8f5] border-t border-[#e8dfd3] mt-24 py-14 text-xs text-[#78716c]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            style={{
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: secondaryColor,
            }}
            className="w-8 h-8 rounded-full border flex items-center justify-center font-serif text-base overflow-hidden shadow-2xs"
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
            <div className="font-serif text-base text-[#1c1917] font-medium">
              {profile.businessName}
            </div>
            <div className="text-[10px] text-[#8c8278]">
              {profile.physicalAddress || profile.location}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[#635c55]">
          <a href="#portfolio" className="hover:text-[#b84c24] transition-colors">
            Portfolio
          </a>
          <a href="#services" className="hover:text-[#b84c24] transition-colors">
            Services
          </a>
          <a href="#reviews" className="hover:text-[#b84c24] transition-colors">
            Reviews
          </a>
          <a href="#about" className="hover:text-[#b84c24] transition-colors">
            About
          </a>
          <a href="/login" className="hover:text-[#b84c24] transition-colors">
            Studio Login
          </a>
        </div>

        <div className="text-center md:text-right text-[11px] text-[#8a8075]">
          <div>
            © {new Date().getFullYear()} {profile.businessName}. All rights reserved.
          </div>
          <div className="text-[10px] text-[#a89e92] mt-0.5">Powered by Shopwus Platform</div>
        </div>
      </div>
    </footer>
  );
}

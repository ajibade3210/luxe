import { Menu, Share2, Sparkles, X } from "lucide-react";
import type { BusinessProfile } from "@/lib/types";

interface StudioNavbarProps {
  profile: BusinessProfile;
  slug: string;
  isFromSettings: boolean;
  isScrolled: boolean;
  activeSection: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  setQuoteModalOpen: (v: boolean) => void;
  handleCopyLink: () => void;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  textColor: string;
  monogram: string;
  radiusClass: string;
}

export function StudioNavbar({
  profile,
  slug,
  isFromSettings,
  isScrolled,
  activeSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  setQuoteModalOpen,
  handleCopyLink,
  primaryColor,
  secondaryColor,
  buttonColor,
  textColor,
  monogram,
  radiusClass,
}: StudioNavbarProps) {
  return (
    <>
      {/* Top Banner / Breadcrumb - Only visible when coming from Studio Settings / Admin */}
      {isFromSettings && (
        <div className="bg-[#edeeef] border-b border-[#e1e3e4] px-4 py-2 text-xs text-[#6b7280] flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <span
              style={{ color: primaryColor }}
              className="inline-flex items-center gap-1 font-medium text-[#191c1d]"
            >
              <Sparkles size={13} className="text-[#0058be]" /> Studio Admin Preview
            </span>
            <span className="text-[#c4c7c7]">·</span>
            <span className="font-mono">shopwus.com/{profile.slug || slug}</span>
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                style={{ color: textColor }}
                className="inline-flex items-center gap-1 hover:text-[#0058be] font-medium transition-colors cursor-pointer"
              >
                <Share2 size={12} /> Share profile
              </button>
              <a
                href="/settings"
                className="text-[#6b7280] hover:text-[#191c1d] font-medium transition-colors hidden sm:inline"
              >
                Return to Studio Settings →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#ffffff]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(40,30,20,0.06)] border-b border-[#ece7de] py-3"
            : "bg-[#faf8f5] border-b border-[#ebe6dc] py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href={`/${profile.slug || slug}`}
            className="group flex items-center gap-3 text-decoration-none"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-normal transition-transform group-hover:scale-105 overflow-hidden shadow-2xs shrink-0">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div
                  style={{
                    backgroundColor: secondaryColor,
                    color: primaryColor,
                  }}
                  className="w-full h-full rounded-full border flex items-center justify-center font-serif"
                >
                  {monogram}
                </div>
              )}
            </div>
            <span
              className="font-serif text-xl sm:text-2xl tracking-tight font-normal"
              style={{ color: textColor }}
            >
              {profile.businessName}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#68625c]">
            {profile.socialChannels?.some(c => c.connected) && (
              <a
                href="#social"
                style={{
                  color: activeSection === "social" ? primaryColor : undefined,
                }}
                className="transition-colors hover:opacity-80"
              >
                Socials
              </a>
            )}
            <a
              href="#portfolio"
              style={{
                color: activeSection === "portfolio" ? primaryColor : undefined,
              }}
              className="transition-colors hover:opacity-80"
            >
              Portfolio
            </a>
            <a
              href="#services"
              style={{
                color: activeSection === "services" ? primaryColor : undefined,
              }}
              className="transition-colors hover:opacity-80"
            >
              Services
            </a>
            <a
              href="#reviews"
              style={{
                color: activeSection === "reviews" ? primaryColor : undefined,
              }}
              className="transition-colors hover:opacity-80"
            >
              Reviews
            </a>
            <a
              href="#about"
              style={{
                color: activeSection === "about" ? primaryColor : undefined,
              }}
              className="transition-colors hover:opacity-80"
            >
              About
            </a>
          </nav>

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuoteModalOpen(true)}
              style={{ backgroundColor: buttonColor }}
              className={`text-white text-xs font-medium px-5 py-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer hidden sm:block ${radiusClass}`}
            >
              Get a Quote
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#78716c] hover:text-[#1c1917] md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#faf8f5] border-b border-[#e8dfd3] px-6 py-5 space-y-4 animate-fadeIn">
            <nav className="flex flex-col gap-3.5 text-sm font-medium text-[#68625c]">
              {profile.socialChannels?.some(c => c.connected) && (
                <a
                  href="#social"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#1c1917]"
                >
                  Social Networks
                </a>
              )}
              <a
                href="#portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1c1917]"
              >
                Portfolio
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1c1917]"
              >
                Services
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1c1917]"
              >
                Reviews
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1c1917]"
              >
                About & Hours
              </a>
            </nav>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setQuoteModalOpen(true);
              }}
              style={{ backgroundColor: buttonColor }}
              className={`w-full text-white text-xs font-medium py-3 shadow-2xs ${radiusClass}`}
            >
              Book a Consultation
            </button>
          </div>
        )}
      </header>
    </>
  );
}

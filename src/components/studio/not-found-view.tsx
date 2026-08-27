"use client";

import {
  ArrowRight,
  Check,
  Compass,
  ExternalLink,
  Home,
  MapPin,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { CUSTOM_EVENTS } from "@/constants";
import { isAuthenticated } from "@/lib/api";
import { featuredOrganizations } from "@/lib/mock-data";
import type { OrganizationPreview } from "@/types";

interface NotFoundViewProps {
  slug?: string;
}

// Simple similarity search for smart recommendation
function findClosestMatch(query: string, list: OrganizationPreview[]): OrganizationPreview | null {
  if (!query || list.length === 0) return null;
  const q = query.toLowerCase().trim();

  // 1. Direct prefix / substring match
  const sub = list.find(
    org => org.slug.toLowerCase().includes(q) || org.name.toLowerCase().includes(q)
  );
  if (sub) return sub;

  // 2. First letter match fallback
  const firstLetter = list.find(org => org.slug.toLowerCase().startsWith(q.slice(0, 1)));
  if (firstLetter) return firstLetter;

  // 3. Fallback to first available preview
  return list[0] || null;
}

export function NotFoundView({ slug }: NotFoundViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const cleanSlug = (slug || "").trim();

  // Track authentication state
  useEffect(() => {
    setSignedIn(isAuthenticated());
    const handleAuthChange = () => setSignedIn(isAuthenticated());
    window.addEventListener(CUSTOM_EVENTS.authChanged, handleAuthChange);
    return () => window.removeEventListener(CUSTOM_EVENTS.authChanged, handleAuthChange);
  }, []);

  const claimHref = signedIn
    ? `/settings?claim=${encodeURIComponent(cleanSlug)}`
    : `/signup?claim=${encodeURIComponent(cleanSlug)}`;

  // Smart suggestion for typos
  const suggestedOrg = useMemo(() => {
    return findClosestMatch(cleanSlug, featuredOrganizations);
  }, [cleanSlug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#191c1d] flex flex-col justify-between selection:bg-[#d8e2ff] selection:text-[#0058be] font-sans antialiased relative overflow-hidden">
      {/* Ambient Luxury Radial Glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none opacity-40 blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(214, 180, 138, 0.25) 0%, rgba(240, 234, 225, 0.1) 50%, transparent 75%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] pointer-events-none opacity-30 blur-3xl -z-10"
        style={{
          background: "radial-gradient(circle, rgba(133, 94, 46, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <BrandLogo subtitle="Atelier Studio" />

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="text-xs text-[#5c5f60] hover:text-[#191c1d] font-medium transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-full hover:bg-black/5 text-decoration-none"
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
          <Link
            href="/login"
            style={{ color: "#ffffff" }}
            className="text-xs bg-[#191c1d] !text-white px-4 py-2 rounded-full font-medium hover:bg-[#2b2e30] transition-all shadow-xs flex items-center gap-1.5 text-decoration-none hover:shadow-sm"
          >
            <span>Enter Studio</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto px-6 py-10 md:py-16 my-auto z-10">
        {/* Centered Hero Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-14">
          {/* Architectural Watermark 404 */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-serif text-[140px] sm:text-[190px] md:text-[230px] font-bold text-[#b91c1c]/[0.04] select-none pointer-events-none -z-10 leading-none tracking-tight">
            404
          </div>

          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef2f2]/90 backdrop-blur-sm border border-[#fecaca] text-xs text-[#991b1b] mb-7 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
            <span className="font-semibold tracking-wide">404 · Unregistered Atelier</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[#191c1d] mb-5 leading-[1.18]">
            This studio has not yet <br />
            <em className="italic font-normal text-[#855e2e]">opened its doors.</em>
          </h1>

          {/* Explanatory Message */}
          <p
            className="text-sm sm:text-base text-[#5c5f60] max-w-2xl mx-auto leading-relaxed sm:whitespace-nowrap block"
            style={{ marginTop: "28px", marginBottom: "42px" }}
          >
            {cleanSlug ? (
              <>
                The requested URL{" "}
                <span className="inline-block bg-[#f4ede4] text-[#855e2e] px-2 py-0.5 rounded font-semibold text-xs border border-[#e4dacf]">
                  /{cleanSlug}
                </span>{" "}
                is currently unregistered, private, or has been archived.
              </>
            ) : (
              "The requested studio profile or page could not be located in our registry."
            )}
          </p>

          {/* Smart AI Concierge Match (Did you mean?) */}
          {suggestedOrg && (
            <div className="mb-9 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#f7f2ea] to-[#f2ecdf] border border-[#e2d6c5] shadow-xs text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#dcd0bf] bg-white p-0.5">
                  <img
                    src={suggestedOrg.logoUrl}
                    alt={suggestedOrg.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#855e2e] uppercase tracking-wider mb-0.5">
                    <Sparkles size={12} className="text-[#855e2e]" />
                    <span>Did you mean to visit?</span>
                  </div>
                  <div className="text-sm font-bold text-[#191c1d]">{suggestedOrg.name}</div>
                  <div className="text-xs text-[#6b6e70] truncate max-w-xs sm:max-w-md">
                    {suggestedOrg.eyebrow}
                  </div>
                </div>
              </div>
              <Link
                href={`/${suggestedOrg.slug}`}
                style={{ color: "#ffffff" }}
                className="inline-flex items-center justify-center gap-1.5 bg-[#855e2e] !text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#6f4c22] transition-colors shrink-0 text-decoration-none shadow-2xs"
              >
                <span>Visit {suggestedOrg.name}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/"
              style={{ color: "#ffffff" }}
              className="inline-flex items-center gap-2 bg-[#191c1d] !text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#2d3032] transition-all shadow-xs text-decoration-none"
            >
              <Home size={15} />
              <span>Return to Homepage</span>
            </Link>
            <Link
              href={claimHref}
              className="inline-flex items-center gap-2 bg-white text-[#191c1d] border border-[#dcd6cb] text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#b8ad9b] hover:bg-[#fcfaf7] transition-all shadow-xs text-decoration-none"
            >
              <PlusCircle size={15} className="text-[#855e2e]" />
              <span>Claim & Create Studio</span>
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-[#5c5f60] hover:text-[#191c1d] px-3.5 py-2 rounded-full hover:bg-black/5 transition-colors border border-transparent hover:border-[#eae3d7]"
            >
              {copiedLink ? (
                <Check size={13} className="text-[#10b981]" />
              ) : (
                <ExternalLink size={13} />
              )}
              <span>{copiedLink ? "Link Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Directory Explorer Header */}
        <div className="mt-14 pt-10 border-t border-[#eae3d7]">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5c5f60]">
              <Compass size={15} className="text-[#855e2e]" />
              <span>Verified Studio Directory</span>
            </div>
            <p className="text-xs text-[#8e9192] mt-0.5">
              Explore luxury ateliers currently active on Shopwus
            </p>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {featuredOrganizations.map(org => (
              <Link
                key={org.id}
                href={`/${org.slug}`}
                className="p-4 bg-white/80 backdrop-blur-xs border border-[#eae3d7] rounded-2xl hover:border-[#c8bb9d] hover:shadow-md transition-all text-decoration-none group flex items-start gap-3.5 relative overflow-hidden"
              >
                {/* Studio Logo */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#f4eee6] border border-[#e2d7c9] flex items-center justify-center">
                  <img
                    src={org.logoUrl}
                    alt={org.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Studio Meta */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h2 className="text-xs font-bold text-[#191c1d] group-hover:text-[#0058be] transition-colors truncate">
                      {org.name}
                    </h2>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-[#855e2e] bg-[#f7f2ea] px-1.5 py-0.5 rounded shrink-0">
                      {org.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5c5f60] line-clamp-1 mb-1.5 flex items-center gap-1">
                    <MapPin size={11} className="text-[#a09e99] shrink-0" />
                    <span>{org.eyebrow.split("·")[1]?.trim() || org.eyebrow}</span>
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-[#0058be] font-medium">
                    <span>View live studio</span>
                    <ArrowRight
                      size={11}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#eae3d7] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8e9192] z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>Shopwus Global Registry Active</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/elan-events"
            className="hover:text-[#191c1d] transition-colors text-decoration-none"
          >
            Élan Demo
          </Link>
          <span className="text-[#dcd6cb]">·</span>
          <Link
            href="/settings"
            className="hover:text-[#191c1d] transition-colors text-decoration-none"
          >
            Studio Settings
          </Link>
          <span className="text-[#dcd6cb]">·</span>
          <span>© 2026 Shopwus</span>
        </div>
      </footer>
    </main>
  );
}

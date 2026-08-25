"use client";

import {
  ArrowRight,
  Check,
  Compass,
  ExternalLink,
  Home,
  MapPin,
  PlusCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { featuredOrganizations } from "@/lib/mock-data";
import type { OrganizationPreview } from "@/lib/types";

interface NotFoundViewProps {
  slug?: string;
}

// Simple Levenshtein-like similarity for smart recommendation
function findClosestMatch(query: string, list: OrganizationPreview[]): OrganizationPreview | null {
  if (!query) return null;
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (q.length < 2) return null;

  // Exact substring match
  for (const org of list) {
    const slugClean = org.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const nameClean = org.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (
      slugClean.includes(q) ||
      q.includes(slugClean) ||
      nameClean.includes(q) ||
      q.includes(nameClean)
    ) {
      return org;
    }
  }

  // Prefix matching
  for (const org of list) {
    const slugClean = org.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (slugClean.startsWith(q.slice(0, 4)) || q.startsWith(slugClean.slice(0, 4))) {
      return org;
    }
  }

  return null;
}

export function NotFoundView({ slug }: NotFoundViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const cleanSlug = (slug || "").trim();

  // Smart suggestion for typos
  const suggestedOrg = useMemo(() => {
    return findClosestMatch(cleanSlug, featuredOrganizations);
  }, [cleanSlug]);

  // Filtered directory based on search query
  const filteredOrgs = useMemo(() => {
    if (!searchQuery.trim()) return featuredOrganizations;
    const q = searchQuery.toLowerCase().trim();
    return featuredOrganizations.filter(
      org =>
        org.name.toLowerCase().includes(q) ||
        org.slug.toLowerCase().includes(q) ||
        org.eyebrow.toLowerCase().includes(q) ||
        org.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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
        <Link
          href="/"
          className="flex items-center gap-3 text-decoration-none group"
          aria-label="LuxeAdmin Homepage"
        >
          <div className="w-8 h-8 rounded-lg bg-[#191c1d] text-white flex items-center justify-center font-serif text-base italic font-bold shadow-xs group-hover:bg-[#2d3032] transition-colors">
            É
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#191c1d]">LuxeAdmin</span>
            <span className="text-[10px] text-[#8e9192] uppercase tracking-wider font-mono">
              Atelier Registry
            </span>
          </div>
        </Link>

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
      <div className="w-full max-w-5xl mx-auto px-6 py-8 md:py-12 my-auto z-10">
        {/* Centered Hero Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-10">
          {/* Architectural Watermark 404 */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif text-[130px] sm:text-[180px] md:text-[210px] font-bold text-[#855e2e]/[0.05] select-none pointer-events-none -z-10 leading-none tracking-tight">
            404
          </div>

          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0eae1]/90 backdrop-blur-sm border border-[#e4dacf] text-xs font-mono text-[#855e2e] mb-5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#855e2e] animate-pulse" />
            <span className="tracking-wide">404 · Unregistered Atelier</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[#191c1d] mb-4 leading-[1.15]">
            This studio has not yet <br />
            <em className="italic font-normal text-[#855e2e]">opened its doors.</em>
          </h1>

          {/* Explanatory Message */}
          <p className="text-sm sm:text-base text-[#5c5f60] max-w-lg mx-auto leading-relaxed mb-6">
            {cleanSlug ? (
              <>
                The requested URL{" "}
                <span className="inline-block bg-[#ede7dd] text-[#191c1d] px-2 py-0.5 rounded font-mono text-xs border border-[#dfd6c8] font-semibold">
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
            <div className="mb-7 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#f7f2ea] to-[#f2ecdf] border border-[#e2d6c5] shadow-xs text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#dcd0bf] bg-white p-0.5">
                  <img
                    src={suggestedOrg.logoUrl}
                    alt={suggestedOrg.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#855e2e] uppercase tracking-wider">
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
                className="inline-flex items-center justify-center gap-1.5 bg-[#855e2e] !text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#6f4c22] transition-colors shrink-0 text-decoration-none shadow-2xs"
              >
                <span>Visit {suggestedOrg.name}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              style={{ color: "#ffffff" }}
              className="inline-flex items-center gap-2 bg-[#191c1d] !text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#2d3032] transition-all shadow-xs text-decoration-none"
            >
              <Home size={15} />
              <span>Return to Homepage</span>
            </Link>
            <Link
              href={`/settings?claim=${encodeURIComponent(cleanSlug)}`}
              className="inline-flex items-center gap-2 bg-white text-[#191c1d] border border-[#dcd6cb] text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#b8ad9b] hover:bg-[#fcfaf7] transition-all shadow-xs text-decoration-none"
            >
              <PlusCircle size={15} className="text-[#855e2e]" />
              <span>Claim & Create Studio</span>
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-[#5c5f60] hover:text-[#191c1d] px-3 py-2 rounded-full hover:bg-black/5 transition-colors border border-transparent hover:border-[#eae3d7]"
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

        {/* Directory Explorer Header & Search */}
        <div className="mt-12 pt-8 border-t border-[#eae3d7]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5c5f60]">
                <Compass size={15} className="text-[#855e2e]" />
                <span>Verified Studio Directory</span>
              </div>
              <p className="text-xs text-[#8e9192] mt-0.5">
                Explore luxury ateliers currently active on LuxeAdmin
              </p>
            </div>

            {/* Quick Filter Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9192]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by studio or city..."
                className="w-full bg-white border border-[#ded7cb] rounded-full pl-9 pr-8 py-1.5 text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:outline-none focus:border-[#855e2e] focus:ring-1 focus:ring-[#855e2e] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9192] hover:text-[#191c1d]"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Directory Cards Grid */}
          {filteredOrgs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredOrgs.map(org => (
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
          ) : (
            <div className="py-10 text-center bg-white/50 border border-dashed border-[#dfd6c7] rounded-2xl">
              <p className="text-xs text-[#5c5f60] mb-2">
                No studios found matching "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-[#855e2e] hover:underline"
              >
                Clear search filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#eae3d7] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8e9192] z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>LuxeAdmin Global Registry Active</span>
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
          <span>© 2026 LuxeAdmin</span>
        </div>
      </footer>
    </main>
  );
}

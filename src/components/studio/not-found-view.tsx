"use client";

import { ArrowRight, Check, ExternalLink, Home, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { CUSTOM_EVENTS } from "@/constants";
import { isAuthenticated } from "@/lib/api";
import type { NotFoundViewProps } from "@/types";

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

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#191c1d] flex flex-col justify-between selection:bg-[#d8e2ff] selection:text-[#0058be] font-sans antialiased relative overflow-hidden">
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
      <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-20 my-auto z-10">
        {/* Centered Hero Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-10">
          {/* Architectural Watermark 404 */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-serif text-[140px] sm:text-[190px] md:text-[230px] font-bold text-[#b91c1c]/[0.04] select-none pointer-events-none -z-10 leading-none tracking-tight">
            404
          </div>

          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef2f2] border border-[#fecaca] text-xs text-[#991b1b] mb-7">
            <span className="font-semibold tracking-wide">404 · Unregistered Atelier</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[#191c1d] mb-5 leading-[1.18]">
            This studio has not yet <br />
            <em className="italic font-normal text-[#855e2e]">opened its doors.</em>
          </h1>

          {/* Explanatory Message */}
          <p
            className="text-sm sm:text-base text-[#5c5f60] max-w-2xl mx-auto leading-relaxed block"
            style={{ marginTop: "24px", marginBottom: "36px" }}
          >
            {cleanSlug ? (
              <>
                The requested URL{" "}
                <span className="inline-block bg-[#f4ede4] text-[#855e2e] px-2 py-0.5 rounded font-semibold text-xs border border-[#e4dacf]">
                  /{cleanSlug}
                </span>{" "}
                is currently unregistered or has not yet been published by its creator.
              </>
            ) : (
              "The requested studio profile or page could not be located in our registry."
            )}
          </p>

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
      </div>

      {/* Bottom Status Bar */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#eae3d7] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8e9192] z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>Shopwus Global Registry Active</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/" className="hover:text-[#191c1d] transition-colors text-decoration-none">
            Home
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

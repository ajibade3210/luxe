"use client";

import { ArrowRight, Compass, Home, PlusCircle } from "lucide-react";
import Link from "next/link";
import { featuredOrganizations } from "@/lib/mock-data";

interface NotFoundViewProps {
  slug?: string;
}

export function NotFoundView({ slug }: NotFoundViewProps) {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#191c1d] flex flex-col justify-between selection:bg-[#d8e2ff] selection:text-[#0058be] font-sans antialiased">
      {/* Top Minimal Navigation Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-decoration-none group"
          aria-label="LuxeAdmin Homepage"
        >
          <div className="w-7 h-7 rounded-md bg-[#191c1d] text-white flex items-center justify-center font-serif text-sm italic font-bold">
            É
          </div>
          <span className="font-bold text-base tracking-tight text-[#191c1d]">LuxeAdmin</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-[#5c5f60] hover:text-[#191c1d] font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/5"
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
          <Link
            href="/login"
            style={{ color: "#ffffff" }}
            className="text-xs bg-[#191c1d] !text-white px-3.5 py-1.5 rounded-full font-medium hover:bg-[#2b2e30] transition-colors flex items-center gap-1 text-decoration-none"
          >
            <span>Enter Studio</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      {/* Main 404 Hero Container */}
      <div className="max-w-3xl mx-auto px-6 py-12 text-center my-auto">
        {/* Status Capsule */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0eae1] border border-[#e4dacf] text-xs font-mono text-[#855e2e] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#855e2e] animate-pulse" />
          <span>404 · Unregistered Atelier</span>
        </div>

        {/* Serif Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-[#191c1d] mb-4">
          This studio has not yet <br />
          <em className="italic font-normal text-[#855e2e]">opened its doors.</em>
        </h1>

        {/* Explanatory Copy */}
        <p className="text-base sm:text-lg text-[#5c5f60] max-w-xl mx-auto leading-relaxed mb-6">
          {slug ? (
            <>
              The requested address{" "}
              <code className="bg-[#ede7dd] text-[#191c1d] px-2 py-0.5 rounded font-mono text-sm border border-[#e0d6c7]">
                luxeadmin.com/{slug}
              </code>{" "}
              does not exist in our directory, is set to private, or has been relocated.
            </>
          ) : (
            "The requested page or studio profile could not be found."
          )}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <Link
            href="/"
            style={{ color: "#ffffff" }}
            className="inline-flex items-center gap-2 bg-[#191c1d] !text-white text-sm font-medium px-5 py-3 rounded-full hover:bg-[#2d3032] transition-colors shadow-xs text-decoration-none"
          >
            <Home size={15} />
            <span>Return to LuxeAdmin</span>
          </Link>
          <Link
            href={`/settings?claim=${encodeURIComponent(slug || "")}`}
            className="inline-flex items-center gap-2 bg-white text-[#191c1d] border border-[#dcd6cb] text-sm font-medium px-5 py-3 rounded-full hover:border-[#b8ad9b] hover:bg-[#faf7f2] transition-colors shadow-xs"
          >
            <PlusCircle size={15} className="text-[#855e2e]" />
            <span>Claim & Create This Studio</span>
          </Link>
        </div>

        {/* Explore Active Studios Section */}
        <div className="border-t border-[#eae3d7] pt-10 text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-[#855e2e]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5f60]">
                Explore Verified Studios
              </span>
            </div>
            <span className="text-xs text-[#8e9192]">6 Premier Ateliers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {featuredOrganizations.map(org => (
              <Link
                key={org.id}
                href={`/${org.slug}`}
                className="p-3.5 bg-white border border-[#eae3d7] rounded-xl hover:border-[#d6caa7] hover:shadow-md transition-all text-decoration-none group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#ede7dd] border border-[#e0d6c7] flex items-center justify-center">
                  <img
                    src={org.logoUrl}
                    alt={org.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs font-bold text-[#191c1d] group-hover:text-[#0058be] transition-colors truncate">
                    {org.name}
                  </h2>
                  <p className="text-[11px] text-[#5c5f60] truncate">{org.eyebrow}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#855e2e] font-medium mt-1">
                    <span>Explore profile</span>
                    <ArrowRight
                      size={10}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Compliance Bar */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#eae3d7] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8e9192]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>All LuxeAdmin systems operational</span>
        </div>
        <p>© 2026 LuxeAdmin Atelier Suite. All rights reserved.</p>
      </footer>
    </main>
  );
}

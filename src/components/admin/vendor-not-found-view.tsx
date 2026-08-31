"use client";

import { FileText, Home, Receipt, Settings, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";

export function VendorNotFoundView() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#191c1d] flex flex-col justify-between selection:bg-[#d8e2ff] selection:text-[#0058be] font-sans antialiased relative overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <BrandLogo href="/vendor/overview" subtitle="Vendor Workspace" />

        <div className="flex items-center gap-2.5">
          <Link
            href="/vendor/overview"
            className="text-xs text-[#5c5f60] hover:text-[#191c1d] font-medium transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-full hover:bg-black/5 text-decoration-none"
          >
            <Home size={13} />
            <span>Dashboard Overview</span>
          </Link>
          <Link
            href="/vendor/settings"
            className="text-xs bg-[#191c1d] !text-white px-4 py-2 rounded-full font-medium hover:bg-[#2b2e30] transition-all shadow-xs flex items-center gap-1.5 text-decoration-none hover:shadow-sm"
          >
            <Settings size={12} />
            <span>Studio Settings</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-3xl mx-auto px-6 py-8 md:py-12 my-auto z-10 flex flex-col items-center text-center">
        {/* Architectural Watermark 404 & Hero Copy */}
        <div className="relative flex flex-col items-center text-center w-full max-w-xl mx-auto">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-serif text-[120px] sm:text-[160px] md:text-[200px] font-bold text-[#b91c1c]/[0.04] select-none pointer-events-none -z-10 leading-none tracking-tight">
            404
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef2f2] border border-[#fecaca] text-xs text-[#991b1b] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            <span className="font-semibold tracking-wide">404 · Vendor Route Not Found</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[#191c1d] mb-3 leading-[1.18] text-center">
            Workspace module <br />
            <em className="italic font-normal text-[#855e2e]">not found.</em>
          </h1>

          <p className="text-sm sm:text-base text-[#5c5f60] max-w-md mx-auto leading-relaxed mt-3 mb-10 text-center">
            The vendor workspace section you requested doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          {/* Primary Action */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-7 w-full">
            <Link
              href="/vendor/overview"
              className="inline-flex items-center justify-center gap-2 bg-[#191c1d] !text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-sm text-decoration-none"
            >
              <Home size={15} />
              <span>Return to Dashboard</span>
            </Link>
            <Link
              href="/vendor/leads"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#191c1d] border border-[#ded5c8] hover:border-[#c59a78] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#f8f4ed] transition-all shadow-xs text-decoration-none"
            >
              <TrendingUp size={15} className="text-[#855e2e]" />
              <span>View Leads</span>
            </Link>
          </div>
        </div>

        {/* Quick Nav Shortcuts Card */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 shadow-2xs text-left max-w-xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block mb-3">
            Quick Navigation
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Link
              href="/vendor/leads"
              className="p-2.5 rounded-xl hover:bg-[#faf8f5] border border-transparent hover:border-[#eee7dc] transition-all flex items-center gap-2 text-[#444748] hover:text-[#191c1d]"
            >
              <Users size={14} className="text-[#855e2e]" />
              <span className="font-medium">Leads</span>
            </Link>
            <Link
              href="/vendor/customers"
              className="p-2.5 rounded-xl hover:bg-[#faf8f5] border border-transparent hover:border-[#eee7dc] transition-all flex items-center gap-2 text-[#444748] hover:text-[#191c1d]"
            >
              <Users size={14} className="text-[#0058be]" />
              <span className="font-medium">Customers</span>
            </Link>
            <Link
              href="/vendor/invoices"
              className="p-2.5 rounded-xl hover:bg-[#faf8f5] border border-transparent hover:border-[#eee7dc] transition-all flex items-center gap-2 text-[#444748] hover:text-[#191c1d]"
            >
              <FileText size={14} className="text-[#16a34a]" />
              <span className="font-medium">Invoices</span>
            </Link>
            <Link
              href="/vendor/expenses"
              className="p-2.5 rounded-xl hover:bg-[#faf8f5] border border-transparent hover:border-[#eee7dc] transition-all flex items-center gap-2 text-[#444748] hover:text-[#191c1d]"
            >
              <Receipt size={14} className="text-[#dc2626]" />
              <span className="font-medium">Expenses</span>
            </Link>
            <Link
              href="/vendor/analytics"
              className="p-2.5 rounded-xl hover:bg-[#faf8f5] border border-transparent hover:border-[#eee7dc] transition-all flex items-center gap-2 text-[#444748] hover:text-[#191c1d]"
            >
              <TrendingUp size={14} className="text-[#7c3aed]" />
              <span className="font-medium">Analytics</span>
            </Link>
            <Link
              href="/vendor/settings"
              className="p-2.5 rounded-xl hover:bg-[#faf8f5] border border-transparent hover:border-[#eee7dc] transition-all flex items-center gap-2 text-[#444748] hover:text-[#191c1d]"
            >
              <Settings size={14} className="text-[#5c5f60]" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#eae3d7] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8e9192] z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>Vendor Workspace Active</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/vendor/overview" className="hover:text-[#191c1d] transition-colors">
            Overview
          </Link>
          <span className="text-[#dcd6cb]">·</span>
          <Link href="/vendor/settings" className="hover:text-[#191c1d] transition-colors">
            Settings
          </Link>
          <span className="text-[#dcd6cb]">·</span>
          <span>© 2026 Shopwus</span>
        </div>
      </footer>
    </div>
  );
}

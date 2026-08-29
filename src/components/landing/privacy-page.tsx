"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SiteFooter } from "./site-footer";

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[#191c1d] flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--line)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#665e57] hover:text-[#191c1d] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <BrandLogo size="sm" href="/" />
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#665e57] hover:text-[#191c1d] px-2 py-1"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Document Body */}
      <main className="flex-1 max-w-3xl mx-auto px-5 sm:px-8 py-14 space-y-10">
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-[var(--line)]">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#191c1d] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#747878]">Last Updated: July 13, 2026</p>
          <p className="text-sm text-[#444748] leading-relaxed pt-2">
            Welcome to Shopwus (&quot;Shopwus&quot;, &quot;we&quot;, &quot;our&quot;, or
            &quot;us&quot;). We are committed to protecting your privacy and ensuring your personal
            and studio business data is handled securely, transparently, and in compliance with the
            Nigeria Data Protection Act (NDPA).
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">1. Information We Collect</h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            We collect the following categories of information to provide and maintain our services:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#444748] pl-5 list-disc leading-relaxed">
            <li>
              <strong>Account Information:</strong> Name, studio business name, email address, phone
              number, address, and Google OAuth credentials.
            </li>
            <li>
              <strong>Financial & Invoicing:</strong> Itemized invoices, service amounts,
              currencies, payment statuses, and client billing records.
            </li>
            <li>
              <strong>Expense Bookkeeping:</strong> Recorded operational outflows, expense
              categories, notes, and vendor receipts.
            </li>
            <li>
              <strong>CRM Leads & Client Inquiries:</strong> Inbound inquiries from your digital
              storefront, client contact details, event dates, and budget details.
            </li>
            <li>
              <strong>Technical Data:</strong> IP addresses, browser type, and essential functional
              cookies used for authentication.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">
            2. How We Use Your Information
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-[#444748] pl-5 list-disc leading-relaxed">
            <li>
              <strong>Service Delivery:</strong> Hosting your digital storefront, interactive 3D
              card, CRM pipeline, and invoice generation.
            </li>
            <li>
              <strong>Bookkeeping & Valuation:</strong> Calculating real-time net profit and
              generating private business valuation estimates for your studio.
            </li>
            <li>
              <strong>Communications:</strong> Facilitating WhatsApp inquiries, client broadcasts,
              and essential account alerts.
            </li>
            <li>
              <strong>Security & Fraud Prevention:</strong> Verifying accounts and protecting
              against unauthorized access.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">
            3. Business Valuation & Financial Privacy
          </h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            All financial records, revenue metrics, expense ledgers, and Business Valuation
            Estimates are{" "}
            <strong>strictly confidential and private to your verified account</strong>.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#444748] pl-5 list-disc leading-relaxed">
            <li>
              <strong>Public Calculators:</strong> Inputs entered into our public Business Valuation
              Calculator are computed locally in real time and are not stored, shared, or linked to
              your identity unless you voluntarily create an account to save your valuation.
            </li>
            <li>
              <strong>Private Dashboard:</strong> We never display your valuation, revenue, or
              expenses on your public storefront (`/[slug]`).
            </li>
            <li>We do not sell, trade, or monetize your financial records or client lists.</li>
            <li>
              Valuation estimates are automated analytical benchmarks for internal strategic
              planning and do not constitute certified financial appraisals.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">4. Information Sharing</h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            We do not sell your personal data. We only share information in the following contexts:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#444748] pl-5 list-disc leading-relaxed">
            <li>
              <strong>Public Storefront:</strong> Details you explicitly publish (brand name, bio,
              logo, services, social links) are visible on your public URL (`/[slug]`).
            </li>
            <li>
              <strong>Service Providers:</strong> Encrypted data shared with infrastructure partners
              for database hosting, authentication, and email delivery.
            </li>
            <li>
              <strong>Legal Requirements:</strong> When mandated by enforceable court orders or
              statutory laws in Nigeria.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">
            5. Data Security & Retention
          </h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            We implement 256-bit encryption protocols and role-based access to safeguard your data.
            Records are retained while your account remains active or as required by statutory
            bookkeeping obligations.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">
            6. Your Rights Under the NDPA
          </h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            Under the Nigeria Data Protection Act, you hold the right to access, rectify, export
            (via CSV data export), or request deletion of your personal and studio data at any time.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">7. Contact Us</h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            If you have questions regarding this Privacy Policy or wish to exercise your data
            rights, please reach out to us at{" "}
            <a
              href="mailto:support@shopwus.com"
              className="text-[#191c1d] font-semibold underline underline-offset-2 hover:text-[#855e2e]"
            >
              support@shopwus.com
            </a>
            .
          </p>
        </section>
      </main>

      {/* Global Site Footer */}
      <SiteFooter />
    </div>
  );
}

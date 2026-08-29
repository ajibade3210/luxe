"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SiteFooter } from "./site-footer";

export function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-xs text-[#747878]">Effective Date: February 15, 2026</p>
          <p className="text-sm text-[#444748] leading-relaxed pt-2">
            Welcome to Shopwus (https://shopwus.com). By creating an account, accessing our digital
            studio tools, or using our services, you agree to comply with and be bound by these
            Terms and Conditions.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">1. Overview</h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            Shopwus is the studio operating system for boutique vendors, event planners, and
            creative directors, offering digital storefronts, interactive 3D stationery cards, CRM
            leads, multi-currency invoicing, expense bookkeeping, and business valuation modeling.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">2. Accounts</h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            You must provide accurate information when registering and maintain the security of your
            login credentials. You are responsible for all actions conducted under your account.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">
            3. Free Trial & Subscriptions
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-[#444748] pl-5 list-disc leading-relaxed">
            <li>
              <strong>14-Day Free Trial:</strong> Full access to all studio tools with zero upfront
              payment required.
            </li>
            <li>
              <strong>Subscription:</strong> Following the trial, an active subscription is required
              to continue using the dashboard.
            </li>
            <li>
              <strong>Data Retention:</strong> If no subscription is activated after the trial, your
              dashboard will be locked and data preserved for 30 days before archival.
            </li>
            <li>
              <strong>Cancellation:</strong> You may cancel anytime; services remain active through
              the current billing cycle.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">
            4. Plan Limits & Zero Data Loss Policy
          </h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            Shopwus guarantees that inbound customer inquiries and records are never discarded or
            throttled. Plan allowances (including customer and lead caps, up to 3 showcase projects
            & 3 categories on Starter, and up to 10 showcase projects & 5 categories on Unlimited)
            are enforced gracefully. You may upgrade to Unlimited at any time without losing data.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">
            5. Business Valuation & Free Tools Disclaimer
          </h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            Valuation figures and estimations provided across our public tools (such as the Business
            Valuation Calculator) and registered studio dashboards are automated analytical
            benchmarks for internal owner planning and educational purposes only. They do not
            constitute a certified appraisal, formal financial audit, tax advice, or legal opinion.
            Shopwus accepts no liability for commercial decisions or transactions made based on
            these automated estimates.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">
            6. Data Ownership & Privacy Compliance
          </h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            You own all your client data, invoice records, and branding. For leads collected on your
            public storefront, you act as the Data Controller, and Shopwus acts as the secure Data
            Processor in full compliance with the Nigeria Data Protection Act (NDPA).
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">7. Governing Law</h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of the Federal
            Republic of Nigeria.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#191c1d]">8. Contact Us</h2>
          <p className="text-xs sm:text-sm text-[#444748] leading-relaxed">
            Questions regarding these Terms can be sent to{" "}
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

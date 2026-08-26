"use client";

import { ChevronUp, Lock, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { FooterAiConcierge } from "./footer/footer-ai-concierge";
import { FooterLinks } from "./footer/footer-links";
import { FooterNewsletter } from "./footer/footer-newsletter";

export function SiteFooter() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer" id="contact">
      {/* Top Banner / Newsletter Section */}
      <FooterNewsletter />

      {/* Main Footer Grid */}
      <div className="footer-main-grid">
        {/* Left Column: Brand & AI Concierge */}
        <div className="footer-brand-column">
          <BrandLogo size="md" />

          <p className="footer-mission-text">
            The premier studio operating system engineered for luxury event architects, bespoke
            wedding ateliers, and experiential production houses worldwide.
          </p>

          {/* Companion App Badge */}
          <div className="footer-app-card">
            <div className="footer-app-qr">
              <img
                src="https://cdn.accessa.ng/test/accessa/joe-fitness/qrcodes/images/7343ffeb0bfd056e77e8e8d52edf0722.png"
                alt="Shopwus companion iOS app QR code"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div className="footer-app-info">
              <div className="flex items-center gap-1.5 text-xs text-[#855e2e] font-semibold">
                <Smartphone size={13} />
                <span>iOS & iPadOS Companion</span>
              </div>
              <strong className="text-sm font-semibold text-[#191c1d] block mt-0.5">
                Download Shopwus Studio
              </strong>
              <span className="text-xs text-[#747878] block mt-0.5">
                Live show-calls, team cueing & instant approvals
              </span>
            </div>
          </div>

          <FooterAiConcierge />
        </div>

        {/* Right Navigation Columns */}
        <FooterLinks />
      </div>

      {/* Trust Badges & System Status Row */}
      <div className="footer-trust-row">
        <div className="footer-status-indicator">
          <span className="status-dot-pulse" />
          <span className="text-xs font-medium text-[#2e3132]">
            All Systems Operational · 99.99% Studio Uptime
          </span>
        </div>

        <div className="footer-trust-badges">
          <div className="trust-badge-item">
            <ShieldCheck size={14} className="text-[#855e2e]" />
            <span>SOC-2 Type II Certified</span>
          </div>
          <div className="trust-badge-item">
            <Lock size={13} className="text-[#855e2e]" />
            <span>256-bit AES Vault Encryption</span>
          </div>
          <div className="trust-badge-item">
            <Zap size={13} className="text-[#855e2e]" />
            <span>GDPR & NDPR Compliant</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Legal & Back to Top */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-left">
          <span>© {new Date().getFullYear()} Shopwus Technologies Inc. All rights reserved.</span>
          <span className="hidden sm:inline">·</span>
          <span className="text-[#855e2e] font-medium">Bespoke Event Operating System</span>
        </div>

        <div className="footer-legal-links">
          <a href="#privacy" className="footer-legal-item">
            Privacy Policy
          </a>
          <a href="#terms" className="footer-legal-item">
            Terms of Service
          </a>
          <a href="#security" className="footer-legal-item">
            Security & Trust
          </a>
          <a href="#cookies" className="footer-legal-item">
            Cookie Preferences
          </a>
          <a href="#sla" className="footer-legal-item">
            SLA Agreement
          </a>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="footer-back-to-top"
          aria-label="Back to top of page"
        >
          <span>Back to top</span>
          <ChevronUp size={14} />
        </button>
      </div>
    </footer>
  );
}

"use client";

import { ChevronUp, Smartphone } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { APP_CONFIG } from "@/constants";
import { businessProfile } from "@/lib/mock-data";

const QR_CODE_IMAGE_SRC =
  "https://cdn.accessa.ng/test/accessa/joe-fitness/qrcodes/images/7343ffeb0bfd056e77e8e8d52edf0722.png";

const FOOTER_NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#workflow" },
  { label: "Studio Demo", href: `/${businessProfile.slug || APP_CONFIG.defaultSlug}` },
  { label: "Sign up", href: "/signup" },
  { label: "Enter Studio", href: "/login" },
] as const;

const FOOTER_CONNECT_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "Twitter / X", href: "https://x.com" },
] as const;

export function SiteFooter() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-container">
        {/* Main Content Grid */}
        <div className="footer-main-grid">
          {/* Left Block: Brand, Mission & Companion App Card */}
          <div className="footer-brand-block">
            <BrandLogo size="md" />

            <p className="footer-mission-text">
              The premier studio operating system engineered for luxury event architects, bespoke
              wedding ateliers, and experiential production houses worldwide.
            </p>

            {/* Companion App Card */}
            <div className="footer-app-card">
              <div className="footer-app-qr">
                <img
                  src={QR_CODE_IMAGE_SRC}
                  alt="Shopwus companion iOS app QR code"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="footer-app-info">
                <div className="footer-app-badge">
                  <Smartphone size={12} />
                  <span>iOS & iPadOS Companion</span>
                </div>
                <strong className="footer-app-title">Download Shopwus Studio</strong>
                <span className="footer-app-desc">
                  Live show-calls, team cueing & instant approvals
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: Navigation */}
          <div className="footer-nav-column footer-center-column">
            <h3 className="footer-nav-title">Navigation</h3>
            <ul className="footer-nav-list">
              {FOOTER_NAV_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="footer-nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Connect */}
          <div className="footer-nav-column footer-right-column">
            <h3 className="footer-nav-title">Connect</h3>
            <ul className="footer-nav-list">
              {FOOTER_CONNECT_LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="footer-nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Back to Top */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} Shopwus. All rights reserved.</span>
          </div>

          <div className="footer-legal-links">
            <a href="#privacy" className="footer-legal-item">
              Privacy Policy
            </a>
            <span className="footer-legal-sep">·</span>
            <a href="#terms" className="footer-legal-item">
              Terms of Service
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
      </div>
    </footer>
  );
}

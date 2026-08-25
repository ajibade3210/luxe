"use client";

import {
  ArrowUpRight,
  Check,
  ChevronUp,
  Lock,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface AiPrompt {
  label: string;
  icon: string;
  question: string;
  answer: string;
}

const AI_PROMPTS: AiPrompt[] = [
  {
    label: "Proposal Engine",
    icon: "✦",
    question: "How does LuxeAdmin calculate multi-day production margins?",
    answer:
      "LuxeAdmin auto-calculates vendor cost baselines, staffing tiers, contingency buffers, and custom markup formulas in real-time. Proposals dynamic-link to live budgets so your studio never absorbs unexpected vendor price surges.",
  },
  {
    label: "VIP Client Portal",
    icon: "✧",
    question: "What does the client VIP onboarding experience look like?",
    answer:
      "Clients receive an encrypted, white-labeled portal showcasing curated moodboards, interactive design decisions, digital signature milestones, and direct messaging—eliminating 50+ messy email threads.",
  },
  {
    label: "Multi-Channel Sync",
    icon: "◇",
    question: "Can I sync 10+ social accounts and live event galleries?",
    answer:
      "Yes. LuxeAdmin connects directly to Instagram, TikTok, Pinterest, YouTube, and Vimeo. Published events automatically update your public portfolio with high-resolution imagery and vendor credits.",
  },
  {
    label: "Live Run of Show",
    icon: "✺",
    question: "How does real-time team cueing work during gala events?",
    answer:
      "Your on-site production team and AV vendors receive live synchronized timelines on iOS & iPadOS. Broadcast instant cue adjustments, vendor call times, and VIP arrival alerts with zero latency.",
  },
];

const navigationSections = [
  {
    title: "Platform Suite",
    links: [
      { label: "Client Inquiries & CRM", href: "/leads" },
      { label: "Bespoke Proposal Engine", href: "/settings" },
      { label: "Visual Moodboards & Decks", href: "/settings" },
      { label: "Contracts & Milestones", href: "/customers" },
      { label: "Live Run of Show", href: "/settings" },
      { label: "Multi-Channel Sync", href: "/settings" },
      { label: "Client VIP Portals", href: "/elan-events" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Luxury Wedding Ateliers", href: "/elan-events" },
      { label: "Experiential Agencies", href: "#features" },
      { label: "Private Concierge & VIP", href: "#workflow" },
      { label: "Floral & Spatial Designers", href: "#features" },
      { label: "Destination Planners", href: "#workflow" },
    ],
    subsections: [
      {
        title: "Connect",
        links: [
          { label: "Instagram", href: "https://instagram.com", external: true },
          { label: "LinkedIn", href: "https://linkedin.com", external: true },
          { label: "Pinterest", href: "https://pinterest.com", external: true },
          { label: "Twitter / X", href: "https://x.com", external: true },
        ],
      },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Studio Operating Guide", href: "#workflow" },
      { label: "Event Margin Calculator", href: "/settings" },
      { label: "Luxury Wedding Index 2026", href: "#features" },
      { label: "Contract Legal Frameworks", href: "/settings" },
      { label: "API & Webhook Docs", href: "#features" },
      { label: "Changelog & Releases", href: "#workflow" },
    ],
    subsections: [
      {
        title: "Company",
        links: [
          { label: "About LuxeAdmin", href: "#workflow" },
          { label: "The Atelier Journal", href: "#features" },
          { label: "Press & Accolades", href: "#features" },
          { label: "Careers", href: "#contact", badge: "Hiring" },
        ],
      },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activePrompt, setActivePrompt] = useState<AiPrompt | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
    }, 4000);
  };

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setIsAiThinking(true);
    setCustomAnswer(null);
    setTimeout(() => {
      setIsAiThinking(false);
      setCustomAnswer(
        `LuxeAdmin seamlessly coordinates ${customQuestion.toLowerCase().includes("budget") ? "production budgets, currency conversions, and automated vendor milestone payouts" : customQuestion.toLowerCase().includes("client") ? "private client confidentiality, bespoke deck styling, and encrypted proposal approvals" : "luxury event workflows, multi-channel portfolio distribution, and high-touch VIP client experiences"} with dedicated atelier-grade tooling.`
      );
    }, 600);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer" id="contact">
      {/* Top Banner / Newsletter Section */}
      <div className="footer-hero-band">
        <div className="footer-hero-copy">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece1] border border-[#e5d8c5] text-xs font-semibold tracking-wide text-[#785933] mb-3">
            <Sparkles size={13} className="text-[#a87d46]" />
            <span>The Atelier Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#191c1d]">
            Curated intelligence for luxury event leaders.
          </h2>
          <p className="text-sm sm:text-base text-[#5c5f60] max-w-xl mt-2 leading-relaxed">
            Join over 4,200+ studio directors receiving our weekly dispatch on high-ticket client
            acquisition, production masterclasses, and modern event architecture.
          </p>
        </div>

        <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
          <div className="footer-input-wrapper">
            <input
              aria-label="Studio email address"
              type="email"
              placeholder="director@yourstudio.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={submitted}
              className="footer-email-input"
            />
            <button type="submit" disabled={submitted} className="footer-submit-btn">
              {submitted ? (
                <span className="flex items-center gap-1.5 text-[#2e7d32]">
                  <Check size={16} /> Subscribed
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Subscribe <Send size={13} />
                </span>
              )}
            </button>
          </div>
          {submitted && (
            <p className="text-xs text-[#2e7d32] mt-2 font-medium animate-fadeIn">
              ✓ Welcome to The Atelier Dispatch. Your first edition arrives this Monday.
            </p>
          )}
        </form>
      </div>

      {/* Main Footer Grid */}
      <div className="footer-main-grid">
        {/* Left Column: Brand & AI Concierge */}
        <div className="footer-brand-column">
          <a href="/" className="footer-logo-brand" aria-label="LuxeAdmin Homepage">
            <span className="footer-logo-monogram">É</span>
            <span className="footer-logo-text">LuxeAdmin</span>
          </a>

          <p className="footer-mission-text">
            The premier studio operating system engineered for luxury event architects, bespoke
            wedding ateliers, and experiential production houses worldwide.
          </p>

          {/* Companion App Badge */}
          <div className="footer-app-card">
            <div className="footer-app-qr">
              <img
                src="https://cdn.accessa.ng/test/accessa/joe-fitness/qrcodes/images/7343ffeb0bfd056e77e8e8d52edf0722.png"
                alt="LuxeAdmin companion iOS app QR code"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div className="footer-app-info">
              <div className="flex items-center gap-1.5 text-xs text-[#855e2e] font-semibold">
                <Smartphone size={13} />
                <span>iOS & iPadOS Companion</span>
              </div>
              <strong className="text-sm font-semibold text-[#191c1d] block mt-0.5">
                Download LuxeAdmin Studio
              </strong>
              <span className="text-xs text-[#747878] block mt-0.5">
                Live show-calls, team cueing & instant approvals
              </span>
            </div>
          </div>

          {/* Ask AI Section */}
          <div className="footer-ai-section">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="footer-ai-badge">
                  <Sparkles size={12} className="text-[#a87d46]" />
                  <span>AI Concierge</span>
                </span>
                <span className="text-xs text-[#747878]">Ask about LuxeAdmin</span>
              </div>
              {activePrompt && (
                <button
                  type="button"
                  onClick={() => {
                    setActivePrompt(null);
                    setCustomAnswer(null);
                  }}
                  className="text-xs text-[#747878] hover:text-[#191c1d] flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Prompt Pills */}
            <div className="footer-ai-pills">
              {AI_PROMPTS.map(prompt => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => {
                    setActivePrompt(prompt);
                    setCustomAnswer(null);
                  }}
                  className={`footer-ai-pill ${
                    activePrompt?.label === prompt.label ? "is-active" : ""
                  }`}
                  aria-label={`Ask AI about ${prompt.label}`}
                >
                  <span className="text-[#a87d46] text-xs font-mono">{prompt.icon}</span>
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>

            {/* AI Response Card */}
            {activePrompt && (
              <div className="footer-ai-response-box animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <div className="footer-ai-avatar">✦</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#191c1d] mb-1">
                      {activePrompt.question}
                    </p>
                    <p className="text-xs text-[#444748] leading-relaxed">{activePrompt.answer}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom AI Query Input */}
            <form onSubmit={handleAskCustom} className="footer-ai-custom-query">
              <input
                type="text"
                placeholder="Ask any question about studio features..."
                value={customQuestion}
                onChange={e => setCustomQuestion(e.target.value)}
                className="footer-ai-input"
              />
              <button
                type="submit"
                disabled={isAiThinking || !customQuestion.trim()}
                className="footer-ai-send"
                aria-label="Send question to AI Concierge"
              >
                {isAiThinking ? (
                  <Sparkles size={13} className="animate-spin text-[#855e2e]" />
                ) : (
                  <Send size={13} />
                )}
              </button>
            </form>

            {customAnswer && (
              <div className="footer-ai-response-box animate-fadeIn mt-2">
                <div className="flex items-start gap-2.5">
                  <div className="footer-ai-avatar">✦</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#444748] leading-relaxed">{customAnswer}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Navigation Columns */}
        <div className="footer-links-columns">
          {navigationSections.map(section => (
            <div className="footer-nav-group" key={section.title}>
              <h3 className="footer-nav-title">{section.title}</h3>
              <ul className="footer-nav-list">
                {section.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer-nav-link group"
                      {...((link as any).external ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      <span>{link.label}</span>
                      {(link as any).badge && (
                        <span className="footer-link-badge">{(link as any).badge}</span>
                      )}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#855e2e]"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              {section.subsections?.map(subsection => (
                <div className="footer-subgroup" key={subsection.title}>
                  <h4 className="footer-nav-subtitle">{subsection.title}</h4>
                  <ul className="footer-nav-list">
                    {subsection.links.map(subLink => (
                      <li key={subLink.label}>
                        <a
                          href={subLink.href}
                          className="footer-nav-link group"
                          {...((subLink as any).external
                            ? { target: "_blank", rel: "noreferrer" }
                            : {})}
                        >
                          <span>{subLink.label}</span>
                          {(subLink as any).badge && (
                            <span className="footer-link-badge">{(subLink as any).badge}</span>
                          )}
                          <ArrowUpRight
                            size={12}
                            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#855e2e]"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
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
          <span>© {new Date().getFullYear()} LuxeAdmin Technologies Inc. All rights reserved.</span>
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

"use client";

import { ArrowRight } from "lucide-react";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FloatingChatWidget } from "@/components/landing/floating-chat-widget";
import { HeroRotatingCard } from "@/components/landing/hero-rotating-card";
import { PricingSection } from "@/components/landing/pricing-section";
import { ResourcesDropdown } from "@/components/landing/resources-dropdown";
import { SiteFooter } from "@/components/landing/site-footer";
import { TrustedBusinesses } from "@/components/landing/trusted-businesses";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useScroll } from "@/hooks";

export function PublicLandingPage() {
  const isScrolled = useScroll(20);

  return (
    <main className="public">
      <header className={`public-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="public-nav-left">
          <nav>
            <a href="#features">Features</a>
            <a href="#workflow">How it works</a>
            <a href="#pricing">Pricing</a>
            <ResourcesDropdown />
            <a href="#faq">FAQ</a>
          </nav>
        </div>
        <BrandLogo className="public-logo" />
        <div className="nav-ctas">
          <a href="/signup">Sign up</a>
          <a className="dark-button bg-[#000000] border-[#000000]" href="/login">
            Enter Studio <ArrowRight size={15} />
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1>
            The operating system for
            <br />
            <em>online vendors & studios.</em>
          </h1>
          <p>
            Create your bespoke 3D digital storefront, broadcast WhatsApp updates, issue itemized
            multi-currency invoices, and track your business valuation—all in one place.
          </p>
          <div className="hero-ctas">
            <a className="dark-button bg-[#000000] border-[#000000]" href="/signup">
              Start 14-day free trial <ArrowRight size={15} />
            </a>
          </div>
        </div>

        <HeroRotatingCard />
      </section>

      <TrustedBusinesses />
      <FeaturesSection />
      <WorkflowSection />
      <PricingSection />
      <FaqSection />
      <SiteFooter />
      <FloatingChatWidget />
    </main>
  );
}

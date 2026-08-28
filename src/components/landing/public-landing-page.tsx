"use client";

import { ArrowRight } from "lucide-react";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroRotatingCard } from "@/components/landing/hero-rotating-card";
import { PricingSection } from "@/components/landing/pricing-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { TrustedBusinesses } from "@/components/landing/trusted-businesses";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { BrandLogo } from "@/components/shared/brand-logo";
import { APP_CONFIG } from "@/constants";
import { useScroll } from "@/hooks";
import { businessProfile } from "@/lib/mock-data";

export function PublicLandingPage() {
  const isScrolled = useScroll(20);
  const slug = businessProfile.slug || APP_CONFIG.defaultSlug;

  return (
    <main className="public">
      <header className={`public-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="public-nav-left">
          <nav>
            <a href="#features">Features</a>
            <a href="#workflow">How it works</a>
            <a href="/signup">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href={`/${slug}`}>Studio Demo</a>
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
            Your digital shop for
            <br />
            <em>online vendors & businesses.</em>
          </h1>
          <p>
            Shopwus (<em>Shop With Us</em>) is the platform that helps you create a quick mini
            storefront, share an interactive 3D business card, broadcast messages, and track
            customers turning visitors into paying clients.
          </p>
          <div className="hero-ctas">
            <a className="dark-button bg-[#000000] border-[#000000]" href="/settings">
              Enter your studio <ArrowRight size={15} />
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
    </main>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroRotatingCard } from "@/components/landing/hero-rotating-card";
import { PricingSection } from "@/components/landing/pricing-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { TrustedBusinesses } from "@/components/landing/trusted-businesses";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useScroll } from "@/hooks";
import { businessProfile } from "@/lib/mock-data";

export function PublicLandingPage() {
  const isScrolled = useScroll(20);
  const slug = businessProfile.slug || "elan-events";

  return (
    <main className="public">
      <header className={`public-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="public-nav-left">
          <nav>
            <a href="#features">Features</a>
            <a href="#workflow">How it works</a>
            <a href="#pricing">Pricing</a>
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
            <em>events & weddings.</em>
          </h1>
          <p>
            Shopwus (<em>Shop With Us</em>) helps creatives, online vendors, and businesses turn
            visitors into paying clients. Share your 3D card, get booking requests on WhatsApp, send
            invoices in seconds, and follow up with clients easily.
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
      <SiteFooter />
    </main>
  );
}

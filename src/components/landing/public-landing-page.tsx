"use client";

import { ArrowRight } from "lucide-react";
import { HeroRotatingCard } from "@/components/landing/hero-rotating-card";
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
          <span className="eyebrow">For the exceptionally intentional</span>
          <h1>
            Make space for
            <br />
            <em>the remarkable.</em>
          </h1>
          <p>
            Shopwus brings your luxury event studio, clientele, and creative storytelling into one
            considered place.
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
      <WorkflowSection />
      <SiteFooter />
    </main>
  );
}

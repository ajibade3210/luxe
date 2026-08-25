"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { HeroRotatingCard } from "@/components/landing/hero-rotating-card";
import { SiteFooter } from "@/components/landing/site-footer";
import { TrustedBusinesses } from "@/components/landing/trusted-businesses";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { businessProfile } from "@/lib/mock-data";

export function PublicLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const slug = businessProfile.slug || "elan-events";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <a href="/" className="public-logo" aria-label="Shopwus home">
          <span className="brand-mark bg-[#000000] text-white">É</span>
          <span>Shopwus</span>
        </a>
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

"use client";

import { useState } from "react";
import { LANDING_PRICING_PLANS } from "@/constants";
import type { BillingPeriod, PricingPlan } from "@/types";

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const getPriceDetails = (plan: PricingPlan) => {
    if (plan.isFreeTrial) {
      return {
        priceMain: "Free",
        periodText: "for 14 days",
        subtext: "₦0 for 14 days, then ₦1,600 / month",
      };
    }

    if (billingPeriod === "monthly") {
      return {
        priceMain: `₦${plan.monthlyPrice.toLocaleString()}`,
        periodText: "/ month",
        subtext: "Billed monthly. Cancel anytime.",
      };
    }

    if (billingPeriod === "biannual") {
      const perMonth = Math.round(plan.biannualPrice / 6);
      return {
        priceMain: `₦${plan.biannualPrice.toLocaleString()}`,
        periodText: "/ 6 months",
        subtext: `₦${perMonth.toLocaleString()} / mo equivalent · 1 month free`,
      };
    }

    // annual
    const perMonth = Math.round(plan.annualPrice / 12);
    return {
      priceMain: `₦${plan.annualPrice.toLocaleString()}`,
      periodText: "/ year",
      subtext: `₦${perMonth.toLocaleString()} / mo equivalent · 2 months free`,
    };
  };

  const displayedPlans = LANDING_PRICING_PLANS.filter(
    plan => billingPeriod === "monthly" || !plan.isFreeTrial
  );

  return (
    <section className="pricing-section" id="pricing" aria-labelledby="pricing-title">
      <div className="pricing-container">
        {/* Section Header */}
        <div className="pricing-header">
          <h2 id="pricing-title">Pick your plan.</h2>
          <p className="pricing-subtitle">
            Create a quick mini storefront, share your 3D card, and track customers. Cancel anytime.
          </p>

          {/* 3-Cycle Billing Toggle */}
          <div className="billing-toggle-container">
            <div className="billing-toggle spotify-toggle">
              <button
                type="button"
                className={`toggle-btn ${billingPeriod === "monthly" ? "is-active" : ""}`}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`toggle-btn ${billingPeriod === "biannual" ? "is-active" : ""}`}
                onClick={() => setBillingPeriod("biannual")}
              >
                <span>Bi-Annual</span>
                <span className="save-badge">1 Mo Free</span>
              </button>
              <button
                type="button"
                className={`toggle-btn ${billingPeriod === "annual" ? "is-active" : ""}`}
                onClick={() => setBillingPeriod("annual")}
              >
                <span>Annual</span>
                <span className="save-badge">2 Mos Free</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spotify-Style Pricing Cards Grid */}
        <div
          className={`pricing-grid spotify-grid ${displayedPlans.length === 2 ? "two-plans-grid" : ""}`}
        >
          {displayedPlans.map(plan => {
            const priceInfo = getPriceDetails(plan);

            return (
              <div
                className={`spotify-pricing-card ${plan.isPopular ? "is-featured" : ""}`}
                key={plan.id}
                style={{ "--accent-color": plan.accentColor } as React.CSSProperties}
              >
                <div className="card-top-content">
                  {/* Top Badge */}
                  <div className="spotify-card-badge-row">
                    <span className="spotify-brand-pill">
                      <span>{plan.badge || "Shopwus"}</span>
                    </span>
                  </div>

                  {/* Plan Name */}
                  <h3 className="spotify-plan-title" style={{ color: plan.accentColor }}>
                    {plan.name}
                  </h3>

                  {/* Price Tagline */}
                  <div className="spotify-price-headline">
                    <span className="spotify-price-amount">{priceInfo.priceMain}</span>
                    <span className="spotify-price-period"> {priceInfo.periodText}</span>
                  </div>

                  <p className="spotify-plan-subtext">{priceInfo.subtext}</p>

                  {/* Features List */}
                  <ul className="spotify-features-list">
                    {plan.features.map(feature => (
                      <li key={feature} className="spotify-feature-item">
                        <span className="spotify-bullet">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA & Footnote */}
                <div className="card-bottom-actions">
                  <a
                    href={`/signup?plan=${plan.id.replace("plan-", "")}&cycle=${billingPeriod}`}
                    className="spotify-pill-cta"
                    style={{
                      backgroundColor: plan.buttonColor,
                      color: plan.buttonTextColor,
                    }}
                  >
                    {plan.ctaLabel}
                  </a>

                  <p className="spotify-terms-note">{plan.termsNote}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Footer */}
        <div className="pricing-reassurance spotify-reassurance">
          <p>No hidden setup fees · Instant activation · Upgrade or cancel anytime</p>
        </div>
      </div>
    </section>
  );
}

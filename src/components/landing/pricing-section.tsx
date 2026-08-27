"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { type BillingPeriod, LANDING_PRICING_PLANS } from "@/constants";

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");

  return (
    <section className="pricing-section" id="pricing" aria-labelledby="pricing-title">
      <div className="pricing-container">
        {/* Section Header */}
        <div className="pricing-header">
          <h2 id="pricing-title">Considered plans for studios at every milestone.</h2>
          <p className="pricing-subtitle">
            Predictable, transparent membership. Scale your luxury atelier with zero hidden fees.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="billing-toggle-container">
            <div className="billing-toggle">
              <button
                type="button"
                className={`toggle-btn ${billingPeriod === "monthly" ? "is-active" : ""}`}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`toggle-btn ${billingPeriod === "annual" ? "is-active" : ""}`}
                onClick={() => setBillingPeriod("annual")}
              >
                <span>Annual</span>
                <span className="save-badge">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid">
          {LANDING_PRICING_PLANS.map(plan => {
            const price = billingPeriod === "annual" ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div className={`pricing-card ${plan.isPopular ? "is-popular" : ""}`} key={plan.id}>
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="popular-badge">
                    <Sparkles size={12} />
                    <span>{plan.badge}</span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-tagline">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="plan-price-box">
                  <span className="currency-symbol">$</span>
                  <span className="price-number">{price}</span>
                  <span className="price-period">/ month</span>
                </div>
                {billingPeriod === "annual" && (
                  <span className="annual-billed-note">Billed annually (${price * 12}/yr)</span>
                )}

                {/* CTA Button */}
                <a
                  href="/signup"
                  className={`plan-cta ${plan.isPopular ? "cta-popular" : "cta-standard"}`}
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight size={14} />
                </a>

                {/* Feature Checklist */}
                <div className="plan-features-wrapper">
                  <span className="features-label">Included in membership:</span>
                  <ul className="plan-features-list">
                    {plan.features.map(feature => (
                      <li key={feature} className="plan-feature-item">
                        <Check size={15} className="feature-check" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Footer */}
        <div className="pricing-reassurance">
          <p>
            All plans include a 14-day private trial · No credit card required to start · Cancel or
            upgrade anytime
          </p>
        </div>
      </div>
    </section>
  );
}

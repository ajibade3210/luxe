"use client";

import { ShieldCheck } from "lucide-react";
import { LANDING_FEATURES } from "@/constants";

export function FeaturesSection() {
  return (
    <section className="features-section" id="features" aria-labelledby="features-title">
      <div className="features-container">
        {/* Section Header */}
        <div className="features-header">
          <span className="features-eyebrow">Platform Capabilities</span>
          <h2 id="features-title">Everything required to orchestrate remarkable luxury events.</h2>
          <p className="features-subtitle">
            Engineered exclusively for luxury wedding ateliers, corporate gala architects, and
            private estate scenographers.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="features-grid">
          {LANDING_FEATURES.map(feat => {
            const Icon = feat.icon;
            return (
              <div className="feature-card" key={feat.id}>
                {/* Top Badge & Icon */}
                <div className="feature-card-header">
                  <div className="feature-icon-box">
                    <Icon size={20} />
                  </div>
                  <span className="feature-badge">{feat.badge}</span>
                </div>

                {/* Content */}
                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc">{feat.description}</p>

                {/* Highlights List */}
                <ul className="feature-highlights">
                  {feat.highlights.map((highlight, i) => (
                    <li key={`${feat.id}-${i}`}>
                      <ShieldCheck size={14} className="feature-check-icon" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

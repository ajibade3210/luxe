"use client";

import { LANDING_FEATURES } from "@/constants";

export function FeaturesSection() {
  return (
    <section className="features-section" id="features" aria-labelledby="features-title">
      <div className="features-container">
        {/* Section Header */}
        <div className="features-header">
          <h2 id="features-title">Everything you need to run your business.</h2>
        </div>

        {/* Clean Stacked Features List */}
        <div className="showcase-list-container">
          <div className="showcase-list">
            {LANDING_FEATURES.map(feat => {
              const Icon = feat.icon;
              return (
                <div className="showcase-item" key={feat.id}>
                  <div
                    className="showcase-icon-bubble"
                    style={{
                      backgroundColor: feat.iconBg,
                      color: feat.iconColor,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="showcase-item-content">
                    <h3 className="showcase-item-title">{feat.title}</h3>
                    <p className="showcase-item-desc">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

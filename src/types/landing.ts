import type { ComponentType } from "react";

// Landing and public marketing types
export interface OrganizationPreview {
  id: string;
  name: string;
  slug: string;
  eyebrow: string;
  tagline: string;
  logoUrl: string;
  badge: string;
}

export type BillingPeriod = "monthly" | "biannual" | "annual";

export interface FeatureItem {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  iconBg: string;
  iconColor: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  isFreeTrial?: boolean;
  accentColor: string;
  buttonColor: string;
  buttonTextColor: string;
  monthlyPrice: number;
  biannualPrice: number;
  annualPrice: number;
  features: string[];
  ctaLabel: string;
  termsNote: string;
}

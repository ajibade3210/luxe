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
  socialProofBadge?: string;
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

export interface FooterNavLink {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
}

export interface FooterNavSubsection {
  title: string;
  links: FooterNavLink[];
}

export interface FooterNavSection {
  title: string;
  links: FooterNavLink[];
  subsections?: FooterNavSubsection[];
}

export interface AiPrompt {
  label: string;
  icon: string;
  question: string;
  answer: string;
}

export interface HeroRotatingCardProps {
  organizations?: OrganizationPreview[];
  intervalMs?: number;
}

export interface LogoRowProps {
  organizations: OrganizationPreview[];
  reverse?: boolean;
}

export interface NotFoundViewProps {
  slug?: string;
}

export interface AnimatedWorkflowConnectorProps {
  className?: string;
}

export interface MobileVerticalConnectorProps {
  stepNumber: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

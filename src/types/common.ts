import type { ReactNode } from "react";

// Common shared utility types
export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";
export type ButtonRadiusType = "Square" | "Subtle" | "Rounded" | "Pill";

export interface FormatMoneyOptions {
  decimals?: number;
}

export interface BrandLogoProps {
  monogram?: string;
  name?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light" | "custom";
  href?: string;
  className?: string;
  monogramClassName?: string;
  textClassName?: string;
}

export interface CardProps {
  number?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export interface ToggleProps {
  on: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

export interface AdminToastContextType {
  showToast: (message: string) => void;
}

export interface ToastProps {
  message: string;
  onClose: () => void;
}

export interface AdminLayoutProps {
  children: ReactNode;
  path?: string;
  onToast?: (s: string) => void;
}

export interface AdminSidebarProps {
  path: string;
  open: boolean;
  onClose: () => void;
}

export interface AdminHeaderProps {
  onMenu: () => void;
  onToast: (s: string) => void;
}

export interface AnalyticsPageProps {
  onToast?: (message: string) => void;
}

export interface LeadsPageProps {
  onToast?: (s: string) => void;
}

export interface CustomersPageProps {
  onToast?: (message: string) => void;
}

export interface EnhancedSettingsPageProps {
  onToast?: (s: string) => void;
}

export interface ProfileSettingsPageProps {
  onToast?: (message: string) => void;
}

export interface IconProps {
  className?: string;
}

export interface MetricProps {
  label: string;
  value: string;
  detail?: string;
}

export interface PageTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export interface UseSettingsFormOptions {
  notify: (msg: string) => void;
}

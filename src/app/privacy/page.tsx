import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/landing/privacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Shopwus Atelier",
  description:
    "Learn how Shopwus protects your studio data, financial ledgers, valuation models, and customer records in compliance with the Nigeria Data Protection Act (NDPA).",
};

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}

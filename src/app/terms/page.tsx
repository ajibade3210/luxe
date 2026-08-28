import type { Metadata } from "next";
import { TermsOfServicePage } from "@/components/landing/terms-page";

export const metadata: Metadata = {
  title: "Terms of Service | Shopwus",
  description:
    "Review the Terms and Conditions for using the Shopwus digital studio operating system, including subscriptions, trial periods, valuation benchmarking, and data rights.",
};

export default function TermsPage() {
  return <TermsOfServicePage />;
}

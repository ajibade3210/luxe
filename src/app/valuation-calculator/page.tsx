import type { Metadata } from "next";
import { ValuationCalculatorPage } from "@/components/calculator/valuation-calculator-page";

export const metadata: Metadata = {
  title: "Business Valuation Calculator | Shopwus",
  description:
    "Free interactive Business Valuation Calculator for online vendors, merchants, and independent businesses. Calculate your company worth, SDE multiple, and net asset value.",
  openGraph: {
    title: "Business Valuation Calculator | Shopwus",
    description:
      "Estimate your business worth, earnings multiple, and balance sheet equity in 60 seconds.",
  },
};

export default function ValuationCalculatorRoute() {
  return <ValuationCalculatorPage />;
}

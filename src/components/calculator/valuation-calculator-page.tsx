"use client";

import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/landing/site-footer";
import { BrandLogo } from "@/components/shared/brand-logo";
import { DEFAULT_PUBLIC_VALUATION_INPUTS } from "@/constants/valuation";
import { calculatePublicValuation } from "@/services/api/valuation.service";
import type { PublicValuationInputs } from "@/types";
import { ValuationGuideSection } from "./valuation-guide-section";
import { ValuationInputForm } from "./valuation-input-form";
import { ValuationResultsDisplay } from "./valuation-results-display";
import { ValuationShopwusHelp } from "./valuation-shopwus-help";

export function ValuationCalculatorPage() {
  const [inputs, setInputs] = useState<PublicValuationInputs>({
    ...DEFAULT_PUBLIC_VALUATION_INPUTS,
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const handleFieldChange = <K extends keyof PublicValuationInputs>(
    field: K,
    value: PublicValuationInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const result = useMemo(() => {
    return calculatePublicValuation(inputs);
  }, [inputs]);

  const handleManualCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1f1d1a]">
      {/* Top Header Navigation */}
      <header className="border-b border-[#eee7dc] bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#665e57] hover:text-[#1f1d1a] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </a>
            <span className="text-[#ded5c8] hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#8c827a]">
              <span>Resources</span>
              <span>/</span>
              <span className="text-[#1f1d1a] font-bold">Valuation Calculator</span>
            </div>
          </div>

          <BrandLogo className="public-logo" />

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-xs font-semibold text-[#524a43] hover:text-[#1f1d1a] hidden sm:inline"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="bg-[#191c1d] hover:bg-black !text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#ffedd5] text-[#ea580c] border border-[#fed7aa]">
            <Calculator size={13} />
            <span>Interactive Business Appraisal Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1f1d1a] tracking-tight leading-tight">
            Business Valuation Calculator
          </h1>
          <p className="text-sm sm:text-base text-[#665e57] leading-relaxed">
            Estimate the market worth of your company in seconds using industry SDE multiples, net
            profit run-rates, and balance sheet assets.
          </p>
        </section>

        {/* 2-Column Calculator Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ValuationInputForm
            values={inputs}
            onChange={handleFieldChange}
            onCalculate={handleManualCalculate}
            isCalculating={isCalculating}
          />
          <ValuationResultsDisplay result={result} onRecalculate={handleManualCalculate} />
        </section>

        {/* Educational Guide Section */}
        <ValuationGuideSection />

        {/* Shopwus Help & Value Growth Section */}
        <ValuationShopwusHelp />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

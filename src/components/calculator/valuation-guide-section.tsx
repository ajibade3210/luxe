"use client";

import { CheckCircle2 } from "lucide-react";
import { VALUATION_HOW_CALCULATED_SECTIONS, VALUATION_PURPOSE_GUIDES } from "@/constants/valuation";

export function ValuationGuideSection() {
  return (
    <section className="space-y-12">
      {/* 1. How is the value of a business calculated? */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e633d]">
            Valuation Frameworks
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1d1a]">
            How is the value of a business calculated?
          </h2>
          <p className="text-xs sm:text-sm text-[#665e57] leading-relaxed">
            Professional business appraisers and acquirers use a combination of cashflow multiples,
            balance sheet assets, and customer equity to establish fair market value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {VALUATION_HOW_CALCULATED_SECTIONS.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#eee7dc] rounded-2xl p-5 shadow-[0_2px_12px_rgba(70,50,30,0.02)] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faf7f2] border border-[#ded5c8] text-[#9e633d]">
                  {sec.badge}
                </div>
                <h3 className="text-sm font-bold text-[#1f1d1a]">{sec.title}</h3>
                <p className="text-xs text-[#665e57] leading-relaxed">{sec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. How can I value a business? (For Selling, For Buying, For Investing) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e633d]">
            Strategic Applications
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1d1a]">
            How can I value a business?
          </h2>
          <p className="text-xs sm:text-sm text-[#665e57] leading-relaxed">
            Different transactions demand different angles of financial scrutiny. Here is how
            valuation is applied across the three primary commercial use cases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {VALUATION_PURPOSE_GUIDES.map(guide => (
            <div
              key={guide.id}
              className="bg-white border border-[#eee7dc] rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-[#c59a78]/60 transition-colors"
            >
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e633d]">
                    {guide.eyebrow}
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#1f1d1a] mt-0.5">
                    {guide.title}
                  </h3>
                </div>

                <p className="text-xs text-[#665e57] leading-relaxed">{guide.summary}</p>

                <div className="border-t border-[#f4eee6] pt-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block">
                    Key Action Checklist:
                  </span>
                  <ul className="space-y-2">
                    {guide.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-[#524a43]">
                        <CheckCircle2 size={14} className="text-[#059669] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

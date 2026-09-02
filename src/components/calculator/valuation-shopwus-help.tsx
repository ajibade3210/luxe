import { ArrowRight } from "lucide-react";
import { VALUATION_SHOPWUS_BENEFITS } from "@/constants/valuation";

export function ValuationShopwusHelp() {
  return (
    <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#eee7dc] shadow-[0_2px_16px_rgba(70,50,30,0.03)] space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1d1a] leading-tight tracking-tight">
          How to Increase Your Business Valuation with Shopwus
        </h2>
        <p className="text-xs sm:text-sm text-[#665e57] leading-relaxed">
          Your business is worth more when it runs on clean systems instead of scattered DMs. Here
          is how Shopwus helps you command a higher market multiple.
        </p>
      </div>

      {/* 4 Value Driver Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {VALUATION_SHOPWUS_BENEFITS.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#faf7f2] border border-[#e8dfd2] rounded-2xl p-6 space-y-2.5 hover:border-[#c59a78]/60 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#1f1d1a] leading-snug">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#665e57] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Banner */}
      <div className="border-t border-[#f4eee6] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-[#1f1d1a]">
            Ready to track and grow your valuation?
          </h4>
          <p className="text-xs text-[#8c827a]">
            Start your free trial in under 60 seconds. No credit card required.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/signup"
            className="bg-[#191c1d] hover:bg-black !text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Start My Free Trial Now</span>
            <ArrowRight size={14} />
          </a>
          <a
            href="/login"
            className="bg-white hover:bg-[#faf7f2] text-[#1f1d1a] border border-[#ded5c8] px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Enter Studio
          </a>
        </div>
      </div>
    </section>
  );
}

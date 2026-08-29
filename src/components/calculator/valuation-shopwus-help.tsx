import { ArrowRight } from "lucide-react";
import { VALUATION_SHOPWUS_BENEFITS } from "@/constants/valuation";

export function ValuationShopwusHelp() {
  return (
    <section className="bg-gradient-to-br from-[#1f1d1a] to-[#2a2622] text-white rounded-3xl p-8 sm:p-10 border border-[#3d3630] shadow-xl space-y-8">
      <div className="max-w-3xl space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c59a78]">
          Enterprise Multiplier Advantage
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
          How Shopwus helps you grow and multiply your business valuation
        </h2>
        <p className="text-xs sm:text-sm text-[#ded5c8] leading-relaxed">
          Valuation is not luck; it is systematic operational engineering. Here is how our suite
          transforms an informal shop into an institutional, highly sellable company.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {VALUATION_SHOPWUS_BENEFITS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2 hover:bg-white/10 transition-colors"
          >
            <h3 className="text-sm font-bold text-white">{item.title}</h3>
            <p className="text-xs text-[#ded5c8] leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white">
            Ready to build a transferable, high-valuation studio?
          </h4>
          <p className="text-xs text-[#b5a99f]">
            Start your 14-day free trial. Setup takes under 60 seconds with zero credit card.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/signup"
            className="bg-[#c59a78] hover:bg-[#b08563] text-[#1f1d1a] px-5 py-3 rounded-xl text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight size={14} />
          </a>
          <a
            href="/login"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-xl text-xs font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Enter Studio
          </a>
        </div>
      </div>
    </section>
  );
}

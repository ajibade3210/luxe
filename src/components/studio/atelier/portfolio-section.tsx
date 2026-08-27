import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE, DEFAULT_BUSINESS_TYPE } from "@/constants";
import type { StudioPortfolioSectionProps } from "@/types";

export function StudioPortfolioSection({
  portfolio,
  setSelectedProject,
  setQuoteModalOpen: _setQuoteModalOpen,
  businessType,
  primaryColor,
  buttonColor: _buttonColor,
  textColor,
  radiusClass: _radiusClass,
}: StudioPortfolioSectionProps) {
  return (
    <section id="portfolio" className="scroll-mt-24">
      <div className="mb-8">
        <h2 style={{ color: textColor }} className="font-serif text-2xl sm:text-3xl font-normal">
          {BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE[businessType ?? DEFAULT_BUSINESS_TYPE]}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((proj, idx) => (
          <div
            key={proj.id || idx}
            onClick={() => setSelectedProject(proj)}
            className="group bg-white border border-[#e8dfd3] rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#faf6f0]">
              <Image
                src={proj.image}
                alt={proj.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#1c1917] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                {proj.category}
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-[#1c1917] text-xs font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <span>View Project</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            <div className="p-6">
              <span className="text-[10px] font-mono text-[#8c8278] uppercase tracking-wider block mb-1">
                {proj.location}
              </span>
              <h3 className="font-serif text-xl text-[#1c1917] font-normal group-hover:text-[#0058be] transition-colors leading-snug">
                {proj.title}
              </h3>
              {proj.description && (
                <p className="text-xs text-[#6b645c] mt-2 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              )}
              <div className="mt-4 pt-2 flex items-center justify-end text-[11px]">
                <span
                  style={{ color: primaryColor }}
                  className="font-medium group-hover:underline flex items-center gap-0.5"
                >
                  Explore <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { ArrowRight, Sparkles } from "lucide-react";
import type { PortfolioProject } from "@/lib/types";

interface StudioPortfolioSectionProps {
  portfolio: PortfolioProject[];
  setSelectedProject: (p: PortfolioProject | null) => void;
  setQuoteModalOpen: (v: boolean) => void;
  primaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export function StudioPortfolioSection({
  portfolio,
  setSelectedProject,
  setQuoteModalOpen,
  primaryColor,
  buttonColor,
  radiusClass,
}: StudioPortfolioSectionProps) {
  return (
    <section id="portfolio" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#ebd8ca]">
        <div>
          <span
            style={{ color: primaryColor }}
            className="text-[10px] uppercase tracking-[0.2em] font-semibold block"
          >
            Curated Portfolio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal mt-1">
            Our Best Work
          </h2>
          <p className="text-xs sm:text-sm text-[#78716c] mt-1">
            A selective archive of grand celebrations, destination weddings, and curated galas.
          </p>
        </div>

        <button
          onClick={() => setQuoteModalOpen(true)}
          style={{ backgroundColor: buttonColor }}
          className={`text-white text-xs font-medium px-5 py-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start md:self-auto ${radiusClass}`}
        >
          Commission Atelier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((proj, idx) => (
          <div
            key={proj.id || idx}
            onClick={() => setSelectedProject(proj)}
            className="group bg-white border border-[#e8dfd3] rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#faf6f0]">
              <img
                src={proj.image}
                alt={proj.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              <div className="mt-4 pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-[11px] text-[#78716c]">
                <span className="flex items-center gap-1">
                  <Sparkles size={12} className="text-[#a87d46]" />
                  <span>{proj.stats}</span>
                </span>
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

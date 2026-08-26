import { Info } from "lucide-react";
import type { ReactNode } from "react";

interface CardProps {
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Card({ number, title, description, children }: CardProps) {
  return (
    <section className="settings-card">
      <div className="settings-card-heading">
        <div className="flex items-center">
          <span className="step">{number}</span>
          <h2>{title}</h2>
          {description && (
            <div className="relative group/info inline-flex items-center ml-1.5 self-center">
              <button
                type="button"
                aria-label={description}
                className="text-[#9ca3af] hover:text-[#0058be] transition-colors p-1 rounded-full hover:bg-[#f3f4f5] cursor-pointer"
              >
                <Info size={15} />
              </button>
              {/* Tooltip on hover */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover/info:block z-30 pointer-events-none">
                <div className="bg-[#191c1d] text-white text-[11px] font-normal leading-relaxed rounded py-1.5 px-3 whitespace-nowrap shadow-xl border border-[#333] relative">
                  {description}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#191c1d] rotate-45 border-b border-l border-[#333]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

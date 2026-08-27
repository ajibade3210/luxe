import { ArrowRight } from "lucide-react";
import type { StudioServicesSectionProps } from "@/types";
import { isDarkColor } from "@/utils/helpers";

export function StudioServicesSection({
  profile,
  setQuoteModalOpen,
  setQuoteForm,
  primaryColor,
  secondaryColor: _secondaryColor,
  buttonColor: _buttonColor,
  textColor,
  radiusClass: _radiusClass,
}: StudioServicesSectionProps) {
  const services = profile.services || [];

  return (
    <section id="services" className="scroll-mt-24">
      <div className="mb-8">
        <h2 style={{ color: textColor }} className="font-serif text-2xl sm:text-3xl font-normal">
          Services
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, idx) => (
          <div
            key={service.id || idx}
            className="bg-white border border-[#e8dfd3] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
          >
            <div>
              <div className="mb-3.5">
                <span
                  style={{
                    backgroundColor: `${primaryColor}14`,
                    color: isDarkColor(primaryColor) ? primaryColor : "#1c1917",
                    borderColor: `${primaryColor}28`,
                  }}
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full border inline-block shadow-2xs"
                >
                  {service.category || "Bespoke"}
                </span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl text-[#1c1917] font-normal mb-2 group-hover:text-[#0058be] transition-colors">
                {service.name}
              </h3>

              <p className="text-xs text-[#666059] leading-relaxed mb-4">
                {service.description ||
                  "Comprehensive design, vendor curation, on-site choreography, and bespoke styling tailored to your aesthetic vision."}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setQuoteForm(prev => ({
                    ...prev,
                    service: service.name,
                  }));
                  setQuoteModalOpen(true);
                }}
                style={{ color: primaryColor }}
                className="text-xs font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Inquire</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

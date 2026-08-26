import { ArrowRight, Check } from "lucide-react";
import type { BusinessProfile, ServiceItem } from "@/lib/types";

interface ServicesSectionProps {
  profile: BusinessProfile;
  setQuoteModalOpen: (v: boolean) => void;
  setQuoteForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      service: string;
      eventDate: string;
      budget: string;
      message: string;
    }>
  >;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export function StudioServicesSection({
  profile,
  setQuoteModalOpen,
  setQuoteForm,
  primaryColor,
  secondaryColor,
  buttonColor: _buttonColor,
  radiusClass: _radiusClass,
}: ServicesSectionProps) {
  const services = (profile.services as ServiceItem[]) || [];

  return (
    <section id="services" className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">Services</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <div
            key={service.id || idx}
            className="bg-white border border-[#e8dfd3] rounded-3xl p-7 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  style={{
                    backgroundColor: secondaryColor,
                    color: primaryColor,
                    borderColor: `${primaryColor}30`,
                  }}
                  className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border"
                >
                  {service.category || "Bespoke"}
                </span>
                <span className="text-xs font-mono text-[#a89e92]">0{idx + 1}</span>
              </div>

              <h3 className="font-serif text-xl text-[#1c1917] font-normal mb-2 group-hover:text-[#0058be] transition-colors">
                {service.name}
              </h3>

              <p className="text-xs text-[#666059] leading-relaxed mb-6">
                {service.description ||
                  "Comprehensive design, vendor curation, on-site choreography, and bespoke styling tailored to your aesthetic vision."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#f0e8dc] flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#78716c] flex items-center gap-1.5">
                <Check size={13} style={{ color: primaryColor }} /> White-glove execution
              </span>
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

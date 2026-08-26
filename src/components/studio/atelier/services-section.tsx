import { ArrowRight } from "lucide-react";
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, idx) => (
          <div
            key={service.id || idx}
            className="bg-white border border-[#e8dfd3] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
          >
            <div>
              <div className="mb-3">
                <span
                  style={{
                    backgroundColor: secondaryColor,
                    color: primaryColor,
                    borderColor: `${primaryColor}30`,
                  }}
                  className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block"
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

import { Clock3, Mail, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared";
import { Card } from "./card";
import { Toggle } from "./toggle";

interface ContactSectionProps {
  hours: string;
  setHours: (v: string) => void;
  timeFrom: string;
  setTimeFrom: (v: string) => void;
  timeTo: string;
  setTimeTo: (v: string) => void;
  byAppointmentOnly: boolean;
  setByAppointmentOnly: (v: boolean) => void;
  whatsAppNumber: string;
  setWhatsAppNumber: (v: string) => void;
  emailAddress: string;
  setEmailAddress: (v: string) => void;
  physicalAddress: string;
  setPhysicalAddress: (v: string) => void;
}

export function ContactSection({
  hours,
  setHours,
  timeFrom,
  setTimeFrom,
  timeTo,
  setTimeTo,
  byAppointmentOnly,
  setByAppointmentOnly,
  whatsAppNumber,
  setWhatsAppNumber,
  emailAddress,
  setEmailAddress,
  physicalAddress,
  setPhysicalAddress,
}: ContactSectionProps) {
  return (
    <Card
      title="Contact & Location"
      description="Public operational coordinates displayed on your flagship atelier."
    >
      <div className="contact-grid">
        <div className="hours-block">
          <span className="eyebrow">Operating hours</span>
          <div className="hours-input-wrapper">
            <Clock3 />
            <input
              type="text"
              value={hours}
              onChange={e => setHours(e.target.value)}
              placeholder="e.g. Monday – Saturday"
              className="text-xs font-medium border-0 p-0 bg-transparent text-[#1c1917] outline-none w-full"
            />
          </div>
          <div className="time-select-row">
            <input
              type="text"
              value={timeFrom}
              onChange={e => setTimeFrom(e.target.value)}
              className="text-xs font-medium border border-[#e7e5e4] rounded-lg px-2 py-1 bg-white text-[#1c1917] outline-none"
            />
            <span className="text-xs text-[#a8a29e]">to</span>
            <input
              type="text"
              value={timeTo}
              onChange={e => setTimeTo(e.target.value)}
              className="text-xs font-medium border border-[#e7e5e4] rounded-lg px-2 py-1 bg-white text-[#1c1917] outline-none"
            />
          </div>
          <label className="switch-label mt-3 flex items-center gap-2 cursor-pointer">
            <Toggle
              on={byAppointmentOnly}
              onClick={() => setByAppointmentOnly(!byAppointmentOnly)}
            />
            <span>By appointment only</span>
          </label>
        </div>

        <div className="contact-stack">
          <span className="eyebrow">Contact details</span>
          <div>
            <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
            <div className="w-full">
              <span className="text-[10px] text-[#78716c]">WhatsApp number</span>
              <input
                value={whatsAppNumber}
                onChange={e => setWhatsAppNumber(e.target.value)}
                className="text-xs font-medium border-0 p-0 bg-transparent text-[#1c1917] outline-none w-full"
              />
            </div>
          </div>

          <div>
            <Mail />
            <div className="w-full">
              <span className="text-[10px] text-[#78716c]">Email address</span>
              <input
                value={emailAddress}
                onChange={e => setEmailAddress(e.target.value)}
                className="text-xs font-medium border-0 p-0 bg-transparent text-[#1c1917] outline-none w-full"
              />
            </div>
          </div>
          <div>
            <MapPin />
            <div className="w-full">
              <span className="text-[10px] text-[#78716c]">Physical address</span>
              <input
                value={physicalAddress}
                onChange={e => setPhysicalAddress(e.target.value)}
                className="text-xs font-medium border-0 p-0 bg-transparent text-[#1c1917] outline-none w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

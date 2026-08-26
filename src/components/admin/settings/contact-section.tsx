import { Clock3, Mail, MapPin, MessageSquare } from "lucide-react";
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
      title="Business Details"
      description="Detailed operational and contact information rendered in the stationery card."
    >
      <div className="details-columns">
        <div>
          <span className="eyebrow">Operating hours</span>
          <div className="hour-tabs">
            {["Mon–Fri", "Mon–Sat", "Everyday"].map(item => (
              <button
                type="button"
                className={hours === item ? "selected" : ""}
                onClick={() => setHours(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="time-row">
            <span className="flex-1">
              From
              <input
                type="text"
                value={timeFrom}
                onChange={e => setTimeFrom(e.target.value)}
                className="font-bold text-xs border-0 p-0 bg-transparent text-[#1c1917] outline-none"
              />
            </span>
            <Clock3 />
            <span className="flex-1">
              To
              <input
                type="text"
                value={timeTo}
                onChange={e => setTimeTo(e.target.value)}
                className="font-bold text-xs border-0 p-0 bg-transparent text-[#1c1917] outline-none"
              />
            </span>
            <Clock3 />
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
            <MessageSquare />
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

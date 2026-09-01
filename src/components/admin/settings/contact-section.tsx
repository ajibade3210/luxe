import type { ContactSectionProps } from "@/types";
import { isValidTimeFormat, normalizeTimeInput } from "@/utils";
import { Card } from "./card";
import { Toggle } from "./toggle";

const SCHEDULE_ROW_1 = ["Mon–Fri", "Mon–Sat", "Daily"] as const;
const SCHEDULE_ROW_2 = ["Tue–Sat", "Weekends Only"] as const;

const TIME_PRESETS = [
  { label: "9 AM–6 PM", from: "09:00 AM", to: "06:00 PM" },
  { label: "8 AM–5 PM", from: "08:00 AM", to: "05:00 PM" },
] as const;

const TIME_DATALIST_OPTIONS = [
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
] as const;

export function ContactSection({
  hours,
  setHours,
  timeFrom,
  setTimeFrom,
  timeTo,
  setTimeTo,
  byAppointmentOnly,
  setByAppointmentOnly,
}: ContactSectionProps) {
  const isFromValid = !timeFrom || isValidTimeFormat(timeFrom);
  const isToValid = !timeTo || isValidTimeFormat(timeTo);

  const handleFromBlur = () => {
    setTimeFrom(normalizeTimeInput(timeFrom, "09:00 AM"));
  };

  const handleToBlur = () => {
    setTimeTo(normalizeTimeInput(timeTo, "06:00 PM"));
  };

  return (
    <Card
      title="Opening"
      description="Public operational coordinates and consultation availability displayed on your atelier."
    >
      <datalist id="operating-time-options">
        {TIME_DATALIST_OPTIONS.map(opt => (
          <option key={opt} value={opt} />
        ))}
      </datalist>

      <div className="space-y-6">
        {/* 2-Column Side-by-Side Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Operating Days */}
          <div className="space-y-2.5">
            <div className="flex items-center bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 select-none shadow-2xs">
              <span className="text-xs font-medium text-[#191c1d]">
                {hours || "Operating Days"}
              </span>
            </div>

            {/* Presets stacked over each other in 2 distinct rows */}
            <div className="space-y-1.5 pt-0.5">
              {/* Row 1: Mon-Fri, Mon-Sat, Daily */}
              <div className="flex items-center gap-1.5">
                {SCHEDULE_ROW_1.map(preset => {
                  const isSelected = hours.toLowerCase() === preset.toLowerCase();
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setHours(preset)}
                      className={`text-[11px] font-medium px-3 py-1 rounded-md transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#111827] text-white border-[#111827] shadow-2xs font-semibold"
                          : "bg-white text-[#4b5563] border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#fafaf9]"
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Tue-Sat, Weekends Only */}
              <div className="flex items-center gap-1.5">
                {SCHEDULE_ROW_2.map(preset => {
                  const isSelected = hours.toLowerCase() === preset.toLowerCase();
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setHours(preset)}
                      className={`text-[11px] font-medium px-3 py-1 rounded-md transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#111827] text-white border-[#111827] shadow-2xs font-semibold"
                          : "bg-white text-[#4b5563] border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#fafaf9]"
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Working Hours */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center bg-[#f9fafb] border rounded-lg px-3 py-2 transition-colors shadow-2xs flex-1 ${
                  isFromValid ? "border-[#e5e7eb]" : "border-amber-400 bg-amber-50/40"
                }`}
              >
                <input
                  type="text"
                  list="operating-time-options"
                  value={timeFrom}
                  onChange={e => setTimeFrom(e.target.value)}
                  onBlur={handleFromBlur}
                  placeholder="09:00 AM"
                  className="w-full !text-xs text-[#191c1d] !border-0 !p-0 !outline-none placeholder:text-[#9ca3af] !bg-transparent font-medium !min-h-0 !h-auto !rounded-none text-center sm:text-left"
                />
              </div>
              <span className="text-xs text-[#9ca3af] font-semibold shrink-0">to</span>
              <div
                className={`flex items-center bg-[#f9fafb] border rounded-lg px-3 py-2 transition-colors shadow-2xs flex-1 ${
                  isToValid ? "border-[#e5e7eb]" : "border-amber-400 bg-amber-50/40"
                }`}
              >
                <input
                  type="text"
                  list="operating-time-options"
                  value={timeTo}
                  onChange={e => setTimeTo(e.target.value)}
                  onBlur={handleToBlur}
                  placeholder="06:00 PM"
                  className="w-full !text-xs text-[#191c1d] !border-0 !p-0 !outline-none placeholder:text-[#9ca3af] !bg-transparent font-medium !min-h-0 !h-auto !rounded-none text-center sm:text-left"
                />
              </div>
            </div>

            {/* Frequently used label & Presets */}
            <div className="space-y-1.5 pt-0.5">
              <span className="text-[11px] text-[#6b7280] font-medium block">Frequently used:</span>
              <div className="flex items-center gap-1.5">
                {TIME_PRESETS.map(preset => {
                  const isSelected = timeFrom === preset.from && timeTo === preset.to;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setTimeFrom(preset.from);
                        setTimeTo(preset.to);
                      }}
                      className={`text-[11px] font-medium px-3 py-1 rounded-md transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#111827] text-white border-[#111827] shadow-2xs font-semibold"
                          : "bg-white text-[#4b5563] border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#fafaf9]"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: By Appointment Only Row */}
        <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#1c1917]">By Appointment Only</div>
            <div className="text-[11px] text-[#6b7280] mt-0.5">
              Require clients to book confirmed consultations before visits.
            </div>
          </div>
          <Toggle on={byAppointmentOnly} onClick={() => setByAppointmentOnly(!byAppointmentOnly)} />
        </div>
      </div>
    </Card>
  );
}

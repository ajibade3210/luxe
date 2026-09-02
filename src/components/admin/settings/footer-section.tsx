import {
  MAX_FOOTER_DESC_LENGTH,
  MAX_FOOTER_EYEBROW_LENGTH,
  MAX_FOOTER_TITLE_LENGTH,
} from "@/constants";
import type { FooterSectionProps } from "@/types";
import { Card } from "./card";
import { Toggle } from "./toggle";

export function FooterSection({
  footerEyebrow,
  setFooterEyebrow,
  footerTitle,
  setFooterTitle,
  footerDescription,
  setFooterDescription,
  showFooterCta,
  setShowFooterCta,
}: FooterSectionProps) {
  return (
    <Card
      title="Closing Call To Action"
      description="Customize the headline, narrative, and visibility of your public studio's final closing inquiry banner."
      action={
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6b7280]">Show on page</span>
          <Toggle
            on={showFooterCta}
            onClick={() => setShowFooterCta(!showFooterCta)}
            ariaLabel="Toggle closing CTA banner visibility"
          />
        </div>
      }
    >
      <div className="space-y-5">
        {!showFooterCta && (
          <div className="bg-[#fef3c7] text-[#92400e] text-xs px-3.5 py-2.5 rounded-xl border border-[#fde68a]">
            This closing inquiry banner is currently hidden on your public studio page.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#374151] uppercase tracking-wide block">
              Eyebrow / Subtitle (max {MAX_FOOTER_EYEBROW_LENGTH} chars)
            </label>
            <input
              type="text"
              maxLength={MAX_FOOTER_EYEBROW_LENGTH}
              placeholder="e.g. Begin Your Journey"
              value={footerEyebrow}
              onChange={e => setFooterEyebrow(e.target.value)}
              className="w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2 text-xs text-[#111827] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#374151] uppercase tracking-wide block">
              Main Headline (max {MAX_FOOTER_TITLE_LENGTH} chars)
            </label>
            <input
              type="text"
              maxLength={MAX_FOOTER_TITLE_LENGTH}
              placeholder="e.g. Ready to Create Something Extraordinary?"
              value={footerTitle}
              onChange={e => setFooterTitle(e.target.value)}
              className="w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2 text-xs text-[#111827] focus:outline-none transition-colors font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#374151] uppercase tracking-wide block">
            Closing Narrative (max {MAX_FOOTER_DESC_LENGTH} chars)
          </label>
          <textarea
            rows={3}
            maxLength={MAX_FOOTER_DESC_LENGTH}
            placeholder="Tell prospective clients what to expect and how to get in touch..."
            value={footerDescription}
            onChange={e => setFooterDescription(e.target.value)}
            className="w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none resize-none leading-relaxed transition-colors"
          />
        </div>
      </div>
    </Card>
  );
}

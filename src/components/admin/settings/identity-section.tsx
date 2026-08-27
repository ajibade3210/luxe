import { Copy, Loader2, Upload } from "lucide-react";
import { BUSINESS_TYPE_CTA_MAP, BUSINESS_TYPE_LABELS } from "@/constants";
import type { BusinessType, CurrencyCode, IdentitySectionProps } from "@/types";
import { Card } from "./card";

export function IdentitySection({
  name,
  setName,
  slug,
  setSlug,
  slugStatus,
  tagline,
  setTagline,
  location,
  setLocation,
  website,
  setWebsite,
  email,
  setEmail,
  currency = "NGN",
  setCurrency,
  businessType,
  setBusinessType,
  about,
  setAbout,
  logoUrl,
  setLogoUrl,
  isUploadingLogo,
  handleLogoUpload,
  onToast,
}: IdentitySectionProps) {
  return (
    <Card
      title="Business profile"
      description="The foundation of your public customer-facing presence."
    >
      <div className="space-y-7">
        {/* Logo Upload Section */}
        <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-xl p-6 sm:p-7 shadow-2xs space-y-6">
          <div className="border-b border-[#e5e7eb] pb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0058be] block">
              Business Brand Logo
            </span>
            <span className="text-xs text-[#6b7280] mt-1 block leading-relaxed">
              Your official studio crest displayed on onboarding cards, concierge header, and footer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center">
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-[#e5e7eb] bg-white p-2.5 flex items-center justify-center shadow-xs shrink-0 overflow-hidden group">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Business Logo Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span className="font-sans font-bold text-3xl text-[#191c1d]">
                    {name ? name.charAt(0) : "É"}
                  </span>
                )}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 size={22} className="animate-spin text-[#0058be]" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#6b7280] font-medium tracking-wider uppercase">
                PNG · SVG · JPG
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#191c1d]">Studio Brand Crest</h4>
                  <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">
                    Upload a new logo to automatically generate a CDN URL and update all live
                    touchpoints.
                  </p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-[#000000] hover:bg-[#262626] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0">
                  <Upload size={14} />
                  <span>{isUploadingLogo ? "Uploading..." : "Replace Logo"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#4b5563] block">
                  Generated CDN Asset URL
                </span>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="https://cdn.accessa.ng/..."
                    className="w-full text-xs font-mono bg-white border border-[#d1d5db] rounded-lg pl-3.5 pr-28 py-2.5 text-[#191c1d] focus:border-[#0058be] focus:outline-none shadow-2xs"
                  />
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(logoUrl);
                          onToast("CDN Logo URL copied to clipboard!");
                        }
                      }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-[#191c1d] hover:bg-[#e5e7eb] bg-[#f3f4f6] px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer border border-[#e5e7eb]"
                    >
                      <Copy size={12} />
                      <span>Copy URL</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Row 1: Name & Slug */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Business name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:border-[#0058be] focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Claim handle / custom slug
            </label>
            <div className="relative">
              <input
                value={slug}
                onChange={e =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-")
                  )
                }
                placeholder="e.g. elan-events"
                className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:border-[#0058be] focus:outline-none shadow-2xs pr-24"
              />
              {slugStatus === "checking" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8c827a]">
                  checking...
                </span>
              )}
              {slugStatus === "available" && slug && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#16a34a] font-medium bg-[#f0fdf4] px-2 py-0.5 rounded">
                  available
                </span>
              )}
              {slugStatus === "taken" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#ba1a1a] font-medium bg-[#fef2f2] px-2 py-0.5 rounded">
                  reserved / unavailable
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Tagline */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Tagline & core positioning
            </label>
            <input
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="e.g. Bespoke luxury wedding design and creative direction"
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:border-[#0058be] focus:outline-none shadow-2xs"
            />
          </div>

          {/* Row 3: Location & Website */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Operating location
            </label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:border-[#0058be] focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Website
            </label>
            <input
              value={website}
              onChange={e => setWebsite(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:border-[#0058be] focus:outline-none shadow-2xs"
            />
          </div>

          {/* Row 4: Email & Currency */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Primary contact email
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:border-[#0058be] focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Default Studio Currency
            </label>
            <select
              value={currency}
              onChange={e => setCurrency?.(e.target.value as CurrencyCode)}
              className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:border-[#0058be] focus:outline-none font-medium shadow-2xs"
            >
              <option value="NGN">NGN (₦) — Nigerian Naira (Default)</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="EUR">EUR (€) — Euro</option>
            </select>
          </div>

          {/* Row 5: Business Type Selection Grid */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Business Type
            </label>
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
              role="radiogroup"
              aria-label="Business Type"
            >
              {(Object.keys(BUSINESS_TYPE_CTA_MAP) as BusinessType[]).map(type => {
                const isSelected = businessType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBusinessType(type)}
                    className={`flex items-center justify-center py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? "border-[#0058be] bg-[#f0f7ff] text-[#0058be] font-bold ring-1.5 ring-[#0058be]/30 shadow-xs"
                        : "border-[#e5e7eb] bg-white text-[#374151] font-medium hover:border-[#d1d5db] hover:bg-[#fafaf9]"
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{BUSINESS_TYPE_LABELS[type]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: About textarea */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              About your studio & signature approach
            </label>
            <textarea
              rows={4}
              value={about}
              onChange={e => setAbout(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-3 text-xs sm:text-sm text-[#111827] focus:border-[#0058be] focus:outline-none shadow-2xs leading-relaxed"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

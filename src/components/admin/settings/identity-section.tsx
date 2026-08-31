import { ChevronDown, Loader2, Lock, Upload } from "lucide-react";
import { BUSINESS_TYPE_CTA_MAP, BUSINESS_TYPE_LABELS } from "@/constants";
import type { BusinessType, CurrencyCode, IdentitySectionProps } from "@/types";
import { isValidUrl, slugify } from "@/utils";
import { Card } from "./card";
import { GooglePlacesAutocompleteField } from "./google-places-autocomplete-field";

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
  setEmail: _setEmail,
  currency = "NGN",
  setCurrency,
  businessType,
  setBusinessType,
  about,
  setAbout,
  logoUrl,
  setLogoUrl: _setLogoUrl,
  isUploadingLogo,
  handleLogoUpload,
  onToast: _onToast,
}: IdentitySectionProps) {
  return (
    <Card
      title="Business profile"
      description="The foundation of your public customer-facing presence."
    >
      <div className="space-y-7">
        {/* Logo Upload Section */}
        <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border border-[#e5e7eb] bg-[#f3f4f6] flex items-center justify-center shadow-xs shrink-0 overflow-hidden group">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Business Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-sans font-bold text-2xl text-[#191c1d]">
                    {name ? name.charAt(0).toUpperCase() : "S"}
                  </span>
                )}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-[#0058be]" />
                  </div>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0058be] block">
                  Business Brand Logo
                </span>
                <p className="text-xs text-[#6b7280] mt-0.5 max-w-md leading-relaxed">
                  Your official studio crest displayed on onboarding cards, concierge header, and
                  footer.
                </p>
                <span className="text-[10px] text-[#9ca3af] font-medium tracking-wider uppercase mt-1 block">
                  PNG · SVG · JPG · WEBP
                </span>
              </div>
            </div>

            <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-5 h-10 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all shadow-xs shrink-0 select-none">
              <Upload size={14} className="text-white" />
              <span className="text-white">
                {isUploadingLogo ? "Uploading..." : logoUrl ? "Replace Logo" : "Upload Logo"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={isUploadingLogo}
              />
            </label>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Row 1: Name & Slug */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Business name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">Slug</label>
            <div className="relative">
              <input
                value={slug}
                onChange={e => setSlug(slugify(e.target.value))}
                placeholder="e.g. elan-events"
                className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs pr-24"
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

          {/* Row 2: Core Value */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Core value
            </label>
            <input
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="e.g. Bespoke luxury wedding design and creative direction"
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs"
            />
          </div>

          {/* Row 3: Location & Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Location
            </label>
            <GooglePlacesAutocompleteField
              value={location}
              onChange={setLocation}
              onPlaceSelected={place => {
                setLocation(place.address || location);
              }}
              placeholder="e.g. Victoria Island, Lagos, Nigeria"
            />
          </div>

          <div className="space-y-2 opacity-60 cursor-not-allowed select-none">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#6b7280] tracking-wide block cursor-not-allowed">
                Email
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#6b7280] font-medium">
                <Lock size={11} className="text-[#6b7280]" />
                <span>Primary account email</span>
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                disabled
                readOnly
                className="w-full rounded-lg border border-[#d1d5db] bg-[#e5e7eb]/75 px-3.5 py-2.5 pr-10 text-xs sm:text-sm !text-[#6b7280] cursor-not-allowed select-none focus:outline-none shadow-none font-normal"
              />
              <div className="pointer-events-none absolute right-3 text-[#6b7280]">
                <Lock size={14} />
              </div>
            </div>
          </div>

          {/* Row 4: Website & Currency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#374151] tracking-wide block">
                Website
              </label>
              {website && !isValidUrl(website) && (
                <span className="text-[11px] text-amber-600 font-medium">
                  Enter a standard URL (e.g. sitename.com)
                </span>
              )}
            </div>
            <input
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="e.g. sitename.com or https://sitename.com"
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs transition-colors ${
                website && !isValidUrl(website)
                  ? "border-amber-400 focus:border-amber-500 bg-amber-50/20"
                  : "border-[#d1d5db]"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Currency
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={e => setCurrency?.(e.target.value as CurrencyCode)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#111827] focus:outline-none font-medium shadow-2xs appearance-none cursor-pointer"
              >
                <option value="NGN">₦ NGN</option>
                <option value="USD">$ USD</option>
                <option value="GBP">£ GBP</option>
                <option value="EUR">€ EUR</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6b7280]">
                <ChevronDown size={15} />
              </div>
            </div>
          </div>

          {/* Row 5: Business Type Button Group */}
          <div className="md:col-span-2 space-y-2.5">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Business Type
            </label>
            <div
              className="flex flex-wrap items-center gap-2"
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
                    className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? "border-[#111827] bg-[#111827] text-white shadow-xs font-semibold"
                        : "border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#d1d5db] hover:bg-[#fafaf9]"
                    }`}
                  >
                    {BUSINESS_TYPE_LABELS[type]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: About textarea */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              About store
            </label>
            <textarea
              rows={4}
              value={about}
              onChange={e => setAbout(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-3 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs leading-relaxed"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

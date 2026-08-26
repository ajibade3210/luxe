import { Check, Copy, Loader2, Upload } from "lucide-react";
import { Card } from "./card";

interface IdentitySectionProps {
  name: string;
  setName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  slugStatus: "checking" | "available" | "taken" | "idle";
  tagline: string;
  setTagline: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  about: string;
  setAbout: (v: string) => void;
  logoUrl: string;
  setLogoUrl: (v: string) => void;
  isUploadingLogo: boolean;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToast: (msg: string) => void;
}

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
      <div className="form-grid">
        {/* Logo Upload Section */}
        <div className="full bg-white border border-[#e5e7eb] rounded-lg p-6 mb-5 shadow-2xs">
          <div className="border-b border-[#e5e7eb] pb-3.5 mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0058be] block">
              Business Brand Logo
            </span>
            <span className="text-xs text-[#6b7280]">
              Your official studio crest displayed on onboarding cards, concierge header, and footer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg border border-[#e5e7eb] bg-white p-2 flex items-center justify-center shadow-xs shrink-0 overflow-hidden group">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Business Logo Preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <span className="font-sans font-bold text-3xl text-[#191c1d]">
                    {name ? name.charAt(0) : "Ś"}
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

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-[#191c1d]">Studio Brand Crest</h4>
                  <p className="text-xs text-[#6b7280] mt-0.5">
                    Upload a new logo to automatically generate a CDN URL and update all live
                    touchpoints.
                  </p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-[#000000] hover:bg-[#262626] text-white px-4 py-2 rounded-md text-xs font-medium transition-all shadow-xs shrink-0">
                  <Upload size={14} />
                  <span>{isUploadingLogo ? "Uploading to CDN..." : "Upload New Logo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-[#6b7280] block">
                  Generated CDN Asset URL
                </span>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="https://cdn.accessa.ng/..."
                    className="w-full text-xs font-mono bg-[#f8f9fa] border border-[#e5e7eb] rounded-md pl-3.5 pr-28 py-2.5 text-[#191c1d] focus:border-[#0058be] focus:outline-none shadow-2xs"
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
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-[#191c1d] hover:bg-[#e7e8e9] bg-[#f3f4f5] px-3 py-1.5 rounded inline-flex items-center gap-1 font-medium transition-colors cursor-pointer border border-[#e5e7eb]"
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

        {/* Row 1: Name & Slug */}
        <label>
          Business name
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label>
          Public profile slug & URL
          <div className="slug-input relative">
            <span>shopwus.com/</span>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            />
            {slugStatus === "checking" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#747878] flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> checking…
              </span>
            )}
            {slugStatus === "available" && slug && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#2e7d32] flex items-center gap-1 font-medium bg-[#f0fdf4] px-2 py-0.5 rounded">
                <Check size={12} /> available
              </span>
            )}
            {slugStatus === "taken" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#ba1a1a] font-medium bg-[#fef2f2] px-2 py-0.5 rounded">
                reserved / unavailable
              </span>
            )}
          </div>
        </label>

        {/* Row 2: Tagline & Location */}
        <label className="full">
          Tagline & core positioning
          <input
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            placeholder="e.g. Bespoke luxury wedding design and creative direction"
          />
        </label>

        <label>
          Operating location
          <input value={location} onChange={e => setLocation(e.target.value)} />
        </label>

        <label>
          Website
          <input value={website} onChange={e => setWebsite(e.target.value)} />
        </label>

        <label className="full">
          Primary contact email
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </label>

        <label className="full">
          About your studio & signature approach
          <textarea rows={4} value={about} onChange={e => setAbout(e.target.value)} />
        </label>
      </div>
    </Card>
  );
}

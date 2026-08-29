import { RefreshCw, Star } from "lucide-react";
import { getSocialChannelStyle } from "@/components/studio/atelier/social-badge";
import { SOCIAL_PREFIX_MAP } from "@/constants";
import type { ChannelsSectionProps } from "@/types";
import { sanitizeHandle } from "@/utils";
import { Card } from "./card";
import { Toggle } from "./toggle";

export function ChannelsSection({
  googleReviewsLink,
  setGoogleReviewsLink,
  showReviews,
  setShowReviews,
  isSyncingReviews,
  handleSyncReviews,
  channels,
  updateChannelHandle,
  toggleChannel,
  onToast,
}: ChannelsSectionProps) {
  return (
    <>
      {/* Card 04: Review Management */}
      <Card
        title="Review Management"
        description="Connect your Google Business Profile to showcase authenticated client reviews."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6b7280]">Show on page</span>
            <Toggle
              on={showReviews}
              onClick={() => setShowReviews(!showReviews)}
              ariaLabel="Toggle reviews section visibility"
            />
          </div>
        }
      >
        <div className="space-y-4">
          {!showReviews && (
            <div className="bg-[#fef3c7] text-[#92400e] text-xs px-3 py-2 rounded-lg border border-[#fde68a]">
              This section is currently hidden on your public studio page.
            </div>
          )}
          <div className="border border-[#e5e7eb] rounded-xl p-4 sm:p-5 bg-white space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#191c1d]">Google Business Profile</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      Live Sync Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6b7280] mt-0.5">
                    <div className="flex text-[#eab308]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-bold text-[#191c1d]">5.0</span>
                    <span>·</span>
                    <span>48 Verified 5-Star Reviews</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncReviews}
                disabled={isSyncingReviews}
                className="outline-button text-xs py-1.5 px-3 rounded-lg font-medium"
              >
                <RefreshCw
                  size={12}
                  className={isSyncingReviews ? "animate-spin text-[#0058be]" : ""}
                />
                <span>{isSyncingReviews ? "Syncing..." : "Sync Now"}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#374151] font-semibold text-xs tracking-wide">
                Google Business Profile URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={googleReviewsLink}
                  onChange={e => setGoogleReviewsLink(e.target.value)}
                  placeholder="https://business.google.com/..."
                  className="flex-1 bg-white border border-[#d1d5db] rounded-lg px-3 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => onToast("Google business link saved")}
                  className="dark-button text-xs px-4 py-2 rounded-lg font-semibold shrink-0"
                >
                  Save Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Card 05: Social Channels Management */}
      <Card
        number="05"
        title="Social Channels Management"
        description="Manage where clients can find you online across all 10 platforms."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {channels.map(channel => {
            const style = getSocialChannelStyle(channel.type);
            const prefix = SOCIAL_PREFIX_MAP[channel.type] || `${channel.type}.com/`;
            const displayHandle = sanitizeHandle(channel.handle, prefix);
            return (
              <div
                className="p-2.5 sm:p-3 rounded-xl border border-[#e5e7eb] bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#d1d5db] transition-all"
                key={channel.id}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div
                    style={{
                      backgroundColor: style.bg,
                      borderColor: style.border,
                      color: style.color,
                    }}
                    className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs"
                  >
                    <span className="scale-75 flex items-center justify-center">{style.icon}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0 bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#0058be] focus-within:bg-white rounded-lg px-2.5 py-1.5 transition-colors shadow-2xs">
                    <span className="text-xs text-[#9ca3af] font-medium select-none shrink-0 font-mono">
                      {prefix}
                    </span>
                    <input
                      value={displayHandle}
                      onChange={e =>
                        updateChannelHandle(channel.id, sanitizeHandle(e.target.value, prefix))
                      }
                      placeholder="handle"
                      className="w-full !text-xs text-[#191c1d] !border-0 !p-0 !outline-none placeholder:text-[#9ca3af] !bg-transparent font-medium !min-h-0 !h-auto !rounded-none"
                    />
                  </div>
                </div>
                <Toggle on={channel.connected} onClick={() => toggleChannel(channel.id)} />
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

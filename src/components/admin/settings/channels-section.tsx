import { RefreshCw, Star } from "lucide-react";
import type { SocialChannel } from "@/lib/types";
import { Card } from "./card";
import { Toggle } from "./toggle";

interface ChannelsSectionProps {
  googleReviewsLink: string;
  setGoogleReviewsLink: (v: string) => void;
  isSyncingReviews: boolean;
  handleSyncReviews: () => void;
  channels: SocialChannel[];
  updateChannelHandle: (id: string, handle: string) => void;
  toggleChannel: (id: string) => void;
  onToast: (msg: string) => void;
}

export function ChannelsSection({
  googleReviewsLink,
  setGoogleReviewsLink,
  isSyncingReviews,
  handleSyncReviews,
  channels,
  updateChannelHandle,
  toggleChannel,
  onToast,
}: ChannelsSectionProps) {
  return (
    <>
      {/* Card 04: Reputation Management */}
      <Card
        title="Reputation Management"
        description="Connect your Google Business Profile to showcase authenticated client reviews."
      >
        <div className="space-y-4">
          <div className="border border-[#e5e7eb] rounded-lg p-4 sm:p-5 bg-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center shrink-0">
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
                    <h4 className="text-xs font-bold text-[#191c1d]">Google Business Profile</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      Live Sync Active
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280] mt-0.5">
                    <div className="flex text-[#eab308]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-semibold text-[#191c1d]">5.0</span>
                    <span>·</span>
                    <span>48 Verified 5-Star Reviews</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncReviews}
                disabled={isSyncingReviews}
                className="outline-button text-xs py-1.5 px-3"
              >
                <RefreshCw
                  size={13}
                  className={isSyncingReviews ? "animate-spin text-[#0058be]" : ""}
                />
                {isSyncingReviews ? "Syncing Reviews..." : "Sync Now"}
              </button>
            </div>

            <div>
              <label className="block text-[#1f2937] font-medium text-xs mb-1.5">
                Google Business Profile URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={googleReviewsLink}
                  onChange={e => setGoogleReviewsLink(e.target.value)}
                  placeholder="https://business.google.com/..."
                  className="flex-1 bg-white border border-[#e5e7eb] rounded px-3.5 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
                <button
                  type="button"
                  onClick={() => onToast("Google business link saved")}
                  className="dark-button text-xs px-4"
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
        <div className="social-grid">
          {channels.map(channel => (
            <div className="social-tile" key={channel.id}>
              <div className="flex-1 min-w-0">
                <b>{channel.label}</b>
                <input
                  value={channel.handle}
                  onChange={e => updateChannelHandle(channel.id, e.target.value)}
                  placeholder={`Enter ${channel.label} link or handle`}
                />
              </div>
              <Toggle on={channel.connected} onClick={() => toggleChannel(channel.id)} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

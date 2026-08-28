import { getSocialChannelStyle } from "@/components/studio/atelier/social-badge";
import { SOCIAL_PREFIX_MAP } from "@/constants";
import type { ChannelsSectionProps } from "@/types";
import { sanitizeHandle } from "@/utils";
import { Card } from "./card";
import { GoogleBusinessCard } from "./google-business-card";
import { Toggle } from "./toggle";

export function ChannelsSection({
  googleReviewsLink,
  setGoogleReviewsLink,
  showReviews,
  setShowReviews,
  channels,
  updateChannelHandle,
  toggleChannel,
  onToast,
}: ChannelsSectionProps) {
  return (
    <>
      {/* Card 04: Google Review Management */}
      <GoogleBusinessCard
        googleReviewsLink={googleReviewsLink}
        setGoogleReviewsLink={setGoogleReviewsLink}
        showReviews={showReviews}
        setShowReviews={setShowReviews}
        onToast={onToast}
      />

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

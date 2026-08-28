"use client";

import { Check, Copy, ExternalLink, MapPin, RefreshCw, Star, Unlink } from "lucide-react";
import { useState } from "react";
import { useGoogleReviews } from "@/hooks/use-google-reviews";
import type { GoogleBusinessCardProps } from "@/types";
import { Card } from "./card";
import { Toggle } from "./toggle";

export function GoogleBusinessCard({
  googleReviewsLink,
  setGoogleReviewsLink,
  showReviews,
  setShowReviews,
  onToast,
}: GoogleBusinessCardProps) {
  const {
    connection,
    isSyncing,
    isConnecting,
    handleConnect,
    handleDisconnect,
    handleSelectLocation,
    handleSync,
    handleCopyReviewLink,
  } = useGoogleReviews(onToast);

  const [copied, setCopied] = useState<boolean>(false);

  const isConnected = connection?.status === "connected";
  const selectedLoc = connection?.selectedLocation;
  const summary = connection?.reviewSummary || {
    averageRating: 5.0,
    totalReviews: 5,
    ratingCounts: { 5: 5, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  const copyDirectLink = async () => {
    await handleCopyReviewLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      title="Review Management"
      description="Connect your Google Business Profile to showcase authenticated client reviews and route customers to leave feedback."
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
          {/* Header row: Google Icon, Status & Sync button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#e5e7eb]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      Live Sync Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb]">
                      Not Connected
                    </span>
                  )}
                </div>

                {isConnected && (
                  <div className="flex items-center gap-2 text-xs text-[#6b7280] mt-0.5">
                    <div className="flex text-[#eab308]">
                      {[...Array(Math.round(summary.averageRating || 5))].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-bold text-[#191c1d]">
                      {summary.averageRating.toFixed(1)}
                    </span>
                    <span>·</span>
                    <span>
                      {summary.totalReviews} Verified Review{summary.totalReviews === 1 ? "" : "s"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="outline-button text-xs py-1.5 px-3 rounded-lg font-medium cursor-pointer"
                  >
                    <RefreshCw
                      size={12}
                      className={isSyncing ? "animate-spin text-[#0058be]" : ""}
                    />
                    <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="text-xs text-[#ef4444] hover:text-[#b91c1c] hover:bg-[#fef2f2] px-2.5 py-1.5 rounded-lg border border-transparent hover:border-[#fecaca] transition-colors cursor-pointer flex items-center gap-1"
                    title="Disconnect Google Business"
                  >
                    <Unlink size={12} />
                    <span>Disconnect</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConnect()}
                  disabled={isConnecting}
                  className="dark-button text-xs py-1.5 px-3 rounded-lg font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw size={12} className={isConnecting ? "animate-spin text-white" : ""} />
                  <span>{isConnecting ? "Connecting..." : "Connect Account"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Connected Location & Multi-location Switcher */}
          {isConnected &&
            connection?.availableLocations &&
            connection.availableLocations.length > 0 && (
              <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#374151] font-semibold">
                    <MapPin size={13} className="text-[#0058be]" />
                    <span>Connected Location</span>
                  </div>
                  {selectedLoc && (
                    <span className="text-[10px] font-mono text-[#6b7280] bg-white px-1.5 py-0.5 rounded border border-[#e5e7eb]">
                      Place ID: {selectedLoc.placeId.slice(0, 12)}...
                    </span>
                  )}
                </div>

                {connection.availableLocations.length > 1 ? (
                  <select
                    value={selectedLoc?.locationId || ""}
                    onChange={e => handleSelectLocation(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-2.5 py-1.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  >
                    {connection.availableLocations.map(loc => (
                      <option key={loc.locationId} value={loc.locationId}>
                        {loc.locationName} — {loc.address}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-[#4b5563]">
                    <strong className="text-[#191c1d]">{selectedLoc?.locationName}</strong> —{" "}
                    {selectedLoc?.address}
                  </p>
                )}
              </div>
            )}

          {/* 1-Click Direct Google Review Link Generator */}
          {isConnected && connection?.directReviewUrl && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-[#374151] font-semibold text-xs tracking-wide">
                  1-Click Direct Review Link (Opens 5-Star Dialog)
                </label>
                <span className="text-[10px] text-[#6b7280]">
                  Share via WhatsApp, Email, or Invoices
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={connection.directReviewUrl}
                  className="flex-1 bg-[#f9fafb] border border-[#d1d5db] rounded-lg px-3 py-2 text-xs text-[#374151] font-mono select-all focus:outline-none focus:border-[#0058be] shadow-2xs"
                />
                <button
                  type="button"
                  onClick={copyDirectLink}
                  className="outline-button text-xs px-3 py-2 rounded-lg font-semibold shrink-0 cursor-pointer flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-[#059669]" />
                      <span className="text-[#059669]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={connection.directReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark-button text-xs px-3 py-2 rounded-lg font-semibold shrink-0 flex items-center gap-1"
                  title="Test Link in Google"
                >
                  <ExternalLink size={12} />
                  <span>Test</span>
                </a>
              </div>
            </div>
          )}

          {/* Manual Google Profile URL Fallback */}
          <div className="space-y-1.5 pt-1 border-t border-[#f3f4f6]">
            <label className="block text-[#374151] font-semibold text-xs tracking-wide">
              Custom Google Review / Profile URL (Optional Override)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={googleReviewsLink}
                onChange={e => setGoogleReviewsLink(e.target.value)}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                className="flex-1 bg-white border border-[#d1d5db] rounded-lg px-3 py-2 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => onToast("Google business link saved")}
                className="dark-button text-xs px-4 py-2 rounded-lg font-semibold shrink-0 cursor-pointer"
              >
                Save Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

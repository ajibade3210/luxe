"use client";

import { Check, Loader2, Shield, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { GoogleIcon } from "@/components/shared/icons";
import { checkSlugAvailability, signUpWithGoogle, updateBusinessProfile } from "@/lib/api";

export function SignupPage() {
  const router = useRouter();
  const [claimSlug, setClaimSlug] = useState("");
  const [studioName, setStudioName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim") || "";
      const planParam = params.get("plan") || "";
      const cycleParam = params.get("cycle") || "";

      if (planParam) setSelectedPlan(planParam);
      if (cycleParam) setSelectedCycle(cycleParam);

      if (claim) {
        const clean = claim.toLowerCase().replace(/[^a-z0-9-]/g, "");
        setClaimSlug(clean);
        setSlug(clean);
        // Formulate a nice default studio name from slug e.g. "elan-events" -> "Elan Events"
        const formatted = clean
          .split("-")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        setStudioName(formatted);
      }
    }
  }, []);

  // Validate slug availability when changed
  useEffect(() => {
    if (!slug) return;
    setIsCheckingSlug(true);
    const timer = setTimeout(() => {
      checkSlugAvailability(slug).then(res => {
        setSlugAvailable(res.available);
        setIsCheckingSlug(false);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    const effectiveSlug = slug || claimSlug || "my-atelier";
    const effectiveName = studioName || "My Luxury Studio";

    try {
      await signUpWithGoogle({
        slug: effectiveSlug,
        studioName: effectiveName,
      });

      await updateBusinessProfile({
        businessName: effectiveName,
        slug: effectiveSlug,
      });

      router.push(`/settings?claimed=${encodeURIComponent(effectiveSlug)}`);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#191c1d] flex flex-col justify-between selection:bg-[#d8e2ff] selection:text-[#0058be] font-sans antialiased relative overflow-hidden">
      {/* Ambient Glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none opacity-40 blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(214, 180, 138, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Top Header */}
      <AuthHeader mode="signup" claimSlug={claimSlug} />

      {/* Main Signup Form Container */}
      <div className="w-full max-w-lg mx-auto px-6 py-12 my-auto z-10">
        <div className="bg-white border border-[#eae3d7] rounded-3xl p-8 sm:p-12 shadow-[0_12px_40px_rgba(40,30,20,0.04)]">
          {/* Header Section */}
          <div className="mb-10">
            {/* Claim Banner Pill */}
            {claimSlug ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0eae1] border border-[#e4dacf] text-xs font-medium text-[#855e2e] mb-5 w-full justify-center">
                <Sparkles size={13} className="text-[#855e2e]" />
                <span>
                  Reserving Handle:{" "}
                  <span className="font-semibold text-[#6f4c22]">/{claimSlug}</span>
                </span>
              </div>
            ) : selectedPlan ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0eae1] border border-[#e4dacf] text-xs font-medium text-[#855e2e] mb-5">
                <span>
                  Selected Tier:{" "}
                  <span className="font-semibold capitalize text-[#6f4c22]">
                    {selectedPlan === "trial" ? "14-Day Free Trial" : selectedPlan}
                  </span>
                  {selectedCycle && selectedPlan !== "trial" ? ` (${selectedCycle})` : ""}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f4] text-xs font-medium text-[#5c5f60] mb-5">
                <span>Create Your Digital Shop</span>
              </div>
            )}

            {/* Form Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-serif text-[#191c1d] font-bold tracking-tight mb-2.5">
              {claimSlug ? "Claim your studio handle." : "Open your studio atelier."}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c5f60] leading-relaxed">
              Reserve your bespoke public profile URL and unlock your studio director dashboard with
              Google.
            </p>
          </div>

          {/* Form Input Fields with Tight Label Proximity and Clean Separation */}
          <div className="space-y-6 mb-9">
            {/* Studio Handle / Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d]">
                  Studio Handle / Public URL
                </label>
                <span className="text-[10px] text-[#8e9192]">
                  {isCheckingSlug ? (
                    "Checking…"
                  ) : slugAvailable ? (
                    <span className="text-[#10b981] flex items-center gap-1 font-sans font-medium">
                      <Check size={10} /> Available
                    </span>
                  ) : (
                    <span className="text-[#ef4444] font-sans font-medium">Unavailable</span>
                  )}
                </span>
              </div>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <span className="text-[#8e9192] select-none shrink-0 text-xs mr-1 font-medium">
                  shopwus.com/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="your-studio"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>

            {/* Studio Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1.5">
                Studio / Brand Name
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={studioName}
                  onChange={e => setStudioName(e.target.value)}
                  placeholder="e.g. Élan Events Atelier"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>
          </div>

          {/* Primary Google Signup Button */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-[#ded7cb] bg-[#faf8f5] hover:bg-[#f2ece3] active:scale-[0.99] text-xs font-semibold text-[#191c1d] transition-all cursor-pointer shadow-2xs hover:shadow-xs disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#0058be]" />
                  <span>Opening Atelier with Google…</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 mt-10 pt-6 border-t border-[#f0e8dc] text-[11px] text-[#8e9192] justify-center">
            <Shield size={13} className="text-[#10b981]" />
            <span>Encrypted with bank-grade 256-bit security.</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 text-center text-xs text-[#8e9192] z-10">
        © 2026 Shopwus Atelier Suite. All rights reserved.
      </footer>
    </main>
  );
}

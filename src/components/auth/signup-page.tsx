"use client";

import { Check, ChevronDown, Globe, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { GoogleIcon } from "@/components/shared/icons";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { checkSlugAvailability, signUpWithGoogle, updateBusinessProfile } from "@/lib/api";

export function SignupPage() {
  const router = useRouter();
  const [claimSlug, setClaimSlug] = useState("");
  const [studioName, setStudioName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [authError, setAuthError] = useState("");

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

  const handleCredential = async (codeOrToken: string) => {
    if (!agreedToTerms) return;
    setIsSubmitting(true);
    setAuthError("");
    const effectiveSlug = slug || claimSlug || "my-atelier";
    const effectiveName = studioName || "My Luxury Studio";

    try {
      const isJwt = codeOrToken.split(".").length === 3;
      await signUpWithGoogle({
        code: isJwt ? undefined : codeOrToken,
        idToken: isJwt ? codeOrToken : undefined,
        slug: effectiveSlug,
        studioName: effectiveName,
      });
      await updateBusinessProfile({ businessName: effectiveName, slug: effectiveSlug });
      router.push(`/settings?claimed=${encodeURIComponent(effectiveSlug)}`);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign-up failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const { trigger: triggerGoogle, loaded: googleLoaded } = useGoogleAuth(
    handleCredential,
    setAuthError
  );

  const handleGoogleSignup = () => {
    if (!agreedToTerms) return;
    setAuthError("");
    triggerGoogle();
  };

  return (
    <div className="min-h-screen bg-white text-[#191c1d] flex flex-col lg:flex-row font-sans selection:bg-[#191c1d] selection:text-white">
      {/* Left Panel: Signup Flow */}
      <div className="w-full lg:w-[58%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <BrandLogo size="md" href="/" />

          <div className="flex items-center gap-5 text-xs text-[#5c5f60]">
            <a
              href="mailto:support@shopwus.com"
              className="text-[#2563eb] hover:underline font-medium flex items-center gap-1"
            >
              <HelpCircle size={14} />
              <span>Need help?</span>
            </a>
            <div className="h-3.5 w-px bg-[#e5e7eb] hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 text-[#191c1d] font-medium cursor-pointer">
              <Globe size={14} className="text-[#64748b]" />
              <span>English</span>
              <ChevronDown size={13} className="text-[#94a3b8]" />
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#191c1d] tracking-tight">
                Get Started
              </h1>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                {selectedPlan
                  ? `Start your ${selectedPlan === "trial" ? "14-day free trial" : `${selectedPlan} (${selectedCycle || "monthly"})`} to continue.`
                  : "Create your free Shopwus account with Google."}
              </p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] shrink-0 mt-1">
              STEP 1 / 3
            </span>
          </div>

          {/* Optional Handle & Studio Setup */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#191c1d]">
                  Claim your public URL{" "}
                  <span className="text-[#94a3b8] font-normal">(optional)</span>
                </label>
                {slug && (
                  <span className="text-[10px] text-[#8e9192]">
                    {isCheckingSlug ? (
                      "Checking…"
                    ) : slugAvailable ? (
                      <span className="text-[#10b981] flex items-center gap-1 font-medium">
                        <Check size={10} /> Available
                      </span>
                    ) : (
                      <span className="text-[#ef4444] font-medium">Unavailable</span>
                    )}
                  </span>
                )}
              </div>
              <div className="signup-field flex items-center bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs transition-all">
                <span className="text-[#94a3b8] select-none shrink-0 text-xs mr-1 font-medium">
                  shopwus.com/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="your-studio"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#94a3b8] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Studio / Brand Name <span className="text-[#94a3b8] font-normal">(optional)</span>
              </label>
              <div className="signup-field flex items-center bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs transition-all">
                <input
                  type="text"
                  value={studioName}
                  onChange={e => setStudioName(e.target.value)}
                  placeholder="e.g. Élan Events Atelier"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#94a3b8] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Primary Google Auth Button */}
          <div className="space-y-4">
            <button
              type="button"
              disabled={isSubmitting || !agreedToTerms || !googleLoaded}
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#191c1d] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Connecting with Google…</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center shrink-0">
                    <GoogleIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{googleLoaded ? "Sign up with Google" : "Loading…"}</span>
                </>
              )}
            </button>

            {/* Auth error */}
            {authError && (
              <p className="text-[11px] text-[#ef4444] text-center pt-1">{authError}</p>
            )}

            {/* Terms Agreement Checkbox */}
            <label className="flex items-center gap-2 text-xs text-[#64748b] cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-[#cbd5e1] text-[#2563eb] focus:ring-0 cursor-pointer shrink-0"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-[#2563eb] underline hover:text-[#1d4ed8]">
                  Terms & Conditions
                </Link>{" "}
                and have read the{" "}
                <Link href="/privacy" className="text-[#2563eb] underline hover:text-[#1d4ed8]">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Bottom Link */}
          <div className="pt-6 mt-6 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Already have an account?</span>
            <Link href="/login" className="text-[#2563eb] font-semibold hover:underline">
              Sign in to Studio
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left text-[11px] text-[#94a3b8]">
          © {new Date().getFullYear()} Shopwus. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Testimonials Showcase */}
      <div className="w-full lg:w-[42%] bg-[#f3f4f6] border-l border-[#e5e7eb] p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191c1d] tracking-tight">
              Ready to join Shopwus?
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
              Over 2000+ online vendors, boutique brands, event planners, and creative businesses
              use Shopwus to turn visitors into paying clients.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="space-y-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-bold uppercase tracking-wider text-[#191c1d]">
                  Élan Events
                </strong>
                <span className="text-[10px] bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded-full font-medium">
                  Verified shop
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                &ldquo;Through Shopwus&apos;s bespoke 3D cards and invoicing, our team has seamless
                customer tracking, instant deposits, and complete financial clarity.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 rounded-full bg-[#191c1d] text-white flex items-center justify-center text-xs font-bold">
                  EV
                </div>
                <div>
                  <strong className="text-xs font-bold text-[#191c1d] block">Elena Vance</strong>
                  <span className="text-[11px] text-[#64748b] block">
                    Creative Director · Atelier Forma
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-bold uppercase tracking-wider text-[#191c1d]">
                  Maison Production
                </strong>
                <span className="text-[10px] bg-[#f0fdf4] text-[#16a34a] px-2 py-0.5 rounded-full font-medium">
                  Flagship Brand
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                &ldquo;A super toolset dedicated to luxury client service that connects our
                inquiries, multi-currency invoicing, and real-time business valuation.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xs font-bold">
                  LH
                </div>
                <div>
                  <strong className="text-xs font-bold text-[#191c1d] block">Laurent Hayoz</strong>
                  <span className="text-[11px] text-[#64748b] block">
                    Head of Digital & Experiential
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

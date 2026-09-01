"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  Globe,
  HelpCircle,
  Loader2,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { GoogleIcon } from "@/components/shared/icons";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { signInWithGoogle } from "@/lib/api";

export function LoginPage() {
  const [claimParam, setClaimParam] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim");
      if (claim) setClaimParam(claim);
    }
  }, []);

  const handleCredential = async (codeOrToken: string) => {
    setIsSubmitting(true);
    setAuthError("");
    try {
      const isJwt = codeOrToken.split(".").length === 3;

      await signInWithGoogle({
        code: isJwt ? undefined : codeOrToken,
        idToken: isJwt ? codeOrToken : undefined,
        claimSlug: claimParam,
      });
      window.location.href = claimParam
        ? `/vendor/settings?claim=${encodeURIComponent(claimParam)}`
        : "/vendor/overview";
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const { trigger: triggerGoogle, loaded: googleLoaded } = useGoogleAuth(
    handleCredential,
    setAuthError
  );

  const handleGoogleSignIn = () => {
    setAuthError("");
    triggerGoogle();
  };

  return (
    <div className="min-h-screen bg-white text-[#191c1d] flex flex-col lg:flex-row font-sans selection:bg-[#2563eb] selection:text-white">
      {/* Left Panel: Google Sign-in */}
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

        {/* Action Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#191c1d] tracking-tight">Login</h1>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              Sign in with your verified Google account to access your studio director dashboard.
            </p>
          </div>

          {/* Primary Google Auth Button */}
          <div className="space-y-4">
            <button
              type="button"
              disabled={isSubmitting || !googleLoaded}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#191c1d] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Signing in with Google…</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center shrink-0">
                    <GoogleIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{googleLoaded ? "Sign in with Google" : "Loading…"}</span>
                </>
              )}
            </button>

            {/* Auth error */}
            {authError && (
              <div className="p-3.5 bg-red-50/90 border border-red-200/80 rounded-xl text-center space-y-2">
                <p className="text-xs text-red-700 font-medium leading-relaxed">{authError}</p>
                {authError.toLowerCase().includes("sign up") && (
                  <div>
                    <Link
                      href={
                        claimParam ? `/signup?claim=${encodeURIComponent(claimParam)}` : "/signup"
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] underline underline-offset-2"
                    >
                      <span>Create your studio account</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#64748b] pt-2">
              <Shield size={14} className="text-[#10b981]" />
            </div>
          </div>

          {/* Bottom Links */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#f1f5f9] text-xs text-[#64748b]">
            <span>Don&apos;t have an account yet?</span>
            <Link
              href="/signup"
              className="text-[#2563eb] font-semibold underline underline-offset-2 hover:text-[#1d4ed8]"
            >
              Get started.
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left text-[11px] text-[#94a3b8]">
          © {new Date().getFullYear()} Shopwus. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Feature Preview */}
      <div className="w-full lg:w-[42%] bg-[#2563eb] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Manage your entire studio right from your Shopwus Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Supercharge your client intake, live show-calls, multi-currency invoicing, and
              real-time business valuation in one cohesive workspace.
            </p>
            <div>
              <Link
                href="/#features"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline underline-offset-4 hover:text-blue-200"
              >
                <span>Learn More</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Interactive Mockup Preview Card */}
          <div className="bg-white text-[#191c1d] rounded-2xl p-6 shadow-xl border border-blue-400/30 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#191c1d] text-white flex items-center justify-center font-serif text-[10px] font-bold">
                  É
                </div>
                <strong className="text-xs font-bold text-[#191c1d]">Élan Events Atelier</strong>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 size={11} /> Invoice Paid
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-[11px]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                  Client Note
                </span>
                <p>
                  &ldquo;Here is the itemized invoice for the March Grand Gala. Deposit has been
                  received!&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CreditCard size={14} className="text-[#2563eb]" />
                <span className="font-semibold text-gray-900">₦2,500,000</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer shadow-2xs">
                <Download size={12} />
                <span>Download Receipt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

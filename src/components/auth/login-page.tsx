"use client";

import { Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { GoogleIcon } from "@/components/shared/icons";
import { signInWithGoogle } from "@/lib/api";

export function LoginPage() {
  const [claimParam, setClaimParam] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim");
      if (claim) setClaimParam(claim);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle({ claimSlug: claimParam });
      window.location.href = claimParam
        ? `/settings?claim=${encodeURIComponent(claimParam)}`
        : "/settings";
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#191c1d] flex flex-col justify-between selection:bg-[#d8e2ff] selection:text-[#0058be] font-sans antialiased relative overflow-hidden">
      {/* Ambient Luxe Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none opacity-40 blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(214, 180, 138, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Top Header */}
      <AuthHeader mode="login" claimSlug={claimParam} />

      {/* Main Login Form Container */}
      <div className="w-full max-w-md mx-auto px-6 py-12 my-auto z-10">
        <div className="bg-white border border-[#eae3d7] rounded-3xl p-8 sm:p-12 shadow-[0_12px_40px_rgba(40,30,20,0.04)] text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f4] text-xs font-medium text-[#5c5f60] mb-6">
            <span>Studio Director Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif text-[#191c1d] font-bold mb-3 tracking-tight">
            Return to your studio.
          </h1>

          {/* Action Area with Generous Spacing */}
          <div className="space-y-4 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-[#ded7cb] bg-[#faf8f5] hover:bg-[#f2ece3] active:scale-[0.99] text-xs font-semibold text-[#191c1d] transition-all cursor-pointer shadow-2xs hover:shadow-xs disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#0058be]" />
                  <span>Signing in with Google…</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy & Security Note */}
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

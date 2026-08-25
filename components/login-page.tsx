"use client";

import { ArrowRight, Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createSession } from "@/lib/api";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("hello@elanevents.com");
  const [password, setPassword] = useState("password");
  const [claimParam, setClaimParam] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim");
      if (claim) setClaimParam(claim);
    }
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    createSession({
      name: "Amelia Bell",
      email: email || "hello@elanevents.com",
      role: "Studio Director",
      studioName: "Élan Events",
      studioSlug: "elan-events",
    });
    window.location.href = claimParam
      ? `/settings?claim=${encodeURIComponent(claimParam)}`
      : "/settings";
  };

  const handleGoogleSignIn = () => {
    createSession({
      name: "Amelia Bell",
      email: "hello@elanevents.com",
      role: "Studio Director",
      studioName: "Élan Events",
      studioSlug: "elan-events",
    });
    window.location.href = claimParam
      ? `/settings?claim=${encodeURIComponent(claimParam)}`
      : "/settings";
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
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 text-decoration-none group">
          <div className="w-8 h-8 rounded-lg bg-[#191c1d] text-white flex items-center justify-center font-serif text-base italic font-bold">
            É
          </div>
          <span className="font-bold text-base tracking-tight text-[#191c1d]">Shopwus</span>
        </Link>
        <Link
          href={`/signup${claimParam ? `?claim=${encodeURIComponent(claimParam)}` : ""}`}
          className="text-xs text-[#5c5f60] hover:text-[#191c1d] font-medium transition-colors"
        >
          Don&apos;t have a studio? <b className="text-[#191c1d] underline">Sign up</b>
        </Link>
      </header>

      {/* Main Login Form Container */}
      <div className="w-full max-w-lg mx-auto px-6 py-10 my-auto z-10">
        <div className="bg-white border border-[#eae3d7] rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f4] text-xs font-medium text-[#5c5f60] mb-6">
            <span>Studio Director Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif text-[#191c1d] font-bold mb-3 tracking-tight">
            Return to your studio.
          </h1>
          <p
            className="text-xs sm:text-sm text-[#5c5f60] leading-relaxed block"
            style={{ marginBottom: "28px" }}
          >
            Sign in to curate inquiries, review private client briefs, and publish atelier updates.
          </p>

          {/* Google Sign In Option */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{ marginBottom: "24px" }}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-[#ded7cb] bg-[#faf8f5] hover:bg-[#f2ece3] text-xs font-semibold text-[#191c1d] transition-all cursor-pointer shadow-2xs"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-7">
            <div className="border-t border-[#ede7dc] w-full" />
            <span className="bg-white px-3.5 text-[10px] uppercase font-semibold text-[#8e9192] tracking-wider absolute">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c5f60] mb-2">
                Work Email Address
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all gap-2.5">
                <Mail size={14} className="text-[#8e9192] shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="hello@elanevents.com"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c5f60]">
                  Password
                </label>
                <span className="text-[10px] text-[#855e2e] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all gap-2.5">
                <Lock size={14} className="text-[#8e9192] shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ color: "#ffffff" }}
              className="w-full mt-3 bg-[#191c1d] !text-white font-semibold text-xs py-3.5 rounded-xl hover:bg-[#2d3032] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Sign in & Open Studio</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 mt-5 text-[11px] text-[#8e9192] justify-center">
            <Shield size={12} />
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

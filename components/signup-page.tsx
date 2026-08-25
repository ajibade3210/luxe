"use client";

import { ArrowRight, Check, Lock, Mail, Shield, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkSlugAvailability, createSession, updateBusinessProfile } from "@/lib/api";

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

export function SignupPage() {
  const router = useRouter();
  const [claimSlug, setClaimSlug] = useState("");
  const [studioName, setStudioName] = useState("");
  const [slug, setSlug] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim") || "";
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
    const effectiveSlug = slug || "new-studio";
    const effectiveName = studioName || "My Luxury Studio";
    const effectiveDirector = fullName || "Studio Director";
    const effectiveEmail = email || "director@atelier.com";

    createSession({
      name: effectiveDirector,
      email: effectiveEmail,
      role: "Studio Director",
      studioName: effectiveName,
      studioSlug: effectiveSlug,
    });

    await updateBusinessProfile({
      businessName: effectiveName,
      slug: effectiveSlug,
      email: effectiveEmail,
    });

    setIsSubmitting(false);
    router.push(`/settings?claimed=${encodeURIComponent(effectiveSlug)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const effectiveSlug = slug || "new-studio";
    const effectiveName = studioName || "My Luxury Studio";
    const effectiveDirector = fullName || "Studio Director";
    const effectiveEmail = email || "director@atelier.com";

    // 1. Create authenticated session
    createSession({
      name: effectiveDirector,
      email: effectiveEmail,
      role: "Studio Director",
      studioName: effectiveName,
      studioSlug: effectiveSlug,
    });

    // 2. Persist claimed studio settings
    await updateBusinessProfile({
      businessName: effectiveName,
      slug: effectiveSlug,
      email: effectiveEmail,
    });

    setIsSubmitting(false);

    // 3. Navigate to Studio Settings dashboard
    router.push(`/settings?claimed=${encodeURIComponent(effectiveSlug)}`);
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
          <span className="font-bold text-base tracking-tight text-[#191c1d]">LuxeAdmin</span>
        </Link>
        <Link
          href={`/login${claimSlug ? `?claim=${encodeURIComponent(claimSlug)}` : ""}`}
          className="text-xs text-[#5c5f60] hover:text-[#191c1d] font-medium transition-colors"
        >
          Already have a studio? <b className="text-[#191c1d] underline">Sign in</b>
        </Link>
      </header>

      {/* Main Signup Form Container */}
      <div className="w-full max-w-lg mx-auto px-6 py-10 my-auto z-10">
        <div className="bg-white border border-[#eae3d7] rounded-3xl p-8 sm:p-10 shadow-sm">
          {/* Claim Banner Pill */}
          {claimSlug ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0eae1] border border-[#e4dacf] text-xs font-mono text-[#855e2e] mb-6 w-full justify-center">
              <Sparkles size={13} className="text-[#855e2e]" />
              <span>
                Reserving Handle: <b>/{claimSlug}</b>
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f4] text-xs font-medium text-[#5c5f60] mb-6">
              <span>Create Your Atelier</span>
            </div>
          )}

          {/* Form Title */}
          <h1 className="text-2xl sm:text-3xl font-serif text-[#191c1d] font-bold mb-3 tracking-tight">
            {claimSlug ? "Claim your studio handle." : "Open your studio atelier."}
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5f60] mb-8 leading-relaxed">
            {claimSlug ? (
              <>
                Create your director account to secure{" "}
                <code className="font-mono font-semibold text-[#191c1d]">
                  luxeadmin.com/{claimSlug}
                </code>{" "}
                before anyone else.
              </>
            ) : (
              "Bring your clientele, luxury events, and creative storytelling into one considered place."
            )}
          </p>

          {/* Google Signup Option */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-[#ded7cb] bg-[#faf8f5] hover:bg-[#f2ece3] text-xs font-semibold text-[#191c1d] transition-all cursor-pointer shadow-2xs mb-6"
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Studio Name */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c5f60] mb-2">
                Studio / Business Name
              </label>
              <input
                type="text"
                required
                value={studioName}
                onChange={e => setStudioName(e.target.value)}
                placeholder="e.g. Élan Events Atelier"
                className="w-full bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-3 text-xs text-[#191c1d] placeholder:text-[#9ea1a2] focus:bg-white focus:outline-none focus:border-[#855e2e] focus:ring-1 focus:ring-[#855e2e] transition-all"
              />
            </div>

            {/* Studio Handle / Slug */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c5f60]">
                  Studio Handle / URL Slug
                </label>
                <span className="text-[10px] text-[#8e9192] font-mono">
                  {isCheckingSlug ? (
                    "Checking…"
                  ) : slugAvailable ? (
                    <span className="text-[#10b981] flex items-center gap-1 font-sans">
                      <Check size={10} /> Available
                    </span>
                  ) : (
                    <span className="text-[#ef4444] font-sans">Unavailable</span>
                  )}
                </span>
              </div>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                <span className="text-[#8e9192] font-mono select-none shrink-0 text-xs mr-1">
                  luxeadmin.com/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="your-studio"
                  className="w-full font-mono text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>

            {/* Director Full Name */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c5f60] mb-2">
                Director Full Name
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all gap-2.5">
                <User size={14} className="text-[#8e9192] shrink-0" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Amelia Bell"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>

            {/* Work Email */}
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
                  placeholder="director@studio.com"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c5f60] mb-2">
                Password
              </label>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ color: "#ffffff" }}
              className="w-full mt-2 bg-[#191c1d] !text-white font-medium text-xs py-3 rounded-xl hover:bg-[#2d3032] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{isSubmitting ? "Opening Atelier…" : "Create Account & Open Studio"}</span>
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
        © 2026 LuxeAdmin Atelier Suite. All rights reserved.
      </footer>
    </main>
  );
}

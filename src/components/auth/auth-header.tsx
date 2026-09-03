import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import type { AuthHeaderProps } from "@/types";

export function AuthHeader({ rightAction, mode, claimSlug }: AuthHeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between z-10">
      <BrandLogo />

      {rightAction ? (
        rightAction
      ) : mode === "signup" ? (
        <Link
          href={`/login${claimSlug ? `?claim=${encodeURIComponent(claimSlug)}` : ""}`}
          className="text-xs text-[#5c5f60] hover:text-[#191c1d] font-medium transition-colors"
        >
          Already have an account? <b className="text-[#191c1d] underline">Sign in</b>
        </Link>
      ) : mode === "login" ? (
        <Link
          href={`/signup${claimSlug ? `?claim=${encodeURIComponent(claimSlug)}` : ""}`}
          className="text-xs text-[#5c5f60] hover:text-[#191c1d] font-medium transition-colors"
        >
          Don&apos;t have an account? <b className="text-[#191c1d] underline">Sign up</b>
        </Link>
      ) : null}
    </header>
  );
}

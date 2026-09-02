"use client";

import { ArrowRight, Bell, Eye, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCurrentStudio } from "@/hooks/use-current-studio";
import { publishChanges } from "@/lib/api";
import type { AdminHeaderProps } from "@/types";

export function AdminHeader({ onMenu, onToast, path }: AdminHeaderProps) {
  const [busy, setBusy] = useState(false);
  const pathname = usePathname();
  const currentPath = path || pathname || "";
  const isSettingsPage =
    currentPath === "/vendor/settings" || currentPath === "/vendor/preferences";

  const { slug } = useCurrentStudio();

  return (
    <header className="h-[76px] max-[750px]:h-[65px] px-3.5 sm:px-8 lg:px-10 flex items-center justify-between border-b border-transparent">
      <button
        className="hidden max-[750px]:grid place-items-center bg-transparent border-0 text-[#8c827a] hover:text-[#191c1d] cursor-pointer p-1 rounded-md"
        onClick={onMenu}
        type="button"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2 w-[250px] max-[750px]:flex-1 max-[750px]:min-w-0 max-[750px]:max-w-[140px] sm:max-w-[250px] max-[750px]:ml-2 text-[#8c827a]">
        <Search size={16} className="shrink-0 text-[#8c827a]" />
        <input
          aria-label="Search"
          placeholder="Search..."
          className="border-0 bg-transparent py-2 text-xs text-[#191c1d] focus:outline-none w-full placeholder:text-[#9ca3af]/40 sm:placeholder:text-[#9ca3af] truncate"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isSettingsPage && (
          <>
            <a
              href={`/${slug}?from=settings`}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-2.5 sm:px-3.5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] hover:border-[#191c1d] bg-white text-[#191c1d] text-xs font-semibold transition-all shrink-0 whitespace-nowrap shadow-2xs hover:bg-neutral-50"
              title="View Public Profile"
            >
              <Eye size={14} className="text-[#191c1d] shrink-0" />
              <span className="hidden sm:inline">Profile </span>
              <span>View</span>
            </a>
            <button
              type="button"
              className="h-9 px-3 sm:px-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#000000] hover:bg-[#262626] text-white text-xs font-semibold transition-all shrink-0 whitespace-nowrap shadow-2xs cursor-pointer disabled:opacity-60"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await publishChanges();
                setBusy(false);
                onToast("Changes published successfully");
              }}
            >
              {busy ? (
                <span>Publishing…</span>
              ) : (
                <>
                  <span>
                    Publish<span className="hidden sm:inline"> changes</span>
                  </span>
                  <ArrowRight size={13} className="shrink-0" />
                </>
              )}
            </button>
          </>
        )}
        <button
          className="hidden sm:grid place-items-center bg-transparent border-0 text-[#8c827a] hover:text-[#191c1d] p-1.5 rounded-lg cursor-pointer transition-colors"
          aria-label="Notifications"
          title="Notifications"
          type="button"
        >
          <Bell size={17} />
        </button>
      </div>
    </header>
  );
}

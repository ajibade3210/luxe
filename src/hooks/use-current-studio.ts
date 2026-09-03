"use client";

import { useEffect, useState } from "react";
import { APP_CONFIG, CUSTOM_EVENTS } from "@/constants";
import { useStudioProfileQuery } from "@/hooks/queries";
import { getCurrentSession } from "@/lib/api";
import type { CurrentStudioResult, UserSession } from "@/types";

export function useCurrentStudio(): CurrentStudioResult {
  const { data: profile, isLoading, isError, refetch } = useStudioProfileQuery();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(getCurrentSession());

    const handleAuthChanged = (e: Event) => {
      const customEvent = e as CustomEvent<UserSession | null>;
      setSession(customEvent.detail ?? getCurrentSession());
    };

    window.addEventListener(CUSTOM_EVENTS.authChanged, handleAuthChanged);
    return () => {
      window.removeEventListener(CUSTOM_EVENTS.authChanged, handleAuthChanged);
    };
  }, []);

  const slug = session?.studioSlug || profile?.slug || APP_CONFIG.defaultSlug;
  const studioName = session?.studioName || profile?.businessName || "Élan Atelier";
  const userName = session?.name || profile?.businessName || "Vendor";
  const userRole = session?.studioName || profile?.businessName || "Store Owner";
  const studioId = session?.id || profile?.id || "";

  const initials =
    (userName || studioName)
      .split(" ")
      .map(p => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SW";

  return {
    studioId,
    studioName,
    slug,
    userName,
    userRole,
    initials,
    profile,
    session,
    isLoading,
    isError,
    refetch,
  };
}

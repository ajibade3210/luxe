"use client";

import { useEffect, useState } from "react";
import { APP_CONFIG } from "@/constants";
import { useStudioProfileQuery } from "@/hooks/queries";
import { getCurrentSession } from "@/lib/api";
import type { CurrentStudioResult, UserSession } from "@/types";

export function useCurrentStudio(): CurrentStudioResult {
  const { data: profile, isLoading, isError, refetch } = useStudioProfileQuery();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(getCurrentSession());
  }, []);

  const slug = profile?.slug || session?.studioSlug || APP_CONFIG.defaultSlug;
  const studioName = profile?.businessName || session?.studioName || "Élan Atelier";
  const userName = session?.name || profile?.businessName || "Vendor";
  const userRole = profile?.businessName || session?.studioName || "Store Owner";
  const studioId = profile?.id || session?.id || "";

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

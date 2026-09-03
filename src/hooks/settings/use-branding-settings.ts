"use client";

import { useEffect, useState } from "react";
import { DEFAULT_BUSINESS_TYPE } from "@/constants";
import { checkSlugAvailability } from "@/lib/api";
import type { BusinessType, CurrencyCode } from "@/types";

export function useBrandingSettings() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [initialSlug, setInitialSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [about, setAbout] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>(DEFAULT_BUSINESS_TYPE);

  const [slugStatus, setSlugStatus] = useState<"checking" | "available" | "taken" | "idle">(
    "available"
  );

  // Slug Availability Debounced Check with No-Op Bypass
  useEffect(() => {
    if (!slug) {
      setSlugStatus("idle");
      return;
    }
    // No-op: If slug matches initial loaded slug, it is always valid and available
    if (initialSlug && slug.toLowerCase().trim() === initialSlug.toLowerCase().trim()) {
      setSlugStatus("available");
      return;
    }
    if (slug.length < 3) {
      setSlugStatus("taken");
      return;
    }

    setSlugStatus("checking");
    const t = setTimeout(async () => {
      try {
        const res = await checkSlugAvailability(slug);
        setSlugStatus(res.available ? "available" : "taken");
      } catch {
        setSlugStatus("taken");
      }
    }, 300);
    return () => clearTimeout(t);
  }, [slug, initialSlug]);

  return {
    name,
    setName,
    slug,
    setSlug,
    tagline,
    setTagline,
    location,
    setLocation,
    website,
    setWebsite,
    email,
    setEmail,
    currency,
    setCurrency,
    about,
    setAbout,
    businessType,
    setBusinessType,
    slugStatus,
    setSlugStatus,
    initialSlug,
    setInitialSlug,
  };
}

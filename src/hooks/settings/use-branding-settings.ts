"use client";

import { useEffect, useState } from "react";
import { DEFAULT_BUSINESS_TYPE } from "@/constants";
import { checkSlugAvailability } from "@/lib/api";
import type { BusinessType, CurrencyCode } from "@/types";

export function useBrandingSettings() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
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

  // Slug Availability Debounced Check
  useEffect(() => {
    if (!slug) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const t = setTimeout(async () => {
      const res = await checkSlugAvailability(slug);
      setSlugStatus(res.available ? "available" : "taken");
    }, 300);
    return () => clearTimeout(t);
  }, [slug]);

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
  };
}

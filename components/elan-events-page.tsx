"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Clock3,
  Globe,
  Heart,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  QrCode,
  RotateCw,
  Send,
  Share2,
  Sparkles,
  Star,
  UserCheck,
  Video,
  X,
} from "lucide-react";
import { businessProfile as defaultProfile } from "@/lib/mock-data";
import {
  getBusinessBySlug,
  submitConsultationInquiry,
  submitReview,
} from "@/lib/api";
import type {
  BusinessProfile,
  ButtonRadiusType,
  ColorScheme,
  PortfolioProject,
} from "@/lib/types";

interface ElanEventsPageProps {
  initialProfile?: BusinessProfile;
  slug?: string;
}

export function ElanEventsPage({
  initialProfile,
  slug = "elan-events",
}: ElanEventsPageProps) {
  // Live dynamic profile state
  const [profile, setProfile] = useState<BusinessProfile>(
    initialProfile || defaultProfile,
  );

  // Fetch freshest profile and subscribe to settings changes
  useEffect(() => {
    getBusinessBySlug(slug).then(res => {
      if (res) setProfile(res);
    });

    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BusinessProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("luxe_profile_updated", handleProfileUpdate);
      return () =>
        window.removeEventListener("luxe_profile_updated", handleProfileUpdate);
    }
  }, [slug]);

  // UI state
  const [isFromSettings, setIsFromSettings] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if visitor is studio admin previewing from settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get("from");
      const previewParam = params.get("preview");
      const referrer = document.referrer || "";
      if (
        fromParam === "settings" ||
        fromParam === "admin" ||
        previewParam === "true" ||
        referrer.includes("/settings") ||
        referrer.includes("/leads") ||
        referrer.includes("/customers")
      ) {
        setIsFromSettings(true);
      }
    }
  }, []);

  // Modals
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Forms
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: profile.services?.[0] || "Luxury Weddings",
    eventDate: "",
    budget: "50000",
    message: "",
  });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    author: "",
    eventType: "Luxury Wedding",
    rating: 5,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => (current === msg ? null : current));
    }, 4000);
  };

  // Scroll listener for sticky nav & active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["about", "reviews", "services", "portfolio"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper for dynamic radius class
  const getRadiusClass = (r?: ButtonRadiusType) => {
    switch (r) {
      case "Square":
        return "rounded-none";
      case "Subtle":
        return "rounded";
      case "Rounded":
        return "rounded-lg";
      case "Pill":
        return "rounded-full";
      default:
        return "rounded";
    }
  };

  const radiusClass = getRadiusClass(profile.buttonRadius);

  // Helper for colors
  const primaryColor = profile.colors?.primary || "#000000";
  const buttonColor = profile.colors?.button || "#000000";
  const secondaryColor = profile.colors?.secondary || "#0058BE";
  const textColor = profile.colors?.text || "#191C1D";

  // Computed review stats
  const averageRating = useMemo(() => {
    if (!profile.reviews || profile.reviews.length === 0) return 5.0;
    const sum = profile.reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / profile.reviews.length).toFixed(1);
  }, [profile.reviews]);

  const totalReviews =
    (profile.reviews?.length || 0) > 3 ? profile.reviews.length : 127;

  const handleCopyLink = () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://luxeadmin.com/${profile.slug || slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast("Business profile link copied to clipboard!");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    showToast(
      `Thank you for subscribing to the ${profile.businessName} Journal.`,
    );
    setNewsletterEmail("");
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    try {
      await submitConsultationInquiry({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        service:
          quoteForm.service || profile.services?.[0] || "Luxury Weddings",
        eventDate: quoteForm.eventDate || new Date().toISOString().slice(0, 10),
        budget: Number(quoteForm.budget) || 50000,
        message:
          quoteForm.message ||
          "Consultation request submitted via public profile.",
      });
      setQuoteSubmitting(false);
      setQuoteModalOpen(false);
      showToast(
        "Consultation inquiry sent! Our studio directors will contact you within 24 hours.",
      );
      setQuoteForm({
        name: "",
        email: "",
        phone: "",
        service: profile.services?.[0] || "Luxury Weddings",
        eventDate: "",
        budget: "50000",
        message: "",
      });
    } catch {
      setQuoteSubmitting(false);
      showToast("Failed to submit. Please try again or reach out on WhatsApp.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await submitReview({
        author: reviewForm.author,
        eventType: reviewForm.eventType,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        role: "Verified Client",
      });
      setReviewSubmitting(false);
      setReviewModalOpen(false);
      showToast("Thank you! Your review has been submitted.");
      setReviewForm({
        author: "",
        eventType: "Luxury Wedding",
        rating: 5,
        comment: "",
      });
    } catch {
      setReviewSubmitting(false);
      showToast("Failed to submit review. Please try again.");
    }
  };

  // Authentic social platform metadata resolver
  const getSocialPlatformMeta = (type: string) => {
    switch (type) {
      case "instagram":
        return {
          bg: "#FDF0F5",
          border: "#F8D0DE",
          color: "#E1306C",
          icon: (
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          ),
        };
      case "facebook":
        return {
          bg: "#EFF5FE",
          border: "#D3E3FD",
          color: "#1877F2",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          ),
        };
      case "linkedin":
        return {
          bg: "#EDF4FC",
          border: "#CFE2F8",
          color: "#0A66C2",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.64 1.64 0 0 0-1.66 1.64 1.64 1.64 0 0 0 1.66 1.63 1.63 1.63 0 0 0 1.65-1.63A1.64 1.64 0 0 0 7.83 6.2z" />
            </svg>
          ),
        };
      case "tiktok":
        return {
          bg: "#F5F5F7",
          border: "#E5E5EA",
          color: "#000000",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.46A6.29 6.29 0 0 0 15.82 16V9.13a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.56z" />
            </svg>
          ),
        };
      case "x":
        return {
          bg: "#F5F5F7",
          border: "#E5E5EA",
          color: "#000000",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          ),
        };
      case "youtube":
        return {
          bg: "#FEF0F0",
          border: "#FCD4D4",
          color: "#FF0000",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          ),
        };
      case "whatsapp":
        return {
          bg: "#EDF9F1",
          border: "#CEF0D8",
          color: "#25D366",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.83-3.05-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.28-8.24 2.21 0 4.29.86 5.85 2.43a8.188 8.188 0 0 1 2.41 5.81c0 4.55-3.7 8.26-8.26 8.26zm4.53-6.19c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
            </svg>
          ),
        };
      case "threads":
        return {
          bg: "#F5F5F7",
          border: "#E5E5EA",
          color: "#000000",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.095 5.467 0 12.186 0c6.72 0 12.187 5.095 12.187 11.814 0 .685-.058 1.365-.17 2.032h-3.64c.07-.464.106-.935.106-1.41 0-4.693-3.86-8.552-8.483-8.552-4.622 0-8.482 3.86-8.482 8.552 0 4.693 3.86 8.553 8.482 8.553 2.766 0 5.25-1.39 6.81-3.525l2.76 2.378C19.98 22.38 16.32 24 12.186 24zm4.84-9.822c-.172-2.868-2.128-4.72-4.84-4.72-2.915 0-5.074 2.12-5.074 4.975 0 2.855 2.159 4.975 5.074 4.975 1.547 0 2.924-.613 3.882-1.634l2.45 2.052C16.924 21.602 14.7 22.5 12.186 22.5c-4.78 0-8.665-3.885-8.665-8.665 0-4.78 3.885-8.665 8.665-8.665 4.54 0 8.28 3.498 8.625 7.98h-3.985z" />
            </svg>
          ),
        };
      case "pinterest":
        return {
          bg: "#FDF0F1",
          border: "#F9D4D7",
          color: "#E60023",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.98-.13-2.48.03-3.55.14-.98.92-6.52.92-6.52s-.23-.47-.23-1.17c0-1.1.64-1.92 1.44-1.92.68 0 1.01.51 1.01 1.12 0 .68-.44 1.7-.66 2.65-.19.8.4 1.45 1.18 1.45 1.42 0 2.5-1.5 2.5-3.66 0-1.91-1.37-3.25-3.34-3.25-2.44 0-3.87 1.83-3.87 3.72 0 .74.28 1.53.64 1.96.07.09.08.16.06.25-.07.28-.22.88-.25 1-.04.17-.14.2-.32.12-1.2-.56-1.95-2.31-1.95-3.72 0-3.03 2.2-5.81 6.35-5.81 3.33 0 5.92 2.38 5.92 5.56 0 3.32-2.09 5.98-4.99 5.98-.98 0-1.89-.51-2.21-1.11l-.6 2.3c-.22.84-.81 1.89-1.21 2.53A12.01 12.01 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
          ),
        };
      case "website":
      default:
        return {
          bg: "#FAF2EB",
          border: "#ECDAC9",
          color: "#B84C24",
          icon: (
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" x2="22" y1="12" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          ),
        };
    }
  };

  const monogram = profile.businessName
    ? profile.businessName[0].toUpperCase()
    : "É";

  // WhatsApp clean link generator
  const cleanPhone = (
    profile.whatsAppNumber ||
    profile.phone ||
    "+234 800 ELAN VIP"
  ).replace(/[^0-9]/g, "");
  const whatsAppLink = `https://wa.me/${cleanPhone || "2348003526847"}`;

  return (
    <div
      style={{ color: textColor }}
      className="elan-root bg-[#f8f9fa] min-h-screen font-sans selection:bg-[#d8e2ff] selection:text-[#0058be] antialiased"
    >
      {/* Top Banner / Breadcrumb - Only visible when coming from Studio Settings / Admin */}
      {isFromSettings && (
        <div className="bg-[#edeeef] border-b border-[#e1e3e4] px-4 py-2 text-xs text-[#6b7280] flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <span
              style={{ color: primaryColor }}
              className="inline-flex items-center gap-1 font-medium text-[#191c1d]"
            >
              <Sparkles size={13} className="text-[#0058be]" /> Studio Admin Preview
            </span>
            <span className="text-[#c4c7c7]">·</span>
            <span className="font-mono">luxeadmin.com/{profile.slug || slug}</span>
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                style={{ color: textColor }}
                className="inline-flex items-center gap-1 hover:text-[#0058be] font-medium transition-colors cursor-pointer"
              >
                <Share2 size={12} /> Share profile
              </button>
              <a
                href="/settings"
                className="text-[#6b7280] hover:text-[#191c1d] font-medium transition-colors hidden sm:inline"
              >
                Return to Studio Settings →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#ffffff]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(40,30,20,0.06)] border-b border-[#ece7de] py-3"
            : "bg-[#faf8f5] border-b border-[#ebe6dc] py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href={`/${profile.slug || slug}`}
            className="group flex items-center gap-3 text-decoration-none"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-normal transition-transform group-hover:scale-105 overflow-hidden shadow-2xs shrink-0"
            >
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div
                  style={{ backgroundColor: secondaryColor, color: primaryColor }}
                  className="w-full h-full rounded-full border flex items-center justify-center font-serif"
                >
                  {monogram}
                </div>
              )}
            </div>
            <span
              className="font-serif text-xl sm:text-2xl tracking-tight font-normal"
              style={{ color: textColor }}
            >
              {profile.businessName}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#68625c]">
            <a
              href="#portfolio"
              style={{
                color: activeSection === "portfolio" ? primaryColor : undefined,
              }}
              className="transition-colors hover:opacity-80"
            >
              Portfolio
            </a>
            <a
              href="#services"
              style={{
                color: activeSection === "services" ? primaryColor : undefined,
              }}
              className="transition-colors hover:opacity-80"
            >
              Services
            </a>
            <a
              href="#reviews"
              style={{
                color: activeSection === "reviews" ? primaryColor : undefined,
              }}
              className="transition-colors hover:opacity-80"
            >
              Reviews
            </a>
            <a
              href="#about"
              style={{
                color: activeSection === "about" ? primaryColor : undefined,
              }}
              className="transition-colors hover:opacity-80"
            >
              About
            </a>
          </nav>

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuoteModalOpen(true)}
              style={{ backgroundColor: buttonColor }}
              className={`text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2.5 shadow-sm hover:shadow hover:brightness-95 transition-all duration-200 cursor-pointer flex items-center gap-2 ${radiusClass}`}
            >
              <span>Book Consultation</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#4a453f] hover:text-[#1c1917] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#ffffff] border-b border-[#e8e2d8] px-6 py-5 shadow-lg">
            <nav className="flex flex-col gap-4 text-base font-medium text-[#4a453f]">
              <a
                href="#portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 border-b border-[#f5f1e8]"
              >
                Portfolio
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 border-b border-[#f5f1e8]"
              >
                Services
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 border-b border-[#f5f1e8]"
              >
                Reviews
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 border-b border-[#f5f1e8]"
              >
                About & Contact
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setQuoteModalOpen(true);
                }}
                style={{ backgroundColor: buttonColor }}
                className={`mt-2 w-full text-white py-3 text-center font-medium ${radiusClass}`}
              >
                Book Consultation
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28">
        {/* ========================================================================= */}
        {/* HERO SECTION: TWO-CARD EDITORIAL LAYOUT */}
        {/* ========================================================================= */}
        <section
          id="home"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch justify-center"
        >
          {/* LEFT CARD: 3D Flip Luxury Business Card */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end">
            <div className="perspective-1000 w-full max-w-[460px] flex-1">
              <div
                className={`relative w-full h-full min-h-[480px] sm:min-h-[520px] transition-transform duration-700 transform-style-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* ========================================================= */}
                {/* CARD FRONT: BRAND LOGO + NAME + QR CODE (PER REFERENCE)  */}
                {/* ========================================================= */}
                <div
                  className={`absolute inset-0 backface-hidden bg-gradient-to-b from-[#ffffff] via-[#fcfaf7] to-[#faf4ec] border border-[#e8dfd3] rounded-3xl p-8 sm:p-10 shadow-[0_16px_40px_rgba(70,40,20,0.06)] flex flex-col justify-between items-center text-center overflow-hidden transition-opacity duration-300 ${
                    isFlipped ? 'pointer-events-none z-0' : 'pointer-events-auto z-10'
                  }`}
                >
                  {/* Subtle background luxury pattern/watermark */}
                  <div
                    style={{ color: `${primaryColor}08` }}
                    className="absolute -right-6 -bottom-10 font-serif text-[190px] font-normal select-none pointer-events-none"
                  >
                    {monogram}
                  </div>

                  {/* Top Bar: Studio Tag & Flip Action */}
                  <div className="w-full flex items-center justify-between gap-2 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-[#ebd8ca] px-3 py-1 rounded-full text-[10px] font-medium text-[#8a3e20] uppercase tracking-wider">
                      <span
                        style={{ backgroundColor: primaryColor }}
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                      />
                      Official Studio Card
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-[#191c1d] hover:text-[#0058be] bg-white hover:bg-[#f3f4f5] px-3 py-1.5 rounded-full border border-[#e5e7eb] transition-all cursor-pointer shadow-2xs z-10 font-medium"
                      title="Click to flip and view full studio contact details"
                    >
                      <RotateCw size={12} />
                      <span className="font-medium text-[11px]">
                        View Details
                      </span>
                    </button>
                  </div>

                  {/* Middle Area: Arched Crest + Company Logo / Name + Tagline */}
                  <div className="my-auto py-2 z-10 flex flex-col items-center max-w-md w-full">
                    {/* Brand Logo Emblem (Clean without primary color border) */}
                    <div className="relative mb-4 flex flex-col items-center">
                      <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105">
                        {profile.logoUrl ? (
                          <img
                            src={profile.logoUrl}
                            alt={profile.businessName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div
                            style={{ backgroundColor: secondaryColor, color: primaryColor }}
                            className="w-full h-full rounded-full flex items-center justify-center font-serif text-6xl font-normal select-none"
                          >
                            {monogram}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company Name */}
                    <h1
                      style={{ color: textColor }}
                      className="font-serif text-3xl sm:text-4xl lg:text-[40px] tracking-tight font-normal leading-tight text-center"
                    >
                      {profile.businessName}
                    </h1>

                    {/* Tagline / Subtitle */}
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="h-[1px] w-6 bg-[#d8ccbe]" />
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8a7f73] font-medium text-center">
                        {profile.tagline ||
                          `Bespoke Event Studio · ${profile.location}`}
                      </span>
                      <span className="h-[1px] w-6 bg-[#d8ccbe]" />
                    </div>
                  </div>

                  {/* Bottom Area: Framed QR Code + Scan Instruction */}
                  <div className="w-full flex flex-col items-center z-10 pt-2">
                    <div className="bg-white p-2.5 sm:p-3 border-2 border-[#e5dcd1] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                          src="https://cdn.accessa.ng/test/accessa/joe-fitness/qrcodes/images/7343ffeb0bfd056e77e8e8d52edf0722.png"
                          alt={`${profile.businessName} QR Code`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8c8278] tracking-wide mt-2 font-medium">
                      Scan with camera to connect
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(true);
                      }}
                      style={{ color: primaryColor }}
                      className="mt-2 text-xs font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Flip for direct studio details</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* CARD BACK: EXACT REFERENCE REPLICATION (LIGHT MODE)      */}
                {/* ========================================================= */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 bg-[#ffffff] border border-[#e8dfd3] rounded-3xl p-7 sm:p-8 shadow-[0_16px_40px_rgba(70,40,20,0.06)] flex flex-col justify-between overflow-y-auto transition-opacity duration-300 ${
                    isFlipped ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
                  }`}
                >
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: secondaryColor, borderColor: '#ebd8ca', color: primaryColor }}
                        className="w-11 h-11 rounded-2xl border flex items-center justify-center font-serif text-xl font-normal shrink-0 shadow-2xs overflow-hidden"
                      >
                        {profile.logoUrl ? (
                          <img
                            src={profile.logoUrl}
                            alt={profile.businessName}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          monogram
                        )}
                      </div>
                      <div>
                        <div className="text-base font-serif font-semibold text-[#1c1917] leading-tight">
                          {profile.businessName}
                        </div>
                        <div className="text-[10px] text-[#8c8278] uppercase tracking-[0.14em] font-medium mt-0.5">
                          Studio Details & Concierge
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsFlipped(false)
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-[#5c544d] hover:text-[#1c1917] bg-transparent hover:bg-[#faf6f0] px-3.5 py-1.5 rounded-full border border-[#d6c7b7] transition-all cursor-pointer shadow-2xs active:scale-95 z-20"
                    >
                      <RotateCw size={12} />
                      <span className="font-medium text-[11px]">Return to Front</span>
                    </button>
                  </div>

                  {/* Editorial Philosophy Quote with Left Accent Bar */}
                  <div className="my-3 pl-4 border-l-[3px] border-[#0058be] py-0.5">
                    <p className="text-xs sm:text-[14px] text-[#191c1d] font-sans italic leading-relaxed">
                      &ldquo;{profile.description}&rdquo;
                    </p>
                  </div>

                  {/* Clean Horizontal Contact Details Stack with Full Dividers */}
                  <div className="border-t border-[#ebd8ca]/80 divide-y divide-[#ebd8ca]/70 text-xs my-1">
                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                        <Clock3 size={15} style={{ color: primaryColor }} /> Operating Hours:
                      </span>
                      <span className="font-semibold text-[#1c1917] text-right">
                        {profile.operatingHours}: {profile.timeFrom} – {profile.timeTo}
                      </span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                        <MapPin size={15} style={{ color: primaryColor }} /> Studio Flagship:
                      </span>
                      <span className="font-semibold text-[#1c1917] truncate max-w-[220px] text-right">
                        {profile.physicalAddress || profile.location}
                      </span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                        <Phone size={15} style={{ color: primaryColor }} /> WhatsApp Line:
                      </span>
                      <span className="font-mono font-semibold text-[#1c1917] text-right">
                        {profile.whatsAppNumber || profile.phone}
                      </span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <span className="text-[#5c544d] flex items-center gap-2 font-medium shrink-0">
                        <Mail size={15} style={{ color: primaryColor }} /> Studio Email:
                      </span>
                      <span className="font-semibold text-[#1c1917] truncate max-w-[200px] text-right">
                        {profile.emailAddress || profile.email}
                      </span>
                    </div>
                  </div>

                  {/* Verification Banner */}
                  <div className="bg-[#faf6f0] border border-[#ebd8ca] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs my-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1c1917]">
                      <div
                        style={{ backgroundColor: primaryColor }}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span>Verified LuxeAdmin Studio</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#78716c] uppercase">
                      ID: {profile.slug?.toUpperCase() || 'ELAN-EVENTS'}
                    </span>
                  </div>

                  {/* Action Buttons: Solid Left + Outline Right */}
                  <div className="pt-2 space-y-2.5 z-10">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setQuoteModalOpen(true)
                        }}
                        style={{ backgroundColor: buttonColor }}
                        className={`text-white text-xs font-bold uppercase tracking-wider py-3 shadow-xs hover:brightness-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${radiusClass}`}
                      >
                        <span>Get a Quote</span>
                        <ArrowRight size={13} />
                      </button>

                      <a
                        href={whatsAppLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`bg-white hover:bg-[#faf6f0] text-[#1c1917] border border-[#d6c7b7] text-xs font-bold uppercase tracking-wider py-3 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${radiusClass}`}
                      >
                        <MessageCircle size={14} className="text-[#25D366]" />
                        <span>WhatsApp Us</span>
                      </a>
                    </div>

                    {/* Bottom Links */}
                    <div className="flex items-center justify-between text-xs text-[#78716c] pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyLink()
                        }}
                        style={{ color: primaryColor }}
                        className="font-medium hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Share2 size={13} />
                        <span>Copy Profile Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsFlipped(false)
                        }}
                        className="text-[#78716c] hover:text-[#1c1917] flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <RotateCw size={12} />
                        <span>Flip back</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Company Studio Card & Newsletter */}
          <div className="lg:col-span-6 bg-white border border-[#eae3d8] rounded-3xl p-8 sm:p-10 shadow-[0_12px_36px_rgba(40,30,20,0.04)] flex flex-col justify-between max-w-[480px] w-full mx-auto lg:mx-0">
            <div>
              <div className="flex items-center justify-between border-b border-[#f0e8dc] pb-5 mb-6">
                <div>
                  <span
                    style={{ color: primaryColor }}
                    className="text-[10px] uppercase tracking-[0.16em] font-semibold"
                  >
                    Studio Highlights
                  </span>
                  <h2 className="font-serif text-2xl text-[#1c1917] font-normal mt-1">
                    The Art of Grand Occasions
                  </h2>
                </div>
                <div
                  style={{
                    backgroundColor: secondaryColor,
                    borderColor: "#ebd8ca",
                    color: primaryColor,
                  }}
                  className="w-12 h-12 rounded-2xl border flex items-center justify-center font-serif text-2xl overflow-hidden shadow-2xs"
                >
                  {profile.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt={profile.businessName}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    monogram
                  )}
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#5a534c]">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf7f2] border border-[#eee7dc]">
                  <div
                    style={{
                      backgroundColor: secondaryColor,
                      color: primaryColor,
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Check size={12} />
                  </div>
                  <div>
                    <strong className="text-[#1c1917] block font-medium">
                      Bespoke Architectural Styling
                    </strong>
                    <span className="text-[#78716c]">
                      Custom spatial geometry, mood lighting, and curated floral
                      pavilions.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf7f2] border border-[#eee7dc]">
                  <div
                    style={{
                      backgroundColor: secondaryColor,
                      color: primaryColor,
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Check size={12} />
                  </div>
                  <div>
                    <strong className="text-[#1c1917] block font-medium">
                      Worldwide Destination Reach
                    </strong>
                    <span className="text-[#78716c]">
                      Executing landmark celebrations across {profile.location}.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf7f2] border border-[#eee7dc]">
                  <div
                    style={{
                      backgroundColor: secondaryColor,
                      color: primaryColor,
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Check size={12} />
                  </div>
                  <div>
                    <strong className="text-[#1c1917] block font-medium">
                      White Glove VIP Concierge
                    </strong>
                    <span className="text-[#78716c]">
                      Discreet high-net-worth guest handling and synchronized
                      dining.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="mt-8 pt-6 border-t border-[#f0e8dc]">
              <div className="mb-3">
                <span
                  style={{ color: primaryColor }}
                  className="text-[11px] font-serif italic"
                >
                  The {profile.businessName} Journal
                </span>
                <p className="text-xs text-[#6e665e] mt-0.5">
                  Receive our quarterly lookbook of weddings, galas, and spatial
                  design narratives.
                </p>
              </div>

              {newsletterSubscribed ? (
                <div className="bg-[#eef8f1] border border-[#cbe6d2] text-[#2c6e49] p-3 rounded-xl text-xs flex items-center gap-2">
                  <Check size={15} />
                  <span>You are subscribed to the seasonal journal.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0058be]"
                  />
                  <button
                    type="submit"
                    className={`bg-[#000000] hover:bg-[#262626] text-white text-xs font-medium px-4 py-2.5 transition-colors cursor-pointer shrink-0 ${radiusClass}`}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SOCIAL CHANNELS SECTION */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ebd8ca] pb-6">
            <div>
              <span
                style={{ color: primaryColor }}
                className="text-[10px] uppercase tracking-[0.2em] font-semibold"
              >
                Digital Presence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal mt-1">
                Social Channels
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#78716c] max-w-md">
              Follow our daily creations, live behind-the-scenes
              transformations, and editorial showcases across{" "}
              {profile.socialChannels?.length || 10} platforms.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
            {(profile.socialChannels || []).map(channel => {
              const meta = getSocialPlatformMeta(channel.type);
              const cleanUrl =
                channel.url ||
                (channel.handle?.startsWith("http")
                  ? channel.handle
                  : `https://${channel.handle}`);
              return (
                <a
                  key={channel.id}
                  href={cleanUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`Visit our ${channel.label}`}
                  className="group bg-white border border-[#eae3d8] hover:border-[#decbbd] hover:shadow-[0_10px_24px_rgba(40,30,20,0.06)] hover:-translate-y-0.5 rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col items-center justify-center text-center text-decoration-none min-h-[108px]"
                >
                  <div
                    style={{
                      backgroundColor: meta.bg,
                      borderColor: meta.border,
                      color: meta.color,
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center mx-auto mb-2.5 shadow-2xs transition-transform duration-200 group-hover:scale-110"
                  >
                    {meta.icon}
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-[#191c1d] group-hover:text-[#0058be] transition-colors block tracking-tight">
                    {channel.label}
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* REVIEWS SECTION */}
        {/* ========================================================================= */}
        <section
          id="reviews"
          className="space-y-8 bg-[#faf4ee] border border-[#ecdacb] rounded-3xl p-8 sm:p-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#e8d5c4] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex" style={{ color: primaryColor }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill={primaryColor} />
                  ))}
                </div>
                <span className="font-serif text-2xl text-[#1c1917] font-semibold ml-1">
                  {averageRating}
                </span>
                <span className="text-xs text-[#78716c] font-medium">
                  · Based on {totalReviews} reviews
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal">
                Client Testimonials
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setReviewModalOpen(true)}
                className={`bg-white hover:bg-[#faf7f2] text-[#1c1917] border border-[#d8c7b8] text-xs font-medium px-4 py-2.5 transition-all cursor-pointer shadow-2xs ${radiusClass}`}
              >
                Leave a Review
              </button>
              <a
                href={profile.googleReviewsLink || "https://google.com"}
                target="_blank"
                rel="noreferrer"
                style={{ color: primaryColor }}
                className="inline-flex items-center gap-1.5 text-xs hover:underline font-medium"
              >
                <span>See all reviews on Google</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(profile.reviews || []).slice(0, 3).map(review => (
              <div
                key={review.id}
                className="bg-white border border-[#eae2d6] rounded-2xl p-6 shadow-[0_4px_20px_rgba(70,40,20,0.03)] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-1"
                    style={{ color: primaryColor }}
                  >
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={primaryColor} />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#4a443e] font-serif italic leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f2ebe1] flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#1c1917] block font-medium">
                      {review.author}
                    </strong>
                    <span className="text-[#8a8075] text-[11px]">
                      {review.eventType}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#a69c90]">
                    {review.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PORTFOLIO SECTION: OUR BEST WORK */}
        {/* ========================================================================= */}
        <section id="portfolio" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ebd8ca] pb-6">
            <div>
              <span
                style={{ color: primaryColor }}
                className="text-[10px] uppercase tracking-[0.2em] font-semibold"
              >
                Curated Showcase
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal mt-1">
                Our Best Work
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#78716c] max-w-md">
              A selection of bespoke weddings, executive galas, and private
              celebrations brought to life by {profile.businessName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(profile.portfolio || []).map((project, index) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group bg-white border border-[#eae2d6] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(40,30,20,0.03)] hover:shadow-[0_16px_40px_rgba(70,40,20,0.08)] transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Project Image Box */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ebe4da]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div
                    style={{ color: primaryColor }}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-medium border border-[#e8ded3] shadow-2xs"
                  >
                    0{index + 1} · {project.category}
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#8a8075] mb-1.5">
                      <MapPin size={12} style={{ color: primaryColor }} />
                      <span>{project.location}</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] group-hover:opacity-80 transition-opacity font-normal">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#665e56] leading-relaxed mt-2 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#f2ece2] flex items-center justify-between text-xs">
                    <span className="text-[#8c8276] text-[11px]">
                      {project.stats}
                    </span>
                    <span
                      style={{ color: primaryColor }}
                      className="font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                    >
                      View Gallery <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ABOUT & SERVICES SECTION: TWO-COLUMN LAYOUT */}
        {/* ========================================================================= */}
        <section
          id="about"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* LEFT: Curated Services Breakdown */}
          <div id="services" className="lg:col-span-7 space-y-6">
            <div>
              <span
                style={{ color: primaryColor }}
                className="text-[10px] uppercase tracking-[0.2em] font-semibold"
              >
                Offerings
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal mt-1">
                Bespoke Services
              </h2>
            </div>

            <div className="space-y-4">
              {(profile.services || []).map((serviceName, i) => (
                <div
                  key={serviceName}
                  className="bg-white border border-[#eae3d8] rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-[#b84c24]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: primaryColor }}
                        className="text-xs font-serif font-semibold"
                      >
                        0{i + 1}
                      </span>
                      <h4 className="font-serif text-lg text-[#1c1917] font-medium">
                        {serviceName}
                      </h4>
                    </div>
                    <p className="text-xs text-[#6e665e] max-w-lg leading-relaxed">
                      Custom tailored planning, spatial orchestration, and
                      bespoke design direction curated by {profile.businessName}
                      .
                    </p>
                  </div>
                  <span className="self-start sm:self-center text-[10px] uppercase tracking-wider text-[#8a8075] bg-[#faf6f0] border border-[#ede3d6] px-3 py-1 rounded-full shrink-0">
                    Bespoke
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: The Élan Touch & Stationery Business Card */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span
                style={{ color: primaryColor }}
                className="text-[10px] uppercase tracking-[0.2em] font-semibold"
              >
                Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal mt-1">
                The {profile.businessName.split(" ")[0] || "Studio"} Touch
              </h2>
            </div>

            <div className="bg-white border border-[#eae3d8] rounded-3xl p-8 shadow-[0_12px_36px_rgba(40,30,20,0.04)] space-y-6">
              <p className="text-sm text-[#4a443e] font-serif italic leading-relaxed">
                &ldquo;{profile.description}&rdquo;
              </p>

              <div className="border-t border-[#f0e8dc] pt-6 space-y-4 text-xs text-[#524b45]">
                <div className="flex items-start gap-3">
                  <Clock3
                    size={16}
                    style={{ color: primaryColor }}
                    className="shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[#1c1917] block font-medium">
                      Operating Hours
                    </strong>
                    <span>
                      {profile.operatingHours}: {profile.timeFrom} –{" "}
                      {profile.timeTo}
                    </span>
                    {profile.byAppointmentOnly && (
                      <div className="text-[11px] text-[#8a8075] mt-0.5">
                        (By appointment only)
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    style={{ color: primaryColor }}
                    className="shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[#1c1917] block font-medium">
                      Studio Flagship
                    </strong>
                    <span>{profile.physicalAddress || profile.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={16}
                    style={{ color: primaryColor }}
                    className="shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[#1c1917] block font-medium">
                      Direct WhatsApp Concierge
                    </strong>
                    <span>{profile.whatsAppNumber || profile.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail
                    size={16}
                    style={{ color: primaryColor }}
                    className="shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[#1c1917] block font-medium">
                      Inquiries & Proposals
                    </strong>
                    <span>{profile.emailAddress || profile.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className={`w-full bg-[#1c1917] hover:bg-[#38332f] text-white text-xs font-medium py-3.5 transition-colors cursor-pointer flex items-center justify-center gap-2 ${radiusClass}`}
                >
                  <span>Request Private Consultation</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CTA SECTION: PLANNING SOMETHING SPECIAL? */}
        {/* ========================================================================= */}
        <section
          style={{
            background: `linear-gradient(135deg, ${secondaryColor} 0%, #faf8f5 50%, ${secondaryColor} 100%)`,
          }}
          className="border border-[#ebd4c2] rounded-3xl p-8 sm:p-14 shadow-[0_16px_40px_rgba(70,40,20,0.05)] text-center max-w-4xl mx-auto space-y-6"
        >
          <div
            style={{ color: primaryColor }}
            className="w-12 h-12 rounded-full bg-[#ffffff] border border-[#e4d0bf] font-serif text-2xl flex items-center justify-center mx-auto shadow-2xs"
          >
            {monogram}
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1c1917] font-normal tracking-tight">
              Planning something special?
            </h2>
            <p className="text-sm sm:text-base text-[#615851] leading-relaxed">
              Tell us what you&apos;re planning and we&apos;ll get back to you
              to schedule an initial consultation with our creative directors.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setQuoteModalOpen(true)}
              style={{ backgroundColor: buttonColor }}
              className={`text-white text-sm font-medium px-8 py-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 ${radiusClass}`}
            >
              <span>Get a Quote</span>
              <ArrowRight size={15} />
            </button>

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noreferrer"
              className={`bg-white hover:bg-[#fcfaf7] text-[#1c1917] border border-[#dec9ba] text-sm font-medium px-8 py-3.5 transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${radiusClass}`}
            >
              <MessageCircle size={16} className="text-[#25D366]" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-[#faf8f5] border-t border-[#e8dfd3] mt-24 py-14 text-xs text-[#78716c]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: secondaryColor,
              }}
              className="w-8 h-8 rounded-full border flex items-center justify-center font-serif text-base overflow-hidden shadow-2xs"
            >
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                monogram
              )}
            </div>
            <div>
              <div className="font-serif text-base text-[#1c1917] font-medium">
                {profile.businessName}
              </div>
              <div className="text-[10px] text-[#8c8278]">
                {profile.physicalAddress || profile.location}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#635c55]">
            <a
              href="#portfolio"
              className="hover:text-[#b84c24] transition-colors"
            >
              Portfolio
            </a>
            <a
              href="#services"
              className="hover:text-[#b84c24] transition-colors"
            >
              Services
            </a>
            <a
              href="#reviews"
              className="hover:text-[#b84c24] transition-colors"
            >
              Reviews
            </a>
            <a href="#about" className="hover:text-[#b84c24] transition-colors">
              About
            </a>
            <a href="/login" className="hover:text-[#b84c24] transition-colors">
              Studio Login
            </a>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#8a8075]">
            <div>
              © {new Date().getFullYear()} {profile.businessName}. All rights
              reserved.
            </div>
            <div className="text-[10px] text-[#a89e92] mt-0.5">
              Powered by LuxeAdmin Platform
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Consultation / Get a Quote Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#171716]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5dcd1] rounded-3xl max-w-lg w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-6 right-6 text-[#78716c] hover:text-[#1c1917] p-1 cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span
                style={{ color: primaryColor }}
                className="text-[10px] uppercase tracking-[0.18em] font-semibold"
              >
                Inquiry Desk
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal mt-1">
                Book a Consultation
              </h3>
              <p className="text-xs text-[#78716c] mt-1">
                Tell {profile.businessName} about your upcoming celebration and
                vision.
              </p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#4a443e] font-medium mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Folashade Adeleke"
                  value={quoteForm.name}
                  onChange={e =>
                    setQuoteForm({ ...quoteForm, name: e.target.value })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1f2937] font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="folashade@example.com"
                    value={quoteForm.email}
                    onChange={e =>
                      setQuoteForm({ ...quoteForm, email: e.target.value })
                    }
                    className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  />
                </div>

                <div>
                  <label className="block text-[#1f2937] font-medium mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={quoteForm.phone}
                    onChange={e =>
                      setQuoteForm({ ...quoteForm, phone: e.target.value })
                    }
                    className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1f2937] font-medium mb-1">
                    Service Required
                  </label>
                  <select
                    value={quoteForm.service}
                    onChange={e =>
                      setQuoteForm({ ...quoteForm, service: e.target.value })
                    }
                    className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  >
                    {(profile.services || []).map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#1f2937] font-medium mb-1">
                    Estimated Date
                  </label>
                  <input
                    type="date"
                    value={quoteForm.eventDate}
                    onChange={e =>
                      setQuoteForm({ ...quoteForm, eventDate: e.target.value })
                    }
                    className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Event Vision / Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details about your guest count, aesthetic preferences, venue location..."
                  value={quoteForm.message}
                  onChange={e =>
                    setQuoteForm({ ...quoteForm, message: e.target.value })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded p-3.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  style={{ backgroundColor: buttonColor }}
                  className={`w-full text-white text-xs font-medium py-3.5 shadow-sm hover:brightness-95 transition-all cursor-pointer flex items-center justify-center gap-2 ${radiusClass}`}
                >
                  {quoteSubmitting ? (
                    <span>Submitting inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Consultation Request</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Leave a Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#171716]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5dcd1] rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-6 right-6 text-[#78716c] hover:text-[#1c1917] p-1 cursor-pointer"
              aria-label="Close review dialog"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span
                style={{ color: primaryColor }}
                className="text-[10px] uppercase tracking-[0.18em] font-semibold"
              >
                Client Voices
              </span>
              <h3 className="font-serif text-2xl text-[#1c1917] font-normal mt-1">
                Leave a Testimonial
              </h3>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#4a443e] font-medium mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Folashade Adeleke"
                  value={reviewForm.author}
                  onChange={e =>
                    setReviewForm({ ...reviewForm, author: e.target.value })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Event Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wedding, Milestone Gala, Corporate"
                  value={reviewForm.eventType}
                  onChange={e =>
                    setReviewForm({ ...reviewForm, eventType: e.target.value })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Rating
                </label>
                <div className="flex gap-2 items-center py-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="p-1 text-[#f59e0b] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        size={20}
                        fill={star <= reviewForm.rating ? "#f59e0b" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Your Review / Experience
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the artistry, communication, and execution..."
                  value={reviewForm.comment}
                  onChange={e =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded p-3.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{ backgroundColor: buttonColor }}
                  className={`w-full text-white text-xs font-medium py-3 shadow-sm transition-all cursor-pointer ${radiusClass}`}
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Portfolio Project Lightbox */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-[#171716]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white border border-[#e5dcd1] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-[#78716c] hover:text-[#1c1917] p-2 bg-[#faf6f0] rounded-full cursor-pointer z-10"
              aria-label="Close project lightbox"
            >
              <X size={18} />
            </button>

            <div>
              <span
                style={{ color: primaryColor }}
                className="text-[10px] uppercase tracking-[0.18em] font-semibold"
              >
                {selectedProject.category} · {selectedProject.location}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal mt-1">
                {selectedProject.title}
              </h3>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#faf6f0]">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-[#524b45] leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="p-4 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-between text-xs text-[#78716c]">
              <span>
                <strong>Scope:</strong> {selectedProject.stats}
              </span>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setQuoteModalOpen(true);
                }}
                style={{ color: primaryColor }}
                className="font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                Inquire about similar celebration <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1917] text-white text-xs px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-[#38332e] animate-fade-in">
          <div
            style={{ backgroundColor: primaryColor }}
            className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
          >
            <Check size={12} />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#a89e92] hover:text-white ml-2 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

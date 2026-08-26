"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createWhatsAppConsultationUrl,
  getBusinessBySlug,
  getCustomers,
  submitConsultationInquiry,
  submitReview,
} from "@/lib/api";
import { businessProfile as defaultProfile } from "@/lib/mock-data";
import type { BusinessProfile, ButtonRadiusType, PortfolioProject, ServiceItem } from "@/lib/types";

import { ConsultationModal } from "./atelier/consultation-modal";
import { StudioPortfolioSection } from "./atelier/portfolio-section";
import { ProjectModal } from "./atelier/project-modal";
import { ReviewModal } from "./atelier/review-modal";
import { StudioReviewsSection } from "./atelier/reviews-section";
import { StudioServicesSection } from "./atelier/services-section";
import { StudioSocialSection } from "./atelier/social-section";
import { StationeryCard } from "./atelier/stationery-card";
import { StudioFooter } from "./atelier/studio-footer";
import { StudioHighlightsCard } from "./atelier/studio-highlights-card";
import { StudioNavbar } from "./atelier/studio-navbar";
import { NotFoundView } from "./not-found-view";

interface ElanEventsPageProps {
  initialProfile?: BusinessProfile;
  slug?: string;
}

export function ElanEventsPage({ initialProfile, slug = "elan-events" }: ElanEventsPageProps) {
  // Live dynamic profile state
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile || defaultProfile);
  const [isNotFound, setIsNotFound] = useState(false);

  // Fetch freshest profile and subscribe to settings changes
  useEffect(() => {
    getBusinessBySlug(slug).then(res => {
      if (res) {
        setProfile(res);
        setIsNotFound(false);
      } else {
        setIsNotFound(true);
      }
    });

    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BusinessProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
        setIsNotFound(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("luxe_profile_updated", handleProfileUpdate);
      return () => window.removeEventListener("luxe_profile_updated", handleProfileUpdate);
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
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Form states
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
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

  const [customerCount, setCustomerCount] = useState<number>(14);

  useEffect(() => {
    getCustomers().then(res => {
      if (res?.length) setCustomerCount(res.length);
    });
  }, []);

  // Scroll listener for sticky header & active nav section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["social", "portfolio", "services", "reviews"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set default quote service once profile loads
  useEffect(() => {
    if (profile.services && profile.services.length > 0 && !quoteForm.service) {
      const firstService = profile.services[0];
      const serviceName = typeof firstService === "string" ? firstService : firstService.name;
      setQuoteForm(prev => ({ ...prev, service: serviceName }));
    }
  }, [profile.services, quoteForm.service]);

  // Styling helpers
  const getRadiusClass = (radius?: ButtonRadiusType) => {
    switch (radius) {
      case "Square":
        return "rounded-none";
      case "Rounded":
        return "rounded-2xl";
      case "Pill":
        return "rounded-full";
      default:
        return "rounded-lg";
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const primaryColor = profile.colors?.primary || "#000000";
  const secondaryColor = profile.colors?.secondary || "#0058BE";
  const buttonColor = profile.colors?.button || "#000000";
  const textColor = profile.colors?.text || "#191C1D";
  const cardBgColor = profile.colors?.cardBackground || "#faf6f0";
  const radiusClass = getRadiusClass(profile.buttonRadius);

  // Check if WhatsApp is enabled in connected channels and has a valid number
  const whatsAppChannel = profile.socialChannels?.find(c => c.type === "whatsapp");
  const isWhatsAppEnabled =
    (whatsAppChannel ? whatsAppChannel.connected : true) &&
    Boolean((profile.whatsAppNumber || profile.phone)?.trim());

  // Computed review stats
  const averageRating = useMemo(() => {
    if (!profile.reviews || profile.reviews.length === 0) return "5.0";
    const sum = profile.reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / profile.reviews.length).toFixed(1);
  }, [profile.reviews]);

  const totalReviews = (profile.reviews?.length || 0) > 3 ? profile.reviews.length : 127;

  const handleCopyLink = () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://shopwus.com/${profile.slug || slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast("Business profile link copied to clipboard!");
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    try {
      const selectedService =
        quoteForm.service || (profile.services as ServiceItem[])?.[0]?.name || "Luxury Weddings";

      await submitConsultationInquiry({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        service: selectedService,
        eventDate: quoteForm.eventDate || new Date().toISOString().slice(0, 10),
        budget: Number(quoteForm.budget) || 50000,
        message: quoteForm.message || "Consultation request submitted via public profile.",
      });

      const whatsappUrl = createWhatsAppConsultationUrl({
        studioPhone: profile.whatsAppNumber || profile.phone,
        studioName: profile.businessName || "Élan Events",
        clientName: quoteForm.name,
        clientPhone: quoteForm.phone,
        clientEmail: quoteForm.email,
        service: selectedService,
        eventDate: quoteForm.eventDate,
        budget: quoteForm.budget,
        message: quoteForm.message,
      });

      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setQuoteSubmitting(false);
      setQuoteModalOpen(false);
      showToast("Consultation inquiry saved! Opening WhatsApp to start direct chat...");
      setQuoteForm({
        name: "",
        email: "",
        phone: "",
        service: (profile.services as ServiceItem[])?.[0]?.name || "Luxury Weddings",
        eventDate: "",
        budget: "50000",
        message: "",
      });
    } catch {
      setQuoteSubmitting(false);
      showToast("Failed to submit. Please try again or reach out directly on WhatsApp.");
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

  const monogram = profile.businessName ? profile.businessName[0].toUpperCase() : "Ś";

  const cleanPhone = (profile.whatsAppNumber || profile.phone || "+234 800 ELAN VIP").replace(
    /[^0-9]/g,
    ""
  );
  const whatsAppLink = `https://wa.me/${cleanPhone || "2348055966944"}`;

  if (isNotFound) {
    return <NotFoundView slug={slug} />;
  }

  return (
    <div
      className="min-h-screen font-sans antialiased text-[#191c1d] selection:bg-[#ecdac9] selection:text-[#191c1d] flex flex-col justify-between"
      style={{ backgroundColor: "#faf8f5" }}
    >
      {/* Floating Studio Navbar */}
      <StudioNavbar
        profile={profile}
        slug={slug}
        isFromSettings={isFromSettings}
        isScrolled={isScrolled}
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setQuoteModalOpen={setQuoteModalOpen}
        handleCopyLink={handleCopyLink}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        buttonColor={buttonColor}
        textColor={textColor}
        monogram={monogram}
        radiusClass={radiusClass}
      />

      {/* Main Studio Body */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-20 space-y-24">
        {/* HERO SECTION: Interactive 3D Stationery Card & Editorial Narrative */}
        <section id="home" className="pt-4 sm:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* LEFT: Flip Stationery Card */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-[480px] h-[580px]">
                <StationeryCard
                  profile={profile}
                  slug={slug}
                  isFlipped={isFlipped}
                  setIsFlipped={setIsFlipped}
                  setQuoteModalOpen={setQuoteModalOpen}
                  handleCopyLink={handleCopyLink}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  buttonColor={buttonColor}
                  cardBgColor={cardBgColor}
                  monogram={monogram}
                  averageRating={averageRating}
                  totalReviews={totalReviews}
                  whatsAppLink={whatsAppLink}
                  radiusClass={radiusClass}
                />
              </div>
            </div>

            {/* RIGHT: Studio Operational Status & Presence Card */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <StudioHighlightsCard
                profile={profile}
                totalCustomers={customerCount}
                setQuoteModalOpen={setQuoteModalOpen}
                handleCopyLink={handleCopyLink}
                whatsAppLink={whatsAppLink}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                buttonColor={buttonColor}
                cardBgColor={cardBgColor}
                radiusClass={radiusClass}
              />
            </div>
          </div>
        </section>

        {/* SECTION: Connected Social Networks & Verified Channels */}
        <StudioSocialSection
          profile={profile}
          primaryColor={primaryColor}
          radiusClass={radiusClass}
        />

        {/* SECTION: Portfolio Gallery */}
        <StudioPortfolioSection
          portfolio={profile.portfolio || []}
          setSelectedProject={setSelectedProject}
          setQuoteModalOpen={setQuoteModalOpen}
          primaryColor={primaryColor}
          buttonColor={buttonColor}
          radiusClass={radiusClass}
        />

        {/* SECTION: Curated Services */}
        <StudioServicesSection
          profile={profile}
          setQuoteModalOpen={setQuoteModalOpen}
          setQuoteForm={setQuoteForm}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          buttonColor={buttonColor}
          radiusClass={radiusClass}
        />

        {/* SECTION: Authenticated Client Reviews */}
        <StudioReviewsSection
          reviews={profile.reviews || []}
          averageRating={averageRating}
          totalReviews={totalReviews}
          setReviewModalOpen={setReviewModalOpen}
          googleReviewsLink={profile.googleReviewsLink}
          primaryColor={primaryColor}
          buttonColor={buttonColor}
          radiusClass={radiusClass}
        />

        {/* CTA BANNER */}
        <section
          style={{ backgroundColor: cardBgColor }}
          className="border border-[#ebd8ca] rounded-3xl p-8 sm:p-14 text-center space-y-6"
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <span
              style={{ color: primaryColor }}
              className="text-[10px] uppercase tracking-[0.2em] font-semibold block"
            >
              Begin Your Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal">
              Ready to Create Something Extraordinary?
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] leading-relaxed">
              Tell us what you&apos;re planning and we&apos;ll get back to you to schedule an
              initial consultation with our creative directors.
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

            {isWhatsAppEnabled && (
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                className={`bg-white hover:bg-[#fcfaf7] text-[#1c1917] border border-[#dec9ba] text-sm font-medium px-8 py-3.5 transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${radiusClass}`}
              >
                <svg
                  className="w-4 h-4 text-[#25D366] shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.83-3.05-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.28-8.24 2.21 0 4.29.86 5.85 2.43a8.188 8.188 0 0 1 2.41 5.81c0 4.55-3.7 8.26-8.26 8.26zm4.53-6.19c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                </svg>
                <span>WhatsApp Us</span>
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Studio Bottom Footer */}
      <StudioFooter
        profile={profile}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        monogram={monogram}
      />

      {/* Modals & Popups */}
      <ConsultationModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        profile={profile}
        quoteForm={quoteForm}
        setQuoteForm={setQuoteForm}
        quoteSubmitting={quoteSubmitting}
        onSubmit={handleQuoteSubmit}
        primaryColor={primaryColor}
        buttonColor={buttonColor}
        radiusClass={radiusClass}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        reviewForm={reviewForm}
        setReviewForm={setReviewForm}
        reviewSubmitting={reviewSubmitting}
        onSubmit={handleReviewSubmit}
        primaryColor={primaryColor}
        buttonColor={buttonColor}
        radiusClass={radiusClass}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={() => {
          setSelectedProject(null);
          setQuoteModalOpen(true);
        }}
        primaryColor={primaryColor}
      />

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

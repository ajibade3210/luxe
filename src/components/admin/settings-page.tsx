"use client";

import { Copy, ExternalLink, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import {
  checkSlugAvailability,
  getBusinessProfile,
  publishChanges,
  updateBusinessProfile,
  uploadBusinessLogo,
  uploadPortfolioImage,
} from "@/lib/api";
import { businessProfile as initialMockProfile } from "@/lib/mock-data";
import type {
  ButtonRadiusType,
  ColorScheme,
  CurrencyCode,
  PortfolioProject,
  ServiceItem,
  SocialChannel,
} from "@/lib/types";
import { useAdminToast } from "./admin-layout";
import { AppearanceSection } from "./settings/appearance-section";
import { ChannelsSection } from "./settings/channels-section";
import { ContactSection } from "./settings/contact-section";
import { IdentitySection } from "./settings/identity-section";
import { PortfolioSection } from "./settings/portfolio-section";
import { ServicesSection } from "./settings/services-section";

export function EnhancedSettingsPage({ onToast }: { onToast?: (s: string) => void }) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  // Main settings state
  const [name, setName] = useState(initialMockProfile.businessName);
  const [slug, setSlug] = useState(initialMockProfile.slug);
  const [tagline, setTagline] = useState(
    initialMockProfile.tagline ||
      "We design unforgettable weddings, corporate events, and private celebrations."
  );
  const [location, setLocation] = useState(initialMockProfile.location);
  const [website, setWebsite] = useState(initialMockProfile.website);
  const [email, setEmail] = useState(initialMockProfile.email);
  const [currency, setCurrency] = useState<CurrencyCode>(initialMockProfile.currency || "NGN");
  const [about, setAbout] = useState(initialMockProfile.description);

  // Services
  const [services, setServices] = useState<ServiceItem[]>(
    (initialMockProfile.services as ServiceItem[]) || []
  );
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceInput, setNewServiceInput] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Bespoke");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(
    initialMockProfile.portfolio || []
  );
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<PortfolioProject>>({
    title: "",
    category: "Luxury Wedding",
    location: "Victoria Island, Lagos",
    description: "",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    stats: "250 Guests · Bespoke Styling",
  });

  // Google Reviews & Reputation
  const [googleReviewsLink, setGoogleReviewsLink] = useState(
    initialMockProfile.googleReviewsLink || "https://business.google.com/elan-events"
  );
  const [isSyncingReviews, setIsSyncingReviews] = useState(false);

  // Social Channels
  const [channels, setChannels] = useState<SocialChannel[]>(
    initialMockProfile.socialChannels || []
  );

  // Operating details
  const [hours, setHours] = useState(initialMockProfile.operatingHours || "Mon–Fri");
  const [timeFrom, setTimeFrom] = useState(initialMockProfile.timeFrom || "09:00 AM");
  const [timeTo, setTimeTo] = useState(initialMockProfile.timeTo || "06:00 PM");
  const [byAppointmentOnly, setByAppointmentOnly] = useState(
    initialMockProfile.byAppointmentOnly ?? true
  );
  const [whatsAppNumber, setWhatsAppNumber] = useState(
    initialMockProfile.whatsAppNumber || "+234 800 ELAN VIP"
  );
  const [emailAddress, setEmailAddress] = useState(
    initialMockProfile.emailAddress || "hello@elanevents.com"
  );
  const [physicalAddress, setPhysicalAddress] = useState(
    initialMockProfile.physicalAddress || "Victoria Island, Lagos, Nigeria"
  );

  // Business Logo
  const [logoUrl, setLogoUrl] = useState<string>(
    initialMockProfile.logoUrl ||
      "https://cdn.accessa.ng/test/accessa/louis-dike-ayskyj/images/c95e52aa48bf676ed0d53f36bb957b81.png"
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingProjectImage, setIsUploadingProjectImage] = useState(false);

  // Appearance
  const [colors, setColors] = useState<ColorScheme>(
    initialMockProfile.colors || {
      primary: "#000000",
      secondary: "#0058BE",
      button: "#000000",
      text: "#191C1D",
    }
  );
  const [radius, setRadius] = useState<ButtonRadiusType>(
    initialMockProfile.buttonRadius || "Subtle"
  );

  // Gallery Drag & Drop Reordering State
  const [showManageGalleryModal, setShowManageGalleryModal] = useState(false);
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [dragOverProjectIndex, setDragOverProjectIndex] = useState<number | null>(null);

  // Validation & saving state
  const [slugStatus, setSlugStatus] = useState<"checking" | "available" | "taken" | "idle">(
    "available"
  );
  const [saving, setSaving] = useState(false);

  // Load freshest profile on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim");
      if (claim) {
        setSlug(claim);
        setName(
          `${claim
            .split("-")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")} Atelier`
        );
      }
    }

    getBusinessProfile().then(data => {
      setName(data.businessName);
      setSlug(data.slug);
      setTagline(data.tagline || "");
      setLocation(data.location || "");
      setWebsite(data.website || "");
      if (data.email) setEmail(data.email);
      if (data.currency) setCurrency(data.currency);
      if (data.description) setAbout(data.description);
      if (data.logoUrl) setLogoUrl(data.logoUrl);
      if (data.services) {
        setServices(data.services);
      }
      if (data.portfolio) setPortfolio(data.portfolio);
      if (data.socialChannels) setChannels(data.socialChannels);
      if (data.googleReviewsLink) setGoogleReviewsLink(data.googleReviewsLink);
      if (data.operatingHours) setHours(data.operatingHours);
      if (data.timeFrom) setTimeFrom(data.timeFrom);
      if (data.timeTo) setTimeTo(data.timeTo);
      if (data.byAppointmentOnly !== undefined) {
        setByAppointmentOnly(data.byAppointmentOnly);
      }
      if (data.whatsAppNumber) setWhatsAppNumber(data.whatsAppNumber);
      if (data.emailAddress) setEmailAddress(data.emailAddress);
      if (data.physicalAddress) setPhysicalAddress(data.physicalAddress);
      if (data.colors) setColors(data.colors);
      if (data.buttonRadius) setRadius(data.buttonRadius);
    });
  }, []);

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

  // Handlers
  const addService = () => {
    if (!newServiceInput.trim()) return;
    const newSvc: ServiceItem = {
      id: `svc-${Date.now()}`,
      name: newServiceInput.trim(),
      category: newServiceCategory || "Bespoke",
      description: newServiceDesc.trim(),
    };
    setServices(prev => [...prev, newSvc]);
    setNewServiceInput("");
    setNewServiceDesc("");
    setShowAddService(false);
    notify(`Added service "${newSvc.name}"`);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    notify("Service removed");
  };

  const updateService = (id: string, patch: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.map(c => (c.id === id ? { ...c, connected: !c.connected } : c)));
    notify("Channel status toggled");
  };

  const updateChannelHandle = (id: string, handle: string) => {
    setChannels(prev => prev.map(c => (c.id === id ? { ...c, handle } : c)));
  };

  const removeProject = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
    notify("Project removed from gallery");
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    const proj: PortfolioProject = {
      id: `p-${Date.now()}`,
      title: newProject.title || "Untitled Project",
      category: newProject.category || "Luxury Event",
      location: newProject.location || "Lagos, Nigeria",
      description: newProject.description || "",
      image:
        newProject.image ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      stats: newProject.stats || "Bespoke Production",
    };
    setPortfolio(prev => [proj, ...prev]);
    setShowAddProjectModal(false);
    setNewProject({
      title: "",
      category: "Luxury Wedding",
      location: "Victoria Island, Lagos",
      description: "",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      stats: "250 Guests · Bespoke Styling",
    });
    notify(`Added project "${proj.title}" to gallery`);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const res = await uploadBusinessLogo(file);
      if (res.url) {
        setLogoUrl(res.url);
        notify("Business logo uploaded! CDN URL generated.");
      }
    } catch {
      notify("Error uploading logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingProjectImage(true);
    try {
      const res = await uploadPortfolioImage(file);
      if (res.url) {
        setNewProject(prev => ({ ...prev, image: res.url }));
        notify("Project image uploaded! URL generated.");
      }
    } catch {
      notify("Error uploading project photo");
    } finally {
      setIsUploadingProjectImage(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedProjectIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverProjectIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedProjectIndex === null || dragOverProjectIndex === null) {
      setDraggedProjectIndex(null);
      setDragOverProjectIndex(null);
      return;
    }
    if (draggedProjectIndex !== dragOverProjectIndex) {
      const updated = [...portfolio];
      const [movedItem] = updated.splice(draggedProjectIndex, 1);
      updated.splice(dragOverProjectIndex, 0, movedItem);
      setPortfolio(updated);
      notify("Gallery arrangement updated");
    }
    setDraggedProjectIndex(null);
    setDragOverProjectIndex(null);
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= portfolio.length) return;
    const updated = [...portfolio];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPortfolio(updated);
    notify(`Moved "${temp.title}" ${direction}`);
  };

  const handleSyncReviews = async () => {
    setIsSyncingReviews(true);
    setTimeout(() => {
      setIsSyncingReviews(false);
      notify("Google reviews synced! 48 authenticated 5-star reviews active.");
    }, 800);
  };

  const saveAll = async () => {
    setSaving(true);
    const orderedPortfolio = portfolio.map((proj, idx) => ({
      ...proj,
      order: idx,
      isCover: idx === 0,
    }));
    await updateBusinessProfile({
      businessName: name,
      slug,
      tagline,
      location,
      description: about,
      website,
      email,
      currency,
      logoUrl,
      services,
      portfolio: orderedPortfolio,
      socialChannels: channels,
      googleReviewsLink,
      operatingHours: hours,
      timeFrom,
      timeTo,
      byAppointmentOnly,
      whatsAppNumber,
      emailAddress,
      physicalAddress,
      colors,
      buttonRadius: radius,
    });
    await publishChanges();
    setSaving(false);
    notify("All studio settings & public profile saved successfully");
  };

  const copyProfileLink = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : "https://Shopwus.com"}/${slug || "elan-events"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    notify("Public profile link copied to clipboard!");
  };

  return (
    <section className="content settings-content">
      {/* Top Banner with Authentic Shopwus Typography */}
      <div className="page-title">
        <div>
          <span className="eyebrow">Your studio</span>
          <h1>Settings</h1>
          <p>
            Shape the brand presence your clients and customers see on your live public profile.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={copyProfileLink}
            className="outline-button"
            title="Copy public link"
          >
            <Copy size={14} /> Copy Link
          </button>
          <a
            className="dark-button"
            href={`/${slug || "elan-events"}?from=settings`}
            target="_blank"
            rel="noreferrer"
          >
            <span>View Public Profile</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Modular Section 01: Identity & Brand Logo */}
      <IdentitySection
        name={name}
        setName={setName}
        slug={slug}
        setSlug={setSlug}
        slugStatus={slugStatus}
        tagline={tagline}
        setTagline={setTagline}
        location={location}
        setLocation={setLocation}
        website={website}
        setWebsite={setWebsite}
        email={email}
        setEmail={setEmail}
        currency={currency}
        setCurrency={setCurrency}
        about={about}
        setAbout={setAbout}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
        isUploadingLogo={isUploadingLogo}
        handleLogoUpload={handleLogoUpload}
        onToast={notify}
      />

      {/* Modular Section 02: Services & Offerings */}
      <ServicesSection
        services={services}
        editingServiceId={editingServiceId}
        setEditingServiceId={setEditingServiceId}
        updateService={updateService}
        removeService={removeService}
        showAddService={showAddService}
        setShowAddService={setShowAddService}
        newServiceInput={newServiceInput}
        setNewServiceInput={setNewServiceInput}
        newServiceCategory={newServiceCategory}
        setNewServiceCategory={setNewServiceCategory}
        newServiceDesc={newServiceDesc}
        setNewServiceDesc={setNewServiceDesc}
        addService={addService}
      />

      {/* Modular Section 03: Portfolio Gallery & Modals */}
      <PortfolioSection
        portfolio={portfolio}
        showAddProjectModal={showAddProjectModal}
        setShowAddProjectModal={setShowAddProjectModal}
        showManageGalleryModal={showManageGalleryModal}
        setShowManageGalleryModal={setShowManageGalleryModal}
        newProject={newProject}
        setNewProject={setNewProject}
        isUploadingProjectImage={isUploadingProjectImage}
        handleProjectImageUpload={handleProjectImageUpload}
        handleAddProject={handleAddProject}
        removeProject={removeProject}
        moveProject={moveProject}
        draggedProjectIndex={draggedProjectIndex}
        dragOverProjectIndex={dragOverProjectIndex}
        handleDragStart={handleDragStart}
        handleDragEnter={handleDragEnter}
        handleDragEnd={handleDragEnd}
        onToast={notify}
      />

      {/* Modular Section 04 & 05: Reputation & Social Channels */}
      <ChannelsSection
        googleReviewsLink={googleReviewsLink}
        setGoogleReviewsLink={setGoogleReviewsLink}
        isSyncingReviews={isSyncingReviews}
        handleSyncReviews={handleSyncReviews}
        channels={channels}
        updateChannelHandle={updateChannelHandle}
        toggleChannel={toggleChannel}
        onToast={notify}
      />

      {/* Modular Section 06: Contact & Operating Hours */}
      <ContactSection
        hours={hours}
        setHours={setHours}
        timeFrom={timeFrom}
        setTimeFrom={setTimeFrom}
        timeTo={timeTo}
        setTimeTo={setTimeTo}
        byAppointmentOnly={byAppointmentOnly}
        setByAppointmentOnly={setByAppointmentOnly}
        whatsAppNumber={whatsAppNumber}
        setWhatsAppNumber={setWhatsAppNumber}
        emailAddress={emailAddress}
        setEmailAddress={setEmailAddress}
        physicalAddress={physicalAddress}
        setPhysicalAddress={setPhysicalAddress}
      />

      {/* Modular Section 07: Appearance & Branding */}
      <AppearanceSection
        colors={colors}
        setColors={setColors}
        radius={radius}
        setRadius={setRadius}
      />

      {/* Action Footer */}
      <div className="settings-footer">
        <button
          type="button"
          className="outline-button"
          onClick={() => notify("Section builder coming soon")}
        >
          <Plus size={14} /> Add new section
        </button>
        <button
          type="button"
          className="dark-button bg-[#b84c24] border-[#b84c24] hover:bg-[#a1401c]"
          disabled={saving}
          onClick={saveAll}
        >
          {saving ? "Saving…" : "Save all changes"} <Save size={15} />
        </button>
      </div>
    </section>
  );
}

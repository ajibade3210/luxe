"use client";

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
} from "@/types";

export function useSettingsForm({ notify }: { notify: (msg: string) => void }) {
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

  // Section Visibility Toggles
  const [showServices, setShowServices] = useState<boolean>(
    initialMockProfile.showServices ?? true
  );
  const [showPortfolio, setShowPortfolio] = useState<boolean>(
    initialMockProfile.showPortfolio ?? true
  );
  const [showReviews, setShowReviews] = useState<boolean>(initialMockProfile.showReviews ?? true);

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
    initialMockProfile.byAppointmentOnly ?? false
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
      pageBackground: "#FAF8F5",
      cardBackground: "#FAF6F0",
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
      if (data.showServices !== undefined) setShowServices(data.showServices);
      if (data.showPortfolio !== undefined) setShowPortfolio(data.showPortfolio);
      if (data.showReviews !== undefined) setShowReviews(data.showReviews);
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
      setLogoUrl(res.url);
      notify("Logo uploaded successfully");
    } catch {
      notify("Failed to upload logo");
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
      setNewProject(prev => ({ ...prev, image: res.url }));
      notify("Project image uploaded successfully");
    } catch {
      notify("Failed to upload project image");
    } finally {
      setIsUploadingProjectImage(false);
    }
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    if (direction === "up") {
      if (index <= 0) return;
      setPortfolio(prev => {
        const copy = [...prev];
        const temp = copy[index - 1];
        copy[index - 1] = copy[index];
        copy[index] = temp;
        return copy;
      });
    } else {
      if (index >= portfolio.length - 1) return;
      setPortfolio(prev => {
        const copy = [...prev];
        const temp = copy[index + 1];
        copy[index + 1] = copy[index];
        copy[index] = temp;
        return copy;
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedProjectIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedProjectIndex !== null && draggedProjectIndex !== index) {
      setDragOverProjectIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (
      draggedProjectIndex !== null &&
      dragOverProjectIndex !== null &&
      draggedProjectIndex !== dragOverProjectIndex
    ) {
      setPortfolio(prev => {
        const copy = [...prev];
        const [draggedItem] = copy.splice(draggedProjectIndex, 1);
        copy.splice(dragOverProjectIndex, 0, draggedItem);
        return copy;
      });
      notify("Gallery project order updated");
    }
    setDraggedProjectIndex(null);
    setDragOverProjectIndex(null);
  };

  const handleSyncReviews = async () => {
    setIsSyncingReviews(true);
    notify("Syncing Google reviews...");
    setTimeout(() => {
      setIsSyncingReviews(false);
      notify("Google reviews synced successfully");
    }, 1200);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBusinessProfile({
        businessName: name,
        slug,
        tagline,
        location,
        website,
        email,
        currency,
        description: about,
        logoUrl,
        services,
        portfolio,
        socialChannels: channels,
        googleReviewsLink,
        operatingHours: hours,
        timeFrom,
        timeTo,
        byAppointmentOnly,
        whatsAppNumber,
        emailAddress,
        physicalAddress,
        showServices,
        showPortfolio,
        showReviews,
        colors,
        buttonRadius: radius,
      });
      notify("Changes saved successfully");
    } catch {
      notify("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      await handleSave();
      await publishChanges();
      notify("Studio changes published live!");
    } catch {
      notify("Failed to publish changes");
    } finally {
      setSaving(false);
    }
  };

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
    showServices,
    setShowServices,
    showPortfolio,
    setShowPortfolio,
    showReviews,
    setShowReviews,
    services,
    showAddService,
    setShowAddService,
    newServiceInput,
    setNewServiceInput,
    newServiceCategory,
    setNewServiceCategory,
    newServiceDesc,
    setNewServiceDesc,
    editingServiceId,
    setEditingServiceId,
    portfolio,
    showAddProjectModal,
    setShowAddProjectModal,
    newProject,
    setNewProject,
    googleReviewsLink,
    setGoogleReviewsLink,
    isSyncingReviews,
    channels,
    hours,
    setHours,
    timeFrom,
    setTimeFrom,
    timeTo,
    setTimeTo,
    byAppointmentOnly,
    setByAppointmentOnly,
    whatsAppNumber,
    setWhatsAppNumber,
    emailAddress,
    setEmailAddress,
    physicalAddress,
    setPhysicalAddress,
    logoUrl,
    setLogoUrl,
    isUploadingLogo,
    isUploadingProjectImage,
    colors,
    setColors,
    radius,
    setRadius,
    showManageGalleryModal,
    setShowManageGalleryModal,
    draggedProjectIndex,
    dragOverProjectIndex,
    slugStatus,
    saving,
    addService,
    removeService,
    updateService,
    toggleChannel,
    updateChannelHandle,
    removeProject,
    handleAddProject,
    handleLogoUpload,
    handleProjectImageUpload,
    moveProject,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleSyncReviews,
    handleSave,
    handlePublish,
  };
}

"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_BUSINESS_TYPE,
  DEFAULT_FOOTER_DESCRIPTION,
  DEFAULT_FOOTER_EYEBROW,
  DEFAULT_FOOTER_TITLE,
  DEFAULT_NEW_PROJECT,
  DEFAULT_PORTFOLIO_CATEGORIES,
  DEFAULT_PORTFOLIO_IMAGE,
  MAX_CATEGORY_NAME_LENGTH,
  MAX_PORTFOLIO_CATEGORIES,
  MAX_PORTFOLIO_PROJECTS,
  MAX_SERVICE_NAME_LENGTH,
  MAX_SERVICES,
} from "@/constants";
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
  BusinessType,
  ButtonRadiusType,
  ColorScheme,
  CurrencyCode,
  PortfolioProject,
  ServiceItem,
  SocialChannel,
  UseSettingsFormOptions,
} from "@/types";

export function useSettingsForm({ notify }: UseSettingsFormOptions) {
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
  const [businessType, setBusinessType] = useState<BusinessType>(
    initialMockProfile.businessType || DEFAULT_BUSINESS_TYPE
  );

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
  const [categories, setCategories] = useState<string[]>(
    initialMockProfile.portfolioCategories || [...DEFAULT_PORTFOLIO_CATEGORIES]
  );
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<PortfolioProject>>(DEFAULT_NEW_PROJECT);

  // Google Reviews & Reputation
  const [googleReviewsLink, setGoogleReviewsLink] = useState(
    initialMockProfile.googleReviewsLink || "https://business.google.com/atelier-forma"
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

  // Footer CTA Banner
  const [footerEyebrow, setFooterEyebrow] = useState(
    initialMockProfile.footerEyebrow || DEFAULT_FOOTER_EYEBROW
  );
  const [footerTitle, setFooterTitle] = useState(
    initialMockProfile.footerTitle || DEFAULT_FOOTER_TITLE
  );
  const [footerDescription, setFooterDescription] = useState(
    initialMockProfile.footerDescription || DEFAULT_FOOTER_DESCRIPTION
  );
  const [showFooterCta, setShowFooterCta] = useState(initialMockProfile.showFooterCta ?? true);

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
      if (data.portfolioCategories && data.portfolioCategories.length > 0) {
        setCategories(data.portfolioCategories);
      }
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
      if (data.footerEyebrow !== undefined) setFooterEyebrow(data.footerEyebrow);
      if (data.footerTitle !== undefined) setFooterTitle(data.footerTitle);
      if (data.footerDescription !== undefined) setFooterDescription(data.footerDescription);
      if (data.showFooterCta !== undefined) setShowFooterCta(data.showFooterCta);
      if (data.colors) setColors(data.colors);
      if (data.buttonRadius) setRadius(data.buttonRadius);
      if (data.businessType) setBusinessType(data.businessType);
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
    const trimmedName = newServiceInput.trim();
    if (!trimmedName) return;
    if (trimmedName.length > MAX_SERVICE_NAME_LENGTH) {
      notify(`Service name cannot exceed ${MAX_SERVICE_NAME_LENGTH} characters`);
      return;
    }
    if (services.length >= MAX_SERVICES) {
      notify(`Maximum limit of ${MAX_SERVICES} services reached`);
      return;
    }
    if (services.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
      notify(`Service "${trimmedName}" already exists`);
      return;
    }
    const newSvc: ServiceItem = {
      id: `svc-${Date.now()}`,
      name: trimmedName,
      category: newServiceCategory.trim() || "Bespoke",
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

  const addPortfolioCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CATEGORY_NAME_LENGTH) {
      notify(`Category name cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters`);
      return;
    }
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      notify(`Category "${trimmed}" already exists`);
      return;
    }
    if (categories.length >= MAX_PORTFOLIO_CATEGORIES) {
      notify(`Maximum limit of ${MAX_PORTFOLIO_CATEGORIES} categories reached`);
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    setNewProject(prev => ({ ...prev, category: trimmed }));
    notify(`Added category "${trimmed}"`);
  };

  const removePortfolioCategory = (cat: string) => {
    if (categories.length <= 1) {
      notify("You must keep at least one category");
      return;
    }
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    if (newProject.category === cat) {
      setNewProject(prev => ({ ...prev, category: updated[0] || "General" }));
    }
    notify(`Removed category "${cat}"`);
  };

  const [isUploadingGalleryImages, setIsUploadingGalleryImages] = useState(false);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    if (portfolio.length >= MAX_PORTFOLIO_PROJECTS) {
      notify(`Maximum limit of ${MAX_PORTFOLIO_PROJECTS} portfolio projects reached`);
      return;
    }
    const coverImage = newProject.image || newProject.gallery?.[0] || DEFAULT_PORTFOLIO_IMAGE;

    const galleryImages =
      newProject.gallery && newProject.gallery.length > 0 ? newProject.gallery : [coverImage];

    const proj: PortfolioProject = {
      id: `p-${Date.now()}`,
      title: newProject.title || "Untitled Project",
      category: newProject.category || "Brand Identity",
      location: newProject.location || "Lagos & London",
      description: newProject.description || "",
      image: coverImage,
      gallery: galleryImages,
      client: newProject.client || undefined,
      year: newProject.year || "2026",
    };
    setPortfolio(prev => [proj, ...prev]);
    setShowAddProjectModal(false);
    setNewProject(DEFAULT_NEW_PROJECT);
    notify(`Added project "${proj.title}" with ${galleryImages.length} images to gallery`);
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
      setNewProject(prev => {
        const updatedGallery =
          prev.gallery && prev.gallery.length > 0 ? [res.url, ...prev.gallery.slice(1)] : [res.url];
        return { ...prev, image: res.url, gallery: updatedGallery };
      });
      notify("Project cover image uploaded successfully");
    } catch {
      notify("Failed to upload project image");
    } finally {
      setIsUploadingProjectImage(false);
    }
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGalleryImages(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadPortfolioImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(r => r.url);
      setNewProject(prev => ({
        ...prev,
        gallery: [...(prev.gallery || (prev.image ? [prev.image] : [])), ...newUrls],
      }));
      notify(`Uploaded ${results.length} gallery ${results.length === 1 ? "image" : "images"}`);
    } catch {
      notify("Failed to upload gallery images");
    } finally {
      setIsUploadingGalleryImages(false);
    }
  };

  const removeGalleryImageFromNewProject = (index: number) => {
    setNewProject(prev => {
      const currentGallery = prev.gallery || [];
      const removedUrl = currentGallery[index];
      const updated = currentGallery.filter((_, i) => i !== index);
      const isRemovingCover = prev.image && removedUrl === prev.image;
      return {
        ...prev,
        image: isRemovingCover ? updated[0] || "" : prev.image,
        gallery: updated,
      };
    });
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
        portfolioCategories: categories,
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
        footerEyebrow,
        footerTitle,
        footerDescription,
        showFooterCta,
        businessType,
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
    businessType,
    setBusinessType,
    showServices,
    setShowServices,
    showPortfolio,
    setShowPortfolio,
    showReviews,
    setShowReviews,
    footerEyebrow,
    setFooterEyebrow,
    footerTitle,
    setFooterTitle,
    footerDescription,
    setFooterDescription,
    showFooterCta,
    setShowFooterCta,
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
    categories,
    addPortfolioCategory,
    removePortfolioCategory,
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
    isUploadingGalleryImages,
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
    handleGalleryImagesUpload,
    removeGalleryImageFromNewProject,
    moveProject,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleSyncReviews,
    handleSave,
    handlePublish,
  };
}

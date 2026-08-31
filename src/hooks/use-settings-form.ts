"use client";

import { useEffect, useState } from "react";
import { getBusinessProfile, publishChanges, updateBusinessProfile } from "@/lib/api";
import { logger } from "@/lib/logger";
import type { ServiceItem, UseSettingsFormOptions } from "@/types";
import {
  isValidPhone,
  isValidUrl,
  normalizeButtonRadius,
  normalizeWebsiteUrl,
  sanitizeHandle,
} from "@/utils";
import { useAppearanceSettings } from "./settings/use-appearance-settings";
import { useBrandingSettings } from "./settings/use-branding-settings";
import { useContactSettings } from "./settings/use-contact-settings";
import { usePortfolioSettings } from "./settings/use-portfolio-settings";
import { useServicesSettings } from "./settings/use-services-settings";

export function useSettingsForm({ notify }: UseSettingsFormOptions) {
  const branding = useBrandingSettings();
  const services = useServicesSettings({ notify });
  const portfolio = usePortfolioSettings({ notify });
  const appearance = useAppearanceSettings();
  const contact = useContactSettings({ notify });

  const [saving, setSaving] = useState(false);

  // Synchronize website input with social channels website section
  const handleWebsiteChange = (newWebsite: string) => {
    branding.setWebsite(newWebsite);
    const cleanHandle = sanitizeHandle(newWebsite, "https://");
    contact.setChannels(prev => {
      const idx = prev.findIndex(c => c.type === "website");
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          handle: cleanHandle,
          url: normalizeWebsiteUrl(newWebsite),
          connected: Boolean(cleanHandle),
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: "ch-website",
          type: "website",
          label: "Website",
          handle: cleanHandle,
          url: normalizeWebsiteUrl(newWebsite),
          connected: Boolean(cleanHandle),
        },
      ];
    });
  };

  const handleUpdateChannelHandle = (id: string, handle: string) => {
    contact.updateChannelHandle(id, handle);
    const targetChannel = contact.channels.find(c => c.id === id);
    if (targetChannel?.type === "website") {
      const cleanHandle = sanitizeHandle(handle, "https://");
      branding.setWebsite(cleanHandle ? normalizeWebsiteUrl(cleanHandle) : "");
    }
  };

  const handleToggleChannel = (id: string) => {
    contact.toggleChannel(id);
    const targetChannel = contact.channels.find(c => c.id === id);
    if (targetChannel?.type === "website") {
      if (!targetChannel.connected && branding.website) {
        const cleanHandle = sanitizeHandle(branding.website, "https://");
        contact.setChannels(prev =>
          prev.map(c =>
            c.id === id
              ? {
                  ...c,
                  handle: cleanHandle,
                  url: normalizeWebsiteUrl(branding.website),
                  connected: true,
                }
              : c
          )
        );
      }
    }
  };

  // Load freshest profile on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      getBusinessProfile()
        .then(profile => {
          if (!profile) return;
          branding.setName(profile.businessName || "");
          branding.setSlug(profile.slug || "");
          branding.setTagline(profile.tagline || "");
          branding.setLocation(profile.location || "");
          const rawWebsite = profile.website || "";
          branding.setWebsite(rawWebsite);
          branding.setEmail(profile.email || "");
          branding.setCurrency(profile.currency || "NGN");
          branding.setAbout(profile.description || "");
          branding.setBusinessType(profile.businessType || "sales");
          if (profile.logoUrl) portfolio.setLogoUrl(profile.logoUrl);

          if (Array.isArray(profile.services)) services.setServices(profile.services);
          if (Array.isArray(profile.portfolio)) portfolio.setPortfolio(profile.portfolio);
          if (Array.isArray(profile.portfolioCategories)) {
            portfolio.setCategories(profile.portfolioCategories);
          }

          const initialChannels = Array.isArray(profile.socialChannels)
            ? [...profile.socialChannels]
            : [];
          if (rawWebsite) {
            const cleanHandle = sanitizeHandle(rawWebsite, "https://");
            const wIdx = initialChannels.findIndex(c => c.type === "website");
            if (wIdx >= 0) {
              initialChannels[wIdx] = {
                ...initialChannels[wIdx],
                handle: cleanHandle,
                url: normalizeWebsiteUrl(rawWebsite),
                connected: true,
              };
            } else {
              initialChannels.push({
                id: "ch-website",
                type: "website",
                label: "Website",
                handle: cleanHandle,
                url: normalizeWebsiteUrl(rawWebsite),
                connected: true,
              });
            }
          }
          contact.setChannels(initialChannels);

          if (profile.operatingHours) contact.setHours(profile.operatingHours);
          if (profile.timeFrom) contact.setTimeFrom(profile.timeFrom);
          if (profile.timeTo) contact.setTimeTo(profile.timeTo);
          if (profile.byAppointmentOnly !== undefined) {
            contact.setByAppointmentOnly(profile.byAppointmentOnly);
          }
          if (profile.whatsAppNumber) contact.setWhatsAppNumber(profile.whatsAppNumber);
          if (profile.emailAddress) contact.setEmailAddress(profile.emailAddress);
          if (profile.physicalAddress) contact.setPhysicalAddress(profile.physicalAddress);
          if (profile.googleReviewsLink) {
            contact.setGoogleReviewsLink(profile.googleReviewsLink);
          }
          if (profile.showServices !== undefined) contact.setShowServices(profile.showServices);
          if (profile.showPortfolio !== undefined) contact.setShowPortfolio(profile.showPortfolio);
          if (profile.showReviews !== undefined) contact.setShowReviews(profile.showReviews);
          if (profile.footerEyebrow) contact.setFooterEyebrow(profile.footerEyebrow);
          if (profile.footerTitle) contact.setFooterTitle(profile.footerTitle);
          if (profile.footerDescription) {
            contact.setFooterDescription(profile.footerDescription);
          }
          if (profile.showFooterCta !== undefined) {
            contact.setShowFooterCta(profile.showFooterCta);
          }

          if (profile.colors) appearance.setColors(profile.colors);
          if (profile.buttonRadius) {
            appearance.setRadius(normalizeButtonRadius(profile.buttonRadius));
          }
        })
        .catch(err => {
          logger.warn("Failed to load business profile on mount", err);
        });
    }
  }, []);

  const handleSave = async (options?: { silent?: boolean }): Promise<boolean> => {
    if (branding.website.trim() && !isValidUrl(branding.website)) {
      notify("Invalid website URL");
      return false;
    }

    // Validate WhatsApp number if configured
    const waChannel = contact.channels.find(c => c.type?.toLowerCase() === "whatsapp");
    const waHandle = waChannel?.handle?.trim();
    if (waHandle && !isValidPhone(waHandle)) {
      notify("Invalid WhatsApp phone number");
      return false;
    }

    const webChannel = contact.channels.find(c => c.type?.toLowerCase() === "website");
    const webHandle = webChannel?.handle?.trim();
    if (webHandle && !isValidUrl(webHandle)) {
      notify("Invalid website URL");
      return false;
    }

    setSaving(true);
    try {
      const normalizedWebsite = branding.website.trim()
        ? normalizeWebsiteUrl(branding.website)
        : "";

      // Ensure socialChannels has the latest website channel
      let updatedChannels = contact.channels.map(c => {
        if (c.type?.toLowerCase() === "website") {
          const cleanHandle = sanitizeHandle(normalizedWebsite, "https://");
          return {
            ...c,
            handle: cleanHandle,
            url: normalizedWebsite,
            connected: Boolean(cleanHandle),
          };
        }
        return c;
      });

      if (normalizedWebsite && !updatedChannels.some(c => c.type?.toLowerCase() === "website")) {
        const cleanHandle = sanitizeHandle(normalizedWebsite, "https://");
        updatedChannels = [
          ...updatedChannels,
          {
            id: "ch-website",
            type: "website",
            label: "Website",
            handle: cleanHandle,
            url: normalizedWebsite,
            connected: Boolean(cleanHandle),
          },
        ];
      }

      contact.setChannels(updatedChannels);

      const cleanedServices: ServiceItem[] = (services.services || [])
        .map(s => ({
          id: s.id || `svc-${Date.now()}`,
          name: (s.name || "").trim(),
          category: (s.category || "").trim() || "General",
          description: (s.description || "").trim(),
          price: typeof s.price === "number" && !Number.isNaN(s.price) ? s.price : undefined,
          minPrice:
            typeof s.minPrice === "number" && !Number.isNaN(s.minPrice) ? s.minPrice : undefined,
          maxPrice:
            typeof s.maxPrice === "number" && !Number.isNaN(s.maxPrice) ? s.maxPrice : undefined,
          priceType: s.priceType,
          isFeatured: Boolean(s.isFeatured),
        }))
        .filter(s => s.name.length > 0);

      const updated = await updateBusinessProfile({
        businessName: branding.name,
        slug: branding.slug,
        tagline: branding.tagline,
        location: branding.location,
        website: normalizedWebsite,
        email: branding.email,
        currency: branding.currency,
        description: branding.about,
        logoUrl: portfolio.logoUrl,
        services: cleanedServices,
        portfolio: portfolio.portfolio,
        portfolioCategories: portfolio.categories,
        socialChannels: updatedChannels,
        googleReviewsLink: contact.googleReviewsLink,
        operatingHours: contact.hours,
        timeFrom: contact.timeFrom,
        timeTo: contact.timeTo,
        byAppointmentOnly: contact.byAppointmentOnly,
        whatsAppNumber: contact.whatsAppNumber,
        emailAddress: contact.emailAddress,
        physicalAddress: contact.physicalAddress,
        showServices: contact.showServices,
        showPortfolio: contact.showPortfolio,
        showReviews: contact.showReviews,
        footerEyebrow: contact.footerEyebrow,
        footerTitle: contact.footerTitle,
        footerDescription: contact.footerDescription,
        showFooterCta: contact.showFooterCta,
        businessType: branding.businessType,
        colors: appearance.colors,
        buttonRadius: appearance.radius,
      });

      if (updated) {
        if (Array.isArray(updated.services)) {
          services.setServices(updated.services);
        }
        if (Array.isArray(updated.portfolio)) {
          portfolio.setPortfolio(updated.portfolio);
        }
        if (Array.isArray(updated.portfolioCategories)) {
          portfolio.setCategories(updated.portfolioCategories);
        }
      }

      if (!options?.silent) {
        notify("Changes saved successfully");
      }
      return true;
    } catch (err: unknown) {
      logger.error("Failed to save studio changes", err);
      const errMsg =
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
          ? (err as { message: string }).message
          : "Failed to save changes";
      notify(errMsg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const success = await handleSave({ silent: true });
    if (!success) return;

    setSaving(true);
    try {
      await publishChanges();
      notify("Studio changes published live!");
    } catch (err) {
      logger.error("Failed to publish studio changes", err);
      notify("Failed to publish changes");
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    await handleSave();
  };

  return {
    // Branding
    name: branding.name,
    setName: branding.setName,
    slug: branding.slug,
    setSlug: branding.setSlug,
    tagline: branding.tagline,
    setTagline: branding.setTagline,
    location: branding.location,
    setLocation: branding.setLocation,
    website: branding.website,
    setWebsite: handleWebsiteChange,
    email: branding.email,
    setEmail: branding.setEmail,
    currency: branding.currency,
    setCurrency: branding.setCurrency,
    about: branding.about,
    setAbout: branding.setAbout,
    businessType: branding.businessType,
    setBusinessType: branding.setBusinessType,
    slugStatus: branding.slugStatus,

    // Services
    services: services.services,
    showAddService: services.showAddService,
    setShowAddService: services.setShowAddService,
    newServiceInput: services.newServiceInput,
    setNewServiceInput: services.setNewServiceInput,
    newServiceCategory: services.newServiceCategory,
    setNewServiceCategory: services.setNewServiceCategory,
    newServiceDesc: services.newServiceDesc,
    setNewServiceDesc: services.setNewServiceDesc,
    newServicePriceType: services.newServicePriceType,
    setNewServicePriceType: services.setNewServicePriceType,
    newServicePrice: services.newServicePrice,
    setNewServicePrice: services.setNewServicePrice,
    newServiceMinPrice: services.newServiceMinPrice,
    setNewServiceMinPrice: services.setNewServiceMinPrice,
    newServiceMaxPrice: services.newServiceMaxPrice,
    setNewServiceMaxPrice: services.setNewServiceMaxPrice,
    editingServiceId: services.editingServiceId,
    setEditingServiceId: services.setEditingServiceId,
    addService: services.addService,
    removeService: services.removeService,
    updateService: services.updateService,

    // Portfolio
    portfolio: portfolio.portfolio,
    categories: portfolio.categories,
    addPortfolioCategory: portfolio.addPortfolioCategory,
    removePortfolioCategory: portfolio.removePortfolioCategory,
    showAddProjectModal: portfolio.showAddProjectModal,
    setShowAddProjectModal: portfolio.setShowAddProjectModal,
    newProject: portfolio.newProject,
    setNewProject: portfolio.setNewProject,
    logoUrl: portfolio.logoUrl,
    setLogoUrl: portfolio.setLogoUrl,
    isUploadingLogo: portfolio.isUploadingLogo,
    isUploadingProjectImage: portfolio.isUploadingProjectImage,
    isUploadingGalleryImages: portfolio.isUploadingGalleryImages,
    showManageGalleryModal: portfolio.showManageGalleryModal,
    setShowManageGalleryModal: portfolio.setShowManageGalleryModal,
    draggedProjectIndex: portfolio.draggedProjectIndex,
    dragOverProjectIndex: portfolio.dragOverProjectIndex,
    removeProject: portfolio.removeProject,
    handleAddProject: portfolio.handleAddProject,
    handleLogoUpload: portfolio.handleLogoUpload,
    handleProjectImageUpload: portfolio.handleProjectImageUpload,
    handleGalleryImagesUpload: portfolio.handleGalleryImagesUpload,
    removeGalleryImageFromNewProject: portfolio.removeGalleryImageFromNewProject,
    moveProject: portfolio.moveProject,
    handleDragStart: portfolio.handleDragStart,
    handleDragEnter: portfolio.handleDragEnter,
    handleDragEnd: portfolio.handleDragEnd,

    // Contact & Social & Toggles
    hours: contact.hours,
    setHours: contact.setHours,
    timeFrom: contact.timeFrom,
    setTimeFrom: contact.setTimeFrom,
    timeTo: contact.timeTo,
    setTimeTo: contact.setTimeTo,
    byAppointmentOnly: contact.byAppointmentOnly,
    setByAppointmentOnly: contact.setByAppointmentOnly,
    whatsAppNumber: contact.whatsAppNumber,
    setWhatsAppNumber: contact.setWhatsAppNumber,
    emailAddress: contact.emailAddress,
    setEmailAddress: contact.setEmailAddress,
    physicalAddress: contact.physicalAddress,
    setPhysicalAddress: contact.setPhysicalAddress,
    channels: contact.channels,
    googleReviewsLink: contact.googleReviewsLink,
    setGoogleReviewsLink: contact.setGoogleReviewsLink,
    isSyncingReviews: contact.isSyncingReviews,
    showServices: contact.showServices,
    setShowServices: contact.setShowServices,
    showPortfolio: contact.showPortfolio,
    setShowPortfolio: contact.setShowPortfolio,
    showReviews: contact.showReviews,
    setShowReviews: contact.setShowReviews,
    footerEyebrow: contact.footerEyebrow,
    setFooterEyebrow: contact.setFooterEyebrow,
    footerTitle: contact.footerTitle,
    setFooterTitle: contact.setFooterTitle,
    footerDescription: contact.footerDescription,
    setFooterDescription: contact.setFooterDescription,
    showFooterCta: contact.showFooterCta,
    setShowFooterCta: contact.setShowFooterCta,
    toggleChannel: handleToggleChannel,
    updateChannelHandle: handleUpdateChannelHandle,
    handleSyncReviews: contact.handleSyncReviews,

    // Appearance
    colors: appearance.colors,
    setColors: appearance.setColors,
    radius: appearance.radius,
    setRadius: appearance.setRadius,

    // Actions & State
    saving,
    handleSave: onSave,
    handlePublish,
  };
}

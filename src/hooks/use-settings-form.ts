"use client";

import { useEffect, useState } from "react";
import { getBusinessProfile, publishChanges, updateBusinessProfile } from "@/lib/api";
import type { UseSettingsFormOptions } from "@/types";
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

  // Load freshest profile on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim");
      if (claim) {
        branding.setSlug(claim);
        branding.setName(
          `${claim
            .split("-")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")} Atelier`
        );
      }
    }

    getBusinessProfile().then(data => {
      branding.setName(data.businessName);
      branding.setSlug(data.slug);
      branding.setTagline(data.tagline || "");
      branding.setLocation(data.location || "");
      branding.setWebsite(data.website || "");
      if (data.email) branding.setEmail(data.email);
      if (data.currency) branding.setCurrency(data.currency);
      if (data.description) branding.setAbout(data.description);
      if (data.logoUrl) portfolio.setLogoUrl(data.logoUrl);
      if (data.services) services.setServices(data.services);
      if (data.portfolio) portfolio.setPortfolio(data.portfolio);
      if (data.portfolioCategories && data.portfolioCategories.length > 0) {
        portfolio.setCategories(data.portfolioCategories);
      }
      if (data.socialChannels) contact.setChannels(data.socialChannels);
      if (data.googleReviewsLink) contact.setGoogleReviewsLink(data.googleReviewsLink);
      if (data.operatingHours) contact.setHours(data.operatingHours);
      if (data.timeFrom) contact.setTimeFrom(data.timeFrom);
      if (data.timeTo) contact.setTimeTo(data.timeTo);
      if (data.byAppointmentOnly !== undefined) {
        contact.setByAppointmentOnly(data.byAppointmentOnly);
      }
      if (data.whatsAppNumber) contact.setWhatsAppNumber(data.whatsAppNumber);
      if (data.emailAddress) contact.setEmailAddress(data.emailAddress);
      if (data.physicalAddress) contact.setPhysicalAddress(data.physicalAddress);
      if (data.showServices !== undefined) contact.setShowServices(data.showServices);
      if (data.showPortfolio !== undefined) contact.setShowPortfolio(data.showPortfolio);
      if (data.showReviews !== undefined) contact.setShowReviews(data.showReviews);
      if (data.footerEyebrow !== undefined) contact.setFooterEyebrow(data.footerEyebrow);
      if (data.footerTitle !== undefined) contact.setFooterTitle(data.footerTitle);
      if (data.footerDescription !== undefined) {
        contact.setFooterDescription(data.footerDescription);
      }
      if (data.showFooterCta !== undefined) contact.setShowFooterCta(data.showFooterCta);
      if (data.colors) appearance.setColors(data.colors);
      if (data.buttonRadius) appearance.setRadius(data.buttonRadius);
      if (data.businessType) branding.setBusinessType(data.businessType);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBusinessProfile({
        businessName: branding.name,
        slug: branding.slug,
        tagline: branding.tagline,
        location: branding.location,
        website: branding.website,
        email: branding.email,
        currency: branding.currency,
        description: branding.about,
        logoUrl: portfolio.logoUrl,
        services: services.services,
        portfolio: portfolio.portfolio,
        portfolioCategories: portfolio.categories,
        socialChannels: contact.channels,
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
    setWebsite: branding.setWebsite,
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
    toggleChannel: contact.toggleChannel,
    updateChannelHandle: contact.updateChannelHandle,
    handleSyncReviews: contact.handleSyncReviews,

    // Appearance
    colors: appearance.colors,
    setColors: appearance.setColors,
    radius: appearance.radius,
    setRadius: appearance.setRadius,

    // Actions & State
    saving,
    handleSave,
    handlePublish,
  };
}

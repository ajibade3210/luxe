"use client";

import { ExternalLink, Save } from "lucide-react";
import { APP_CONFIG } from "@/constants";
import { useSettingsForm } from "@/hooks/use-settings-form";
import type { EnhancedSettingsPageProps } from "@/types";
import { useAdminToast } from "./admin-layout";
import { AppearanceSection } from "./settings/appearance-section";
import { ChannelsSection } from "./settings/channels-section";
import { ContactSection } from "./settings/contact-section";
import { FooterSection } from "./settings/footer-section";
import { IdentitySection } from "./settings/identity-section";
import { PortfolioSection } from "./settings/portfolio-section";
import { ServicesSection } from "./settings/services-section";

export function EnhancedSettingsPage({ onToast }: EnhancedSettingsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;

  const {
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
    newServicePriceType,
    setNewServicePriceType,
    newServicePrice,
    setNewServicePrice,
    newServiceMinPrice,
    setNewServiceMinPrice,
    newServiceMaxPrice,
    setNewServiceMaxPrice,
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
    logoUrl,
    setLogoUrl,
    bannerUrl,
    setBannerUrl,
    isUploadingLogo,
    isUploadingBanner,
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
    handleBannerUpload,
    handleProjectImageUpload,
    handleGalleryImagesUpload,
    removeGalleryImageFromNewProject,
    moveProject,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleSyncReviews,
    handleSave,
  } = useSettingsForm({ notify });

  return (
    <div className="w-full px-6 py-8 sm:px-8 sm:py-8 lg:px-10 lg:py-10 space-y-10 pb-24">
      {/* Top Header Bar */}
      <div className="pb-6 border-b border-[#e5e7eb]">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111827] tracking-tight">
          Studio Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6b7280] mt-2 leading-relaxed">
          Configure your brand identity, services, portfolio, verified social badges, and visual
          aesthetic.
        </p>
      </div>

      {/* Main Settings Sections Grid */}
      <div className="space-y-10">
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
          businessType={businessType}
          setBusinessType={setBusinessType}
          about={about}
          setAbout={setAbout}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          isUploadingLogo={isUploadingLogo}
          handleLogoUpload={handleLogoUpload}
          bannerUrl={bannerUrl}
          setBannerUrl={setBannerUrl}
          isUploadingBanner={isUploadingBanner}
          handleBannerUpload={handleBannerUpload}
          onToast={notify}
        />

        <ChannelsSection
          googleReviewsLink={googleReviewsLink}
          setGoogleReviewsLink={setGoogleReviewsLink}
          showReviews={showReviews}
          setShowReviews={setShowReviews}
          isSyncingReviews={isSyncingReviews}
          handleSyncReviews={handleSyncReviews}
          channels={channels}
          updateChannelHandle={updateChannelHandle}
          toggleChannel={toggleChannel}
          onToast={notify}
        />

        <ServicesSection
          services={services}
          showServices={showServices}
          setShowServices={setShowServices}
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
          newServicePriceType={newServicePriceType}
          setNewServicePriceType={setNewServicePriceType}
          newServicePrice={newServicePrice}
          setNewServicePrice={setNewServicePrice}
          newServiceMinPrice={newServiceMinPrice}
          setNewServiceMinPrice={setNewServiceMinPrice}
          newServiceMaxPrice={newServiceMaxPrice}
          setNewServiceMaxPrice={setNewServiceMaxPrice}
          currency={currency}
          addService={addService}
          categories={categories}
          addCategory={addPortfolioCategory}
          removeCategory={removePortfolioCategory}
        />

        <PortfolioSection
          portfolio={portfolio}
          categories={categories}
          addPortfolioCategory={addPortfolioCategory}
          removePortfolioCategory={removePortfolioCategory}
          showPortfolio={showPortfolio}
          setShowPortfolio={setShowPortfolio}
          showAddProjectModal={showAddProjectModal}
          setShowAddProjectModal={setShowAddProjectModal}
          showManageGalleryModal={showManageGalleryModal}
          setShowManageGalleryModal={setShowManageGalleryModal}
          newProject={newProject}
          setNewProject={setNewProject}
          isUploadingProjectImage={isUploadingProjectImage}
          isUploadingGalleryImages={isUploadingGalleryImages}
          handleProjectImageUpload={handleProjectImageUpload}
          handleGalleryImagesUpload={handleGalleryImagesUpload}
          removeGalleryImageFromNewProject={removeGalleryImageFromNewProject}
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

        <ContactSection
          hours={hours}
          setHours={setHours}
          timeFrom={timeFrom}
          setTimeFrom={setTimeFrom}
          timeTo={timeTo}
          setTimeTo={setTimeTo}
          byAppointmentOnly={byAppointmentOnly}
          setByAppointmentOnly={setByAppointmentOnly}
        />

        <AppearanceSection
          colors={colors}
          setColors={setColors}
          radius={radius}
          setRadius={setRadius}
        />

        <FooterSection
          footerEyebrow={footerEyebrow}
          setFooterEyebrow={setFooterEyebrow}
          footerTitle={footerTitle}
          setFooterTitle={setFooterTitle}
          footerDescription={footerDescription}
          setFooterDescription={setFooterDescription}
          showFooterCta={showFooterCta}
          setShowFooterCta={setShowFooterCta}
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-[#6b7280]">
          Changes will immediately update your studio profile and public showcase.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-5 h-10 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? "Saving..." : "Save"}</span>
          </button>

          <a
            href={`/${slug || APP_CONFIG.defaultSlug}?from=settings`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-5 h-10 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-2xs"
          >
            <ExternalLink size={14} />
            <span>Live Studio</span>
          </a>
        </div>
      </div>
    </div>
  );
}

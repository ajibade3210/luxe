"use client";

import { ExternalLink, Save } from "lucide-react";
import { useSettingsForm } from "@/hooks/use-settings-form";
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
  } = useSettingsForm({ notify });

  return (
    <div className="w-full px-6 py-8 sm:px-8 sm:py-8 lg:px-10 lg:py-10 space-y-10 pb-24">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111827] tracking-tight">
            Studio Settings & Customization
          </h1>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-2 leading-relaxed">
            Configure your brand identity, services, portfolio, verified social badges, and visual
            aesthetic.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <ExternalLink size={14} />
            <span>Publish Live</span>
          </button>
        </div>
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
          about={about}
          setAbout={setAbout}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          isUploadingLogo={isUploadingLogo}
          handleLogoUpload={handleLogoUpload}
          onToast={notify}
        />

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
      </div>
    </div>
  );
}

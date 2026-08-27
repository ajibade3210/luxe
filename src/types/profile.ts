import type { ButtonRadiusType, CurrencyCode } from "./common";

// Business and studio profile types
export type SocialChannelType =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "x"
  | "youtube"
  | "whatsapp"
  | "threads"
  | "pinterest"
  | "website";

export interface SocialChannel {
  id: string;
  type: SocialChannelType;
  connected: boolean;
  label: string;
  handle: string;
  url: string;
  lastSynced?: string;
  description?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role?: string;
  eventType: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  order?: number;
  isCover?: boolean;
  gallery?: string[];
  stats?: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  button: string;
  pageBackground?: string;
  cardBackground?: string;
  text: string;
}

export interface ThemePreset {
  name: string;
  colors: ColorScheme;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface BusinessProfile {
  id: string;
  businessId?: string;
  businessName: string;
  slug: string;
  tagline: string;
  description: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  logoUrl?: string;
  googleReviewsLink?: string;
  services: ServiceItem[];
  socialChannels: SocialChannel[];
  reviews: ReviewItem[];
  portfolio: PortfolioProject[];
  operatingHours: string;
  timeFrom: string;
  timeTo: string;
  byAppointmentOnly: boolean;
  whatsAppNumber: string;
  emailAddress: string;
  physicalAddress: string;
  colors: ColorScheme;
  buttonRadius: ButtonRadiusType;
  currency?: CurrencyCode;
  showServices?: boolean;
  showPortfolio?: boolean;
  showReviews?: boolean;
  updatedAt: string;
}

export interface IdentitySectionProps {
  name: string;
  setName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  slugStatus: "checking" | "available" | "taken" | "idle";
  tagline: string;
  setTagline: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  currency?: CurrencyCode;
  setCurrency?: (v: CurrencyCode) => void;
  about: string;
  setAbout: (v: string) => void;
  logoUrl: string;
  setLogoUrl: (v: string) => void;
  isUploadingLogo: boolean;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToast: (msg: string) => void;
}

export interface ChannelsSectionProps {
  googleReviewsLink: string;
  setGoogleReviewsLink: (v: string) => void;
  showReviews: boolean;
  setShowReviews: (v: boolean) => void;
  isSyncingReviews: boolean;
  handleSyncReviews: () => void;
  channels: SocialChannel[];
  updateChannelHandle: (id: string, handle: string) => void;
  toggleChannel: (id: string) => void;
  onToast: (msg: string) => void;
}

export interface ServicesSectionProps {
  services: ServiceItem[];
  showServices: boolean;
  setShowServices: (v: boolean) => void;
  editingServiceId: string | null;
  setEditingServiceId: (id: string | null) => void;
  updateService: (id: string, patch: Partial<ServiceItem>) => void;
  removeService: (id: string) => void;
  showAddService: boolean;
  setShowAddService: (v: boolean) => void;
  newServiceInput: string;
  setNewServiceInput: (v: string) => void;
  newServiceCategory: string;
  setNewServiceCategory: (v: string) => void;
  newServiceDesc: string;
  setNewServiceDesc: (v: string) => void;
  addService: () => void;
}

export interface PortfolioSectionProps {
  portfolio: PortfolioProject[];
  showPortfolio: boolean;
  setShowPortfolio: (v: boolean) => void;
  showAddProjectModal: boolean;
  setShowAddProjectModal: (v: boolean) => void;
  showManageGalleryModal: boolean;
  setShowManageGalleryModal: (v: boolean) => void;
  newProject: Partial<PortfolioProject>;
  setNewProject: React.Dispatch<React.SetStateAction<Partial<PortfolioProject>>>;
  isUploadingProjectImage: boolean;
  handleProjectImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddProject: (e: React.FormEvent) => void;
  removeProject: (id: string) => void;
  moveProject: (index: number, direction: "up" | "down") => void;
  draggedProjectIndex: number | null;
  dragOverProjectIndex: number | null;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
  onToast: (msg: string) => void;
}

export interface ContactSectionProps {
  hours: string;
  setHours: (v: string) => void;
  timeFrom: string;
  setTimeFrom: (v: string) => void;
  timeTo: string;
  setTimeTo: (v: string) => void;
  byAppointmentOnly: boolean;
  setByAppointmentOnly: (v: boolean) => void;
}

export interface AppearanceSectionProps {
  colors: ColorScheme;
  setColors: (c: ColorScheme) => void;
  radius: ButtonRadiusType;
  setRadius: (r: ButtonRadiusType) => void;
}

export interface StationeryCardProps {
  profile: BusinessProfile;
  slug?: string;
  isFlipped: boolean;
  setIsFlipped: (v: boolean) => void;
  setQuoteModalOpen?: (v: boolean) => void;
  handleCopyLink?: () => void;
  primaryColor: string;
  secondaryColor: string;
  buttonColor?: string;
  textColor?: string;
  cardBgColor?: string;
  monogram: string;
  averageRating?: string | number;
  totalReviews?: number;
  whatsAppLink?: string;
  radiusClass?: string;
}

export interface StudioHighlightsCardProps {
  profile: BusinessProfile;
  totalCustomers?: number;
  setQuoteModalOpen: (v: boolean) => void;
  handleCopyLink: () => void;
  whatsAppLink: string;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  cardBgColor?: string;
  radiusClass: string;
}

export interface StudioServicesSectionProps {
  profile: BusinessProfile;
  setQuoteModalOpen: (v: boolean) => void;
  setQuoteForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      service: string;
      eventDate: string;
      budget: string;
      message: string;
    }>
  >;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  textColor?: string;
  radiusClass: string;
}

export interface StudioPortfolioSectionProps {
  portfolio: PortfolioProject[];
  setSelectedProject: (p: PortfolioProject | null) => void;
  setQuoteModalOpen: (v: boolean) => void;
  primaryColor: string;
  buttonColor: string;
  textColor?: string;
  radiusClass: string;
}

export interface StudioSocialSectionProps {
  profile: BusinessProfile;
  primaryColor?: string;
  textColor?: string;
  radiusClass?: string;
}

export interface StudioReviewsSectionProps {
  reviews: ReviewItem[];
  averageRating: string | number;
  totalReviews: number;
  setReviewModalOpen: (v: boolean) => void;
  googleReviewsLink?: string;
  primaryColor: string;
  buttonColor: string;
  textColor?: string;
  radiusClass: string;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewForm: {
    author: string;
    eventType: string;
    rating: number;
    comment: string;
  };
  setReviewForm: React.Dispatch<
    React.SetStateAction<{
      author: string;
      eventType: string;
      rating: number;
      comment: string;
    }>
  >;
  reviewSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  primaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onInquire: () => void;
  primaryColor: string;
}

export interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  quoteForm: {
    name: string;
    email: string;
    phone: string;
    service: string;
    eventDate: string;
    budget: string;
    message: string;
  };
  setQuoteForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      service: string;
      eventDate: string;
      budget: string;
      message: string;
    }>
  >;
  quoteSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  primaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export interface StudioNavbarProps {
  profile: BusinessProfile;
  slug: string;
  isFromSettings: boolean;
  isScrolled: boolean;
  activeSection: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  setQuoteModalOpen: (v: boolean) => void;
  handleCopyLink: () => void;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  textColor: string;
  pageBgColor?: string;
  monogram: string;
  radiusClass: string;
}

export interface StudioFooterProps {
  profile: BusinessProfile;
  primaryColor: string;
  secondaryColor: string;
  monogram: string;
}

export interface ElanEventsPageProps {
  initialProfile?: BusinessProfile;
  slug?: string;
}

"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  ImagePlus,
  Link2,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { businessProfile as initialMockProfile } from "@/lib/mock-data";
import {
  checkSlugAvailability,
  getBusinessProfile,
  publishChanges,
  updateBusinessProfile,
  uploadBusinessLogo,
} from "@/lib/api";
import type {
  ButtonRadiusType,
  ColorScheme,
  PortfolioProject,
  SocialChannel,
} from "@/lib/types";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={on ? "Disconnect channel" : "Connect channel"}
      className={`settings-toggle ${on ? "on" : ""}`}
      onClick={onClick}
    >
      <span />
    </button>
  );
}

function Card({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="settings-card">
      <div className="settings-card-heading">
        <div>
          <span className="step">{number}</span>
          <h2>{title}</h2>
        </div>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function EnhancedSettingsPage({
  onToast,
}: {
  onToast: (s: string) => void;
}) {
  // Main settings state
  const [name, setName] = useState(initialMockProfile.businessName);
  const [slug, setSlug] = useState(initialMockProfile.slug);
  const [tagline, setTagline] = useState(
    initialMockProfile.tagline ||
      "We design unforgettable weddings, corporate events, and private celebrations.",
  );
  const [location, setLocation] = useState(initialMockProfile.location);
  const [website, setWebsite] = useState(initialMockProfile.website);
  const [email, setEmail] = useState(initialMockProfile.email);
  const [about, setAbout] = useState(initialMockProfile.description);

  // Services
  const [services, setServices] = useState<string[]>(
    initialMockProfile.services || [],
  );
  const [newServiceInput, setNewServiceInput] = useState("");
  const [showAddService, setShowAddService] = useState(false);

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(
    initialMockProfile.portfolio || [],
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

  // Google Reviews
  const [googleReviewsLink, setGoogleReviewsLink] = useState(
    initialMockProfile.googleReviewsLink ||
      "https://business.google.com/elan-events",
  );

  // Social Channels
  const [channels, setChannels] = useState<SocialChannel[]>(
    initialMockProfile.socialChannels || [],
  );

  // Operating details
  const [hours, setHours] = useState(
    initialMockProfile.operatingHours || "Mon–Fri",
  );
  const [timeFrom, setTimeFrom] = useState(
    initialMockProfile.timeFrom || "09:00 AM",
  );
  const [timeTo, setTimeTo] = useState(initialMockProfile.timeTo || "06:00 PM");
  const [byAppointmentOnly, setByAppointmentOnly] = useState(
    initialMockProfile.byAppointmentOnly ?? true,
  );
  const [whatsAppNumber, setWhatsAppNumber] = useState(
    initialMockProfile.whatsAppNumber || "+234 800 ELAN VIP",
  );
  const [emailAddress, setEmailAddress] = useState(
    initialMockProfile.emailAddress || "hello@elanevents.com",
  );
  const [physicalAddress, setPhysicalAddress] = useState(
    initialMockProfile.physicalAddress || "Victoria Island, Lagos, Nigeria",
  );

  // Business Logo
  const [logoUrl, setLogoUrl] = useState<string>(
    initialMockProfile.logoUrl ||
      "https://cdn.accessa.ng/test/accessa/louis-dike-ayskyj/images/c95e52aa48bf676ed0d53f36bb957b81.png",
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Appearance
  const [colors, setColors] = useState<ColorScheme>(
    initialMockProfile.colors || {
      primary: "#000000",
      secondary: "#0058BE",
      button: "#000000",
      text: "#191C1D",
    },
  );
  const [radius, setRadius] = useState<ButtonRadiusType>(
    initialMockProfile.buttonRadius || "Subtle",
  );

  // Validation & saving state
  const [slugStatus, setSlugStatus] = useState<
    "checking" | "available" | "taken" | "idle"
  >("available");
  const [saving, setSaving] = useState(false);

  // Load freshest profile on mount
  useEffect(() => {
    getBusinessProfile().then(p => {
      setName(p.businessName);
      setSlug(p.slug);
      setTagline(
        p.tagline ||
          "We design unforgettable weddings, corporate events, and private celebrations.",
      );
      setLocation(p.location);
      setWebsite(p.website);
      setEmail(p.email);
      setAbout(p.description);
      if (p.logoUrl) setLogoUrl(p.logoUrl);
      setServices(p.services || []);
      setPortfolio(p.portfolio || []);
      setChannels(p.socialChannels || []);
      setGoogleReviewsLink(p.googleReviewsLink || "");
      setHours(p.operatingHours || "Mon–Fri");
      setTimeFrom(p.timeFrom || "09:00 AM");
      setTimeTo(p.timeTo || "06:00 PM");
      setByAppointmentOnly(p.byAppointmentOnly ?? true);
      setWhatsAppNumber(p.whatsAppNumber || "+234 800 ELAN VIP");
      setEmailAddress(p.emailAddress || "hello@elanevents.com");
      setPhysicalAddress(
        p.physicalAddress || "Victoria Island, Lagos, Nigeria",
      );
      if (p.colors) setColors(p.colors);
      if (p.buttonRadius) setRadius(p.buttonRadius);
    });
  }, []);

  // Live slug uniqueness validation simulation
  useEffect(() => {
    if (!slug) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await checkSlugAvailability(slug);
        setSlugStatus(res.available ? "available" : "taken");
      } catch {
        setSlugStatus("available");
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [slug]);

  const toggleChannel = (id: string) => {
    setChannels(prev =>
      prev.map(c => (c.id === id ? { ...c, connected: !c.connected } : c)),
    );
  };

  const updateChannelHandle = (id: string, val: string) => {
    setChannels(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              handle: val,
              url: val.startsWith("http") ? val : `https://${val}`,
            }
          : c,
      ),
    );
  };

  const addService = () => {
    const trimmed = newServiceInput.trim();
    if (trimmed && !services.includes(trimmed)) {
      setServices([...services, trimmed]);
      setNewServiceInput("");
      setShowAddService(false);
      onToast(`Service "${trimmed}" added`);
    }
  };

  const removeService = (serviceToRemove: string) => {
    setServices(services.filter(s => s !== serviceToRemove));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    const project: PortfolioProject = {
      id: `proj-${Date.now()}`,
      title: newProject.title || "New Showcase Project",
      category: newProject.category || "Luxury Celebration",
      location: newProject.location || "Lagos, Nigeria",
      description:
        newProject.description || "Bespoke event planning and execution.",
      image:
        newProject.image ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      stats: newProject.stats || "Curated Design",
    };
    setPortfolio([project, ...portfolio]);
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
    onToast(`Project "${project.title}" added to portfolio`);
  };

  const removeProject = (id: string) => {
    setPortfolio(portfolio.filter(p => p.id !== id));
    onToast("Project removed from portfolio");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const res = await uploadBusinessLogo(file);
      if (res.url) {
        setLogoUrl(res.url);
        onToast("Business logo uploaded! CDN URL generated.");
      }
    } catch {
      onToast("Error uploading logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    await updateBusinessProfile({
      businessName: name,
      slug,
      tagline,
      location,
      description: about,
      website,
      email,
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
      colors,
      buttonRadius: radius,
    });
    await publishChanges();
    setSaving(false);
    onToast("All studio settings & public profile saved successfully");
  };

  const copyProfileLink = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : "https://luxeadmin.com"}/${slug || "elan-events"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    onToast("Public profile link copied to clipboard!");
  };

  return (
    <section className="content settings-content">
      {/* Top Banner with Authentic LuxeAdmin Typography */}
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

      {/* Card 01: Business Profile */}
      <Card
        number="01"
        title="Business profile"
        description="The foundation of your public customer-facing presence."
      >
        <div className="form-grid">
          {/* Logo Upload Section - Structured, Balanced & Luxury Polished */}
          <div className="full bg-white border border-[#e5e7eb] rounded-lg p-6 mb-5 shadow-2xs">
            {/* Header */}
            <div className="border-b border-[#e5e7eb] pb-3.5 mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0058be] block">
                Business Brand Logo
              </span>
              <span className="text-xs text-[#6b7280]">
                Your official studio crest displayed on onboarding cards, concierge header, and footer
              </span>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
              {/* Logo Preview Column */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg border border-[#e5e7eb] bg-white p-2 flex items-center justify-center shadow-xs shrink-0 overflow-hidden group">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Business Logo Preview"
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <span className="font-sans font-bold text-3xl text-[#191c1d]">
                      {name ? name.charAt(0) : "É"}
                    </span>
                  )}
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center">
                      <Loader2 size={22} className="animate-spin text-[#0058be]" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#6b7280] font-medium tracking-wider uppercase">
                  PNG · SVG · JPG
                </span>
              </div>

              {/* Upload Actions & URL Column */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#191c1d]">
                      Studio Brand Crest
                    </h4>
                    <p className="text-xs text-[#6b7280] mt-0.5">
                      Upload a new logo to automatically generate a CDN URL and update all live touchpoints.
                    </p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-[#000000] hover:bg-[#262626] text-white px-4 py-2 rounded-md text-xs font-medium transition-all shadow-xs shrink-0">
                    <Upload size={14} />
                    <span>{isUploadingLogo ? "Uploading to CDN..." : "Upload New Logo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Integrated CDN URL Bar */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-[#6b7280] block">
                    Generated CDN Asset URL
                  </span>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://cdn.accessa.ng/..."
                      className="w-full text-xs font-mono bg-[#f8f9fa] border border-[#e5e7eb] rounded-md pl-3.5 pr-28 py-2.5 text-[#191c1d] focus:border-[#0058be] focus:outline-none shadow-2xs"
                    />
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(logoUrl);
                            onToast("CDN Logo URL copied to clipboard!");
                          }
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-[#191c1d] hover:bg-[#e7e8e9] bg-[#f3f4f5] px-3 py-1.5 rounded inline-flex items-center gap-1 font-medium transition-colors cursor-pointer border border-[#e5e7eb]"
                      >
                        <Copy size={12} />
                        <span>Copy URL</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 1: Name & Slug */}
          <label>
            Business name
            <input value={name} onChange={e => setName(e.target.value)} />
          </label>

          <label>
            Public profile slug & URL
            <div className="slug-input relative">
              <span>luxeadmin.com/</span>
              <input
                aria-label="Public profile slug"
                value={slug}
                onChange={e =>
                  setSlug(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  )
                }
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                {slugStatus === "checking" && (
                  <Loader2 size={14} className="animate-spin text-[#78716c]" />
                )}
                {slugStatus === "available" && (
                  <span className="text-[#2c6e49] flex items-center gap-1 font-medium text-[11px]">
                    <Check size={13} /> Available
                  </span>
                )}
                {slugStatus === "taken" && (
                  <span className="text-[#b84c24] flex items-center gap-1 font-medium text-[11px]">
                    <X size={13} /> Taken
                  </span>
                )}
              </div>
            </div>
            <small className="field-hint">
              Routes directly to your live onboarding and studio profile page.
            </small>
          </label>

          {/* Row 2: Tagline (Full width) */}
          <label className="full">
            Hero Tagline / Headline
            <input value={tagline} onChange={e => setTagline(e.target.value)} />
          </label>

          {/* Row 3: Location & Website */}
          <label>
            Location / Region
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </label>

          <label>
            Website
            <input value={website} onChange={e => setWebsite(e.target.value)} />
          </label>

          {/* Row 4: Studio Email & WhatsApp Concierge */}
          <label>
            Studio Email
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </label>

          <label>
            WhatsApp Concierge Line
            <input
              value={whatsAppNumber}
              onChange={e => setWhatsAppNumber(e.target.value)}
              placeholder="+234 800 ELAN VIP"
            />
          </label>

          {/* Row 5: Philosophy / Bio (Full width) */}
          <label className="full">
            Studio Philosophy / Description (The Élan Touch)
            <textarea value={about} onChange={e => setAbout(e.target.value)} />
          </label>
        </div>
      </Card>

      {/* Card 02: Services & Offerings */}
      <Card
        number="02"
        title="Services & offerings"
        description="Make your expertise easy to understand for prospective couples and clients."
      >
        <div className="service-pills">
          {services.map(service => (
            <span key={service} className="inline-flex items-center gap-2">
              {service}
              <button
                type="button"
                onClick={() => removeService(service)}
                aria-label={`Remove service ${service}`}
                className="hover:text-[#ba1a1a] cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}

          {showAddService ? (
            <div className="inline-flex items-center gap-2 border border-[#0058be] rounded px-2 py-1 bg-white">
              <input
                type="text"
                autoFocus
                placeholder="Enter service name..."
                value={newServiceInput}
                onChange={e => setNewServiceInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") addService();
                  if (e.key === "Escape") setShowAddService(false);
                }}
                className="text-xs border-0 p-1 outline-none w-40 bg-transparent"
              />
              <button
                type="button"
                onClick={addService}
                className="text-xs bg-[#000000] hover:bg-[#262626] text-white px-2.5 py-1 rounded font-medium"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddService(false)}
                className="text-xs text-[#6b7280]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddService(true)}
              className="add-service cursor-pointer"
            >
              <Plus size={14} /> Add service
            </button>
          )}
        </div>
      </Card>

      {/* Card 03: Portfolio Gallery */}
      <Card
        number="03"
        title="Portfolio Gallery"
        description="Keep your 'Best Work' fresh to attract high-end clientele."
      >
        <div className="space-y-4">
          <div className="button-row">
            <button
              type="button"
              onClick={() => setShowAddProjectModal(true)}
              className="dark-button"
            >
              <Upload size={15} /> Upload new project
            </button>
            <button
              type="button"
              onClick={() =>
                onToast(`Managing ${portfolio.length} portfolio items`)
              }
              className="outline-button"
            >
              <ImagePlus size={15} /> Manage gallery ({portfolio.length})
            </button>
          </div>

          {/* Current Projects List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {portfolio.map(proj => (
              <div
                key={proj.id}
                className="border border-[#eae3d8] rounded-xl p-3 bg-[#faf8f5] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="truncate">
                    <strong className="text-xs block text-[#1c1917] truncate">
                      {proj.title}
                    </strong>
                    <span className="text-[10px] text-[#78716c]">
                      {proj.category}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="text-[#a89e92] hover:text-[#b84c24] p-1 cursor-pointer"
                  title="Remove project"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Card 04: Reputation Management */}
      <Card number="04" title="Reputation Management">
        <p className="settings-copy">
          Connect your Google Business Profile to automatically sync and display
          your latest 5-star reviews on your public page.
        </p>
        <label>
          Google Business link
          <input
            value={googleReviewsLink}
            onChange={e => setGoogleReviewsLink(e.target.value)}
            placeholder="https://business.google.com/..."
          />
        </label>
        <button
          type="button"
          onClick={() => onToast("Google reviews linked successfully")}
          className="dark-button wide-button bg-[#1c1917]"
        >
          <Link2 size={15} /> Connect Google reviews
        </button>
      </Card>

      {/* Card 05: Social Channels Management */}
      <Card
        number="05"
        title="Social Channels Management"
        description="Manage where clients can find you online across all 10 platforms."
      >
        <div className="social-grid">
          {channels.map(channel => (
            <div className="social-tile" key={channel.id}>
              <div className="flex-1 min-w-0">
                <b>{channel.label}</b>
                <input
                  value={channel.handle}
                  onChange={e =>
                    updateChannelHandle(channel.id, e.target.value)
                  }
                  placeholder={`Enter ${channel.label} link or handle`}
                />
              </div>
              <Toggle
                on={channel.connected}
                onClick={() => toggleChannel(channel.id)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Card 06: Business Details */}
      <Card
        number="06"
        title="Business Details"
        description="Detailed operational and contact information rendered in the stationery card."
      >
        <div className="details-columns">
          <div>
            <span className="eyebrow">Operating hours</span>
            <div className="hour-tabs">
              {["Mon–Fri", "Mon–Sat", "Everyday"].map(item => (
                <button
                  type="button"
                  className={hours === item ? "selected" : ""}
                  onClick={() => setHours(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="time-row">
              <span className="flex-1">
                From
                <input
                  type="text"
                  value={timeFrom}
                  onChange={e => setTimeFrom(e.target.value)}
                  className="font-bold text-xs border-0 p-0 bg-transparent text-[#1c1917] outline-none"
                />
              </span>
              <Clock3 />
              <span className="flex-1">
                To
                <input
                  type="text"
                  value={timeTo}
                  onChange={e => setTimeTo(e.target.value)}
                  className="font-bold text-xs border-0 p-0 bg-transparent text-[#1c1917] outline-none"
                />
              </span>
              <Clock3 />
            </div>
            <label className="switch-label mt-3 flex items-center gap-2 cursor-pointer">
              <Toggle
                on={byAppointmentOnly}
                onClick={() => setByAppointmentOnly(!byAppointmentOnly)}
              />
              <span>By appointment only</span>
            </label>
          </div>

          <div className="contact-stack">
            <span className="eyebrow">Contact details</span>
            <div>
              <MessageSquare />
              <div className="w-full">
                <span className="text-[10px] text-[#78716c]">
                  WhatsApp number
                </span>
                <input
                  value={whatsAppNumber}
                  onChange={e => setWhatsAppNumber(e.target.value)}
                  className="text-xs font-medium border-0 p-0 bg-transparent text-[#1c1917] outline-none w-full"
                />
              </div>
            </div>
            <div>
              <Mail />
              <div className="w-full">
                <span className="text-[10px] text-[#78716c]">
                  Email address
                </span>
                <input
                  value={emailAddress}
                  onChange={e => setEmailAddress(e.target.value)}
                  className="text-xs font-medium border-0 p-0 bg-transparent text-[#1c1917] outline-none w-full"
                />
              </div>
            </div>
            <div>
              <MapPin />
              <div className="w-full">
                <span className="text-[10px] text-[#78716c]">
                  Physical address
                </span>
                <input
                  value={physicalAddress}
                  onChange={e => setPhysicalAddress(e.target.value)}
                  className="text-xs font-medium border-0 p-0 bg-transparent text-[#1c1917] outline-none w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Card 07: Appearance & Branding */}
      <Card number="07" title="Appearance & Branding">
        <span className="eyebrow">Colors (VibeCoder Lumina Palette)</span>
        <div className="color-row">
          {(
            [
              ["Primary (Core Brand)", "primary"],
              ["Secondary (Electric Blue)", "secondary"],
              ["Button Action Color", "button"],
              ["Text Color (Main)", "text"],
            ] as const
          ).map(([label, key]) => (
            <label className="color-control" key={key}>
              <span>{label}</span>
              <div className="color-input-row">
                <input
                  aria-label={`${label} color`}
                  type="color"
                  value={colors[key]}
                  onChange={e =>
                    setColors({ ...colors, [key]: e.target.value })
                  }
                />
                <code className="font-mono">{colors[key].toUpperCase()}</code>
              </div>
            </label>
          ))}
        </div>

        <div className="radius-choice">
          <span className="eyebrow">Button corner radius</span>
          <div
            className="radius-options"
            role="radiogroup"
            aria-label="Button corner radius"
          >
            {(
              ["Square", "Subtle", "Rounded", "Pill"] as ButtonRadiusType[]
            ).map(item => (
              <label className="radius-option" key={item}>
                <input
                  type="radio"
                  name="button-radius"
                  value={item}
                  checked={radius === item}
                  onChange={() => setRadius(item)}
                />
                <span className="radio-dot" aria-hidden="true" />
                {item}
              </label>
            ))}
          </div>
        </div>
      </Card>

      <div className="settings-footer">
        <button
          type="button"
          className="outline-button"
          onClick={() => onToast("Section builder coming soon")}
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

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-[#191c1d]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-lg max-w-lg w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAddProjectModal(false)}
              className="absolute top-6 right-6 text-[#6b7280] hover:text-[#191c1d] p-1 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#0058be] font-semibold">
                Portfolio Showcase
              </span>
              <h3 className="font-sans text-2xl text-[#191c1d] font-bold mt-1">
                Upload New Project
              </h3>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zara & Kene's Coastal Nuptials"
                  value={newProject.title}
                  onChange={e =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1f2937] font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury Wedding"
                    value={newProject.category}
                    onChange={e =>
                      setNewProject({ ...newProject, category: e.target.value })
                    }
                    className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  />
                </div>
                <div>
                  <label className="block text-[#1f2937] font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Victoria Island, Lagos"
                    value={newProject.location}
                    onChange={e =>
                      setNewProject({ ...newProject, location: e.target.value })
                    }
                    className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProject.image}
                  onChange={e =>
                    setNewProject({ ...newProject, image: e.target.value })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Project Narrative / Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="A brief editorial summary of this project..."
                  value={newProject.description}
                  onChange={e =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded p-3.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#0058be] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#000000] hover:bg-[#262626] text-white text-xs font-medium py-3 rounded transition-all cursor-pointer"
                >
                  Add Project to Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

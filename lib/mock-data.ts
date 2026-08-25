import type {
  Activity,
  BusinessProfile,
  Customer,
  Lead,
  OrganizationPreview,
  PortfolioProject,
  Project,
  ReviewItem,
  ServiceItem,
  SocialChannel,
  User,
} from "./types";

export const currentUser: User = {
  id: "u1",
  email: "amelia@elanevents.com",
  name: "Amelia Bell",
  avatar: "AB",
  role: "admin",
};

export const elanSocialChannels: SocialChannel[] = [
  {
    id: "ig",
    type: "instagram",
    label: "Instagram",
    connected: true,
    handle: "@elanevents_lagos",
    url: "https://instagram.com/elanevents_lagos",
    description: "Visual journals, real weddings & editorial floral styling",
    lastSynced: "2026-08-25T10:00:00Z",
  },
  {
    id: "fb",
    type: "facebook",
    label: "Facebook",
    connected: true,
    handle: "facebook.com/elevents",
    url: "https://facebook.com/elevents",
    description: "Studio stories, full galleries & community celebrations",
    lastSynced: "2026-08-24T12:00:00Z",
  },
  {
    id: "li",
    type: "linkedin",
    label: "LinkedIn",
    connected: true,
    handle: "linkedin.com/company/elan-events",
    url: "https://linkedin.com/company/elan-events",
    description: "Corporate summit productions, galas & luxury hospitality insights",
    lastSynced: "2026-08-23T14:30:00Z",
  },
  {
    id: "tt",
    type: "tiktok",
    label: "TikTok",
    connected: true,
    handle: "@elanevents",
    url: "https://tiktok.com/@elanevents",
    description: "Behind-the-scenes transformations & venue reveals",
    lastSynced: "2026-08-25T08:00:00Z",
  },
  {
    id: "x",
    type: "x",
    label: "X (Twitter)",
    connected: true,
    handle: "@elanevents",
    url: "https://x.com/elanevents",
    description: "Press features, live event dispatches & industry notes",
    lastSynced: "2026-08-22T16:00:00Z",
  },
  {
    id: "yt",
    type: "youtube",
    label: "YouTube",
    connected: true,
    handle: "youtube.com/c/elanevents",
    url: "https://youtube.com/c/elanevents",
    description: "4K cinematic event films & director documentary recaps",
    lastSynced: "2026-08-20T11:00:00Z",
  },
  {
    id: "wa",
    type: "whatsapp",
    label: "WhatsApp",
    connected: true,
    handle: "+234 800 ELAN VIP",
    url: "https://wa.me/2348003526847",
    description: "Direct VIP concierge & instant consultation desk",
    lastSynced: "2026-08-25T14:00:00Z",
  },
  {
    id: "th",
    type: "threads",
    label: "Threads",
    connected: true,
    handle: "@elanevents_lagos",
    url: "https://threads.net/@elanevents_lagos",
    description: "Design musings, spatial concepts & live event updates",
    lastSynced: "2026-08-24T09:00:00Z",
  },
  {
    id: "pi",
    type: "pinterest",
    label: "Pinterest",
    connected: true,
    handle: "pinterest.com/elanevents",
    url: "https://pinterest.com/elanevents",
    description: "Curated moodboards, bespoke color palettes & table textures",
    lastSynced: "2026-08-21T18:00:00Z",
  },
  {
    id: "web",
    type: "website",
    label: "Website",
    connected: true,
    handle: "elanevents.com",
    url: "https://elanevents.com",
    description: "Official digital flagship & private client portal",
    lastSynced: "2026-08-25T12:00:00Z",
  },
];

export const elanPortfolio: PortfolioProject[] = [
  {
    id: "proj-1",
    title: "Amara & David's Wedding",
    category: "Luxury Wedding",
    location: "Victoria Island, Lagos",
    description:
      "A 3-day coastal celebration uniting contemporary architectural florals with timeless Nigerian heritage and bespoke candlelit pavilions.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    order: 0,
    isCover: true,
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: "280 Guests · 3 Days · 1,400 Blooms",
  },
  {
    id: "proj-2",
    title: "MTN Executive Gala",
    category: "Corporate Gala",
    location: "Eko Convention Centre",
    description:
      "An immersive black-tie gala for 450 executives featuring kinetic lighting, custom tiered staging, and synchronized fine dining orchestration.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    order: 1,
    isCover: false,
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: "450 Delegates · Custom Kinetic Lighting · Live Orchestra",
  },
  {
    id: "proj-3",
    title: "The Lagos Garden Party",
    category: "Private Celebration",
    location: "Ikoyi, Lagos",
    description:
      "An intimate botanical salon celebrating a milestone anniversary with an open-air string ensemble, French tablescapes, and curated gastronomy.",
    image:
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
    order: 2,
    isCover: false,
    gallery: [
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470753937643-efeb931202a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: "85 Guests · Botanical Styling · Acoustic Salon",
  },
];

export const elanReviews: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Folashade & Tunde Adeleke",
    role: "Couple",
    eventType: "Luxury Wedding · Victoria Island",
    rating: 5,
    comment:
      "Élan Events turned our wedding weekend into pure poetry. Every single detail from the breathtaking floral arches to the seamless guest experience was delivered with effortless warmth and poise.",
    date: "February 2026",
  },
  {
    id: "rev-2",
    author: "Babatunde Alabi",
    role: "VP Corporate Affairs, MTN Group",
    eventType: "Executive Gala · Eko Convention Centre",
    rating: 5,
    comment:
      "The executive gala was the smoothest, most prestigious corporate evening we have hosted in West Africa. Their production precision, security handling, and aesthetic mastery set a gold standard.",
    date: "January 2026",
  },
  {
    id: "rev-3",
    author: "Dr. Amina Bello",
    role: "Host",
    eventType: "50th Milestone Celebration · Ikoyi",
    rating: 5,
    comment:
      "For my milestone celebration in Ikoyi, the team created a romantic, candlelit garden sanctuary that left our 80 closest friends in awe. Truly in a league of their own in Lagos.",
    date: "November 2025",
  },
];

export const businessProfile: BusinessProfile = {
  id: "bp-elan",
  businessName: "Élan Events",
  slug: "elan-events",
  tagline: "We design unforgettable weddings, corporate events, and private celebrations.",
  description:
    "Curating bespoke, high-end experiences for the discerning few. From intimate soirees in Victoria Island to grand galas, we bring flawless execution and quiet luxury to every detail.",
  location: "Victoria Island, Lagos, Nigeria",
  website: "elanevents.com",
  email: "hello@elanevents.com",
  phone: "+234 800 ELAN VIP",
  logoUrl:
    "https://cdn.accessa.ng/test/accessa/louis-dike-ayskyj/images/c95e52aa48bf676ed0d53f36bb957b81.png",
  googleReviewsLink: "https://business.google.com/elan-events",
  services: [
    {
      id: "svc-1",
      name: "Luxury Weddings",
      category: "Bespoke",
      description:
        "End-to-end wedding production for discerning couples, from intimate garden ceremonies to grand ballroom affairs.",
    },
    {
      id: "svc-2",
      name: "Destination Events",
      category: "Bespoke",
      description:
        "Seamless multi-day celebrations executed across international and domestic landmark destinations.",
    },
    {
      id: "svc-3",
      name: "Corporate Galas",
      category: "Corporate",
      description:
        "Executive-grade gala productions with precision logistics, branded staging, and VIP guest handling.",
    },
    {
      id: "svc-4",
      name: "Private Celebrations",
      category: "Bespoke",
      description:
        "Milestone birthdays, anniversaries, and intimate celebrations curated with discreet white-glove concierge.",
    },
    {
      id: "svc-5",
      name: "Spatial & Floral Styling",
      category: "Creative",
      description:
        "Architectural floral installations, mood lighting design, and full spatial transformation for any venue.",
    },
    {
      id: "svc-6",
      name: "VIP Concierge Production",
      category: "Concierge",
      description:
        "Discreet high-net-worth guest handling, synchronized dining, and premium vendor coordination.",
    },
  ] as ServiceItem[],
  socialChannels: elanSocialChannels,
  reviews: elanReviews,
  portfolio: elanPortfolio,
  operatingHours: "Mon–Fri",
  timeFrom: "09:00 AM",
  timeTo: "06:00 PM",
  byAppointmentOnly: true,
  whatsAppNumber: "+234 800 ELAN VIP",
  emailAddress: "hello@elanevents.com",
  physicalAddress: "Victoria Island, Lagos, Nigeria",
  colors: {
    primary: "#000000",
    secondary: "#0058BE",
    button: "#000000",
    text: "#191C1D",
  },
  buttonRadius: "Subtle",
  updatedAt: "2026-08-25T12:00:00Z",
};

export const socialChannels: SocialChannel[] = elanSocialChannels;

export const leads: Lead[] = [
  {
    id: "l1",
    name: "Sofia Laurent",
    email: "sofia.laurent@example.com",
    phone: "+234 802 555 0142",
    service: "Destination Wedding",
    eventDate: "2026-10-18",
    budget: 85000,
    message:
      "We are planning an intimate celebration in Victoria Island and would love to explore your full-service luxury offering.",
    status: "new",
    createdAt: "2026-08-24T09:12:00Z",
  },
  {
    id: "l2",
    name: "Julian & Margot",
    email: "jm@example.com",
    service: "Luxury Wedding",
    eventDate: "2027-05-22",
    budget: 120000,
    message:
      "Looking for a studio to bring a modern, garden-inspired coastal wedding vision to life.",
    status: "contacted",
    createdAt: "2026-08-23T14:30:00Z",
  },
  {
    id: "l3",
    name: "Nora Chen",
    email: "nora.chen@example.com",
    phone: "+44 20 7946 0958",
    service: "Private Celebration",
    eventDate: "2026-09-04",
    budget: 32000,
    message: "A milestone dinner for 60 guests at a private estate in Ikoyi.",
    status: "qualified",
    createdAt: "2026-08-21T11:45:00Z",
  },
  {
    id: "l4",
    name: "Elias & Camille",
    email: "ec@example.com",
    service: "Spatial & Floral Styling",
    eventDate: "2026-11-12",
    budget: 54000,
    message: "We need floral, tablescape, and production design for a private gala.",
    status: "converted",
    createdAt: "2026-08-19T08:20:00Z",
  },
  {
    id: "l5",
    name: "Atlas Foundation",
    email: "events@atlas.org",
    service: "Corporate Galas",
    eventDate: "2026-12-03",
    budget: 68000,
    message: "Annual benefit dinner for 200 executive guests at Eko Convention Centre.",
    status: "closed",
    createdAt: "2026-08-16T16:10:00Z",
  },
];

const projects: Project[] = [
  {
    id: "p1",
    customerId: "c1",
    name: "Amara & David Wedding",
    service: "Luxury Wedding",
    amount: 96000,
    status: "active",
    createdAt: "2026-06-02",
  },
  {
    id: "p2",
    customerId: "c2",
    name: "Autumn Supper Club",
    service: "Private Celebration",
    amount: 28000,
    status: "completed",
    createdAt: "2026-05-12",
    completedAt: "2026-07-18",
  },
  {
    id: "p3",
    customerId: "c3",
    name: "MTN Executive Gala",
    service: "Corporate Gala",
    amount: 74000,
    status: "pending",
    createdAt: "2026-08-01",
  },
];

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Amara & David",
    email: "amara@example.com",
    phone: "+234 803 555 0177",
    company: "Adeleke Holdings",
    projects: [projects[0]],
    totalRevenue: 96000,
    notes: "Prefers understated architectural florals, soft candlelight and French linen.",
    createdAt: "2026-06-01",
  },
  {
    id: "c2",
    name: "Dr. Amina Bello",
    email: "amina.bello@example.com",
    phone: "+234 809 794 6095",
    projects: [projects[1]],
    totalRevenue: 28000,
    notes: "Ikoyi resident. Loves seasonal botanical menus and string quartets.",
    createdAt: "2026-05-10",
  },
  {
    id: "c3",
    name: "Babatunde Alabi",
    email: "babatunde@mtn.com",
    company: "MTN Group",
    projects: [projects[2]],
    totalRevenue: 74000,
    notes: "Annual gala partner. Requires strict security and VIP concierge protocols.",
    createdAt: "2026-08-01",
  },
];

export const activities: Activity[] = [
  {
    id: "a1",
    customerId: "c1",
    type: "project",
    description: "Floral architecture moodboard approved",
    timestamp: "2026-08-25T13:00:00Z",
  },
  {
    id: "a2",
    customerId: "c1",
    type: "note",
    description: "Added VIP seating chart and lighting rider",
    timestamp: "2026-08-24T10:30:00Z",
  },
  {
    id: "a3",
    customerId: "c1",
    type: "contact",
    description: "Sent consultation update for tasting menu",
    timestamp: "2026-08-22T15:15:00Z",
  },
];

export const featuredOrganizations: OrganizationPreview[] = [
  {
    id: "org-1",
    name: "Élan Events",
    slug: "elan-events",
    eyebrow: "Luxury Event Studio · Lagos",
    tagline: "We design unforgettable weddings, corporate events, and private celebrations.",
    logoUrl:
      "https://cdn.accessa.ng/test/accessa/louis-dike-ayskyj/images/c95e52aa48bf676ed0d53f36bb957b81.png",
    badge: "Bespoke Experiences",
  },
  {
    id: "org-2",
    name: "Maison Bell Events",
    slug: "maison-bell-events",
    eyebrow: "Haute Couture & Bridal · Paris / London",
    tagline: "Editorial wedding design and high-society galas across Europe's finest landmarks.",
    logoUrl: "https://cdn.logosystem.co/logos/the-huntington.webp",
    badge: "Haute Couture",
  },
  {
    id: "org-3",
    name: "Lumio Atelier",
    slug: "lumio-atelier",
    eyebrow: "Spatial Design & Light · Milan",
    tagline: "Architectural lighting, experiential banquets, and modern spatial art for galas.",
    logoUrl: "https://cdn.logosystem.co/logos/hatil.webp",
    badge: "Architectural Design",
  },
  {
    id: "org-4",
    name: "Meridian Celebrations",
    slug: "meridian-celebrations",
    eyebrow: "Destination Galas · Lake Como / Amalfi",
    tagline:
      "Multi-day lakeside celebrations and private yacht receptions for discerning clientele.",
    logoUrl: "https://cdn.logosystem.co/logos/mila.webp",
    badge: "Destination Estate",
  },
  {
    id: "org-5",
    name: "Arcwell Bespoke",
    slug: "arcwell-bespoke",
    eyebrow: "Private Estate Soirées · New York",
    tagline:
      "Discreet milestone celebrations, black-tie dinners, and bespoke artistic productions.",
    logoUrl: "https://cdn.logosystem.co/logos/fourthfloor.webp",
    badge: "White-Glove Concierge",
  },
  {
    id: "org-6",
    name: "Solace Studios",
    slug: "solace-studios",
    eyebrow: "Ultra-Luxury Gala Productions · Dubai",
    tagline: "Iconic corporate galas and royal wedding productions curated with quiet elegance.",
    logoUrl: "https://cdn.logosystem.co/logos/renforce.webp",
    badge: "Grand Productions",
  },
];

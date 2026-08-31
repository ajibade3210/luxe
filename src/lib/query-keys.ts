import type { ExpenseCategory, InvoiceStatus, LeadStatus, Timeframe } from "@/types";

export const queryKeys = {
  // Authentication & Session
  auth: {
    me: () => ["auth", "me"] as const,
  },

  // Studios & Profiles
  studios: {
    all: ["studios"] as const,
    me: () => ["studios", "me"] as const,
    featured: () => ["studios", "featured"] as const,
    bySlug: (slug: string) => ["studios", "slug", slug.toLowerCase()] as const,
    slugCheck: (slug: string) => ["studios", "slug-check", slug.toLowerCase()] as const,
  },

  // Customers
  customers: {
    all: ["customers"] as const,
    list: (query?: string, isActive?: boolean) =>
      ["customers", "list", { query: query ?? "", isActive }] as const,
    detail: (id: string) => ["customers", "detail", id] as const,
    summary: () => ["customers", "summary"] as const,
  },

  // Invoices
  invoices: {
    all: ["invoices"] as const,
    list: (status?: InvoiceStatus) => ["invoices", "list", { status }] as const,
    detail: (id: string) => ["invoices", "detail", id] as const,
    byCustomer: (customerId: string) => ["invoices", "customer", customerId] as const,
    summary: () => ["invoices", "summary"] as const,
  },

  // Expenses
  expenses: {
    all: ["expenses"] as const,
    list: (query?: string, category?: ExpenseCategory | "all") =>
      ["expenses", "list", { query: query ?? "", category: category ?? "all" }] as const,
    detail: (id: string) => ["expenses", "detail", id] as const,
    summary: () => ["expenses", "summary"] as const,
    categories: () => ["expenses", "categories"] as const,
  },

  // Leads
  leads: {
    all: ["leads"] as const,
    list: (query?: string, status?: LeadStatus) =>
      ["leads", "list", { query: query ?? "", status }] as const,
    detail: (id: string) => ["leads", "detail", id] as const,
    summary: () => ["leads", "summary"] as const,
  },

  // Analytics & Dashboards
  analytics: {
    all: ["analytics"] as const,
    overview: (timeframe: Timeframe = "monthly") => ["analytics", "overview", timeframe] as const,
    revenue: () => ["analytics", "revenue"] as const,
    funnel: () => ["analytics", "funnel"] as const,
    servicesPerformance: () => ["analytics", "services-performance"] as const,
  },

  // Broadcasts
  broadcasts: {
    all: ["broadcasts"] as const,
    history: () => ["broadcasts", "history"] as const,
  },

  // Feedback & Feature Requests
  feedback: {
    all: ["feedback"] as const,
    list: () => ["feedback", "list"] as const,
  },

  // Blog
  blog: {
    all: ["blog"] as const,
    list: (category?: string) => ["blog", "list", { category: category ?? "all" }] as const,
    detail: (slug: string) => ["blog", "detail", slug] as const,
    related: (slug: string, limit?: number) => ["blog", "related", slug, limit ?? 2] as const,
  },
} as const;

import { APP_CONFIG, CUSTOM_EVENTS, STORAGE_KEYS } from "@/constants";
import { leads as defaultLeads } from "@/lib/mock-data";
import type { Lead, LeadStatus } from "@/lib/types";

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export function loadPersistedLeads(): Lead[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.leads);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to mock data
    }
  }
  return [...defaultLeads];
}

export function savePersistedLeads(data: Lead[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.leadsUpdated, { detail: data }));
    } catch {
      // Storage quota safe
    }
  }
}

/**
 * Creates a new consultation inquiry lead.
 * Swappable with: `await fetch('/api/v1/leads', { method: 'POST', body: JSON.stringify(input) })`
 */
export async function createLead(input: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead> {
  await delay(300);
  const currentLeads = loadPersistedLeads();
  const newLead: Lead = {
    id: `l-${Date.now()}`,
    ...input,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  currentLeads.unshift(newLead);
  savePersistedLeads(currentLeads);
  return newLead;
}

export const submitConsultationInquiry = createLead;

/**
 * Fetches all leads.
 * Swappable with: `await fetch('/api/v1/leads').then(r => r.json())`
 */
export async function getLeads(): Promise<Lead[]> {
  await delay(100);
  return loadPersistedLeads();
}

/**
 * Updates a lead workflow status.
 * Swappable with: `await fetch('/api/v1/leads/' + id, { method: 'PATCH', body: JSON.stringify({ status }) })`
 */
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | undefined> {
  await delay(250);
  const currentLeads = loadPersistedLeads();
  const lead = currentLeads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
    savePersistedLeads(currentLeads);
  }
  return lead;
}

/**
 * Generates pre-formatted WhatsApp brief for immediate client-to-studio routing.
 */
export function createWhatsAppConsultationUrl(params: {
  studioPhone?: string;
  studioName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  service: string;
  eventDate?: string;
  budget?: number | string;
  message?: string;
}): string {
  const defaultPhone = APP_CONFIG.defaultStudioPhone;
  const appName = APP_CONFIG.name;

  const rawPhone = (params.studioPhone || defaultPhone).replace(/[^0-9]/g, "");
  const targetPhone = rawPhone.length >= 7 ? rawPhone : "2348055966944";

  const budgetDisplay = params.budget
    ? `$${Number(params.budget).toLocaleString()}`
    : "Custom / To be discussed";

  const brief = `✨ *New Consultation Inquiry — ${appName}*
━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${params.clientName}
📱 *Phone:* ${params.clientPhone || "Not provided"}
✉️ *Email:* ${params.clientEmail}
🛎️ *Service Requested:* ${params.service}
📅 *Estimated Date:* ${params.eventDate || "Flexible"}
💰 *Target Budget:* ${budgetDisplay}

💬 *Event Vision & Details:*
${params.message || `Consultation requested via ${appName} studio profile.`}
━━━━━━━━━━━━━━━━━━━━━
_Sent via ${params.studioName} on ${appName}_`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(brief)}`;
}

/**
 * Export Leads / Inquiries List as CSV
 * When connecting to real backend, easily swap with:
 * `window.location.href = '/api/leads/export?format=csv'`
 */
export async function exportLeadsCSV(): Promise<{ count: number; filename: string }> {
  await delay(350);

  const leads = await getLeads();

  if (typeof window === "undefined") {
    return { count: leads.length, filename: "leads.csv" };
  }

  const headers = [
    "ID",
    "Client Name",
    "Email",
    "Phone",
    "Service Requested",
    "Estimated Date",
    "Target Budget",
    "Inquiry Status",
    "Submitted At",
    "Message / Vision",
  ];

  const rows = leads.map(l => [
    l.id,
    `"${l.name}"`,
    l.email,
    l.phone || "N/A",
    `"${l.service || "Bespoke"}"`,
    l.eventDate || "Flexible",
    l.budget ? `$${Number(l.budget).toLocaleString()}` : "Custom",
    l.status,
    l.createdAt,
    `"${(l.message || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `elan-atelier-leads-${new Date().toISOString().split("T")[0]}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { count: leads.length, filename };
}

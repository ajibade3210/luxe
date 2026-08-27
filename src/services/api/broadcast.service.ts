import { CUSTOM_EVENTS } from "@/constants";
import type { BroadcastPayload, BroadcastResult, Customer } from "@/types";
import { getCustomers } from "./customer.service";

export const BROADCAST_LIMITS = {
  WHATSAPP_MAX_LENGTH: 500,
  EMAIL_MAX_LENGTH: 2000,
  BOTH_MAX_LENGTH: 500,
} as const;

let broadcastHistory: BroadcastResult[] = [];

const delay = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Service to execute bulk broadcast dispatches across WhatsApp, Email, or Both.
 * Fully decoupled for seamless swap with live WhatsApp Business Cloud API / SendGrid / Resend backend endpoints.
 */
export async function sendBroadcast(payload: BroadcastPayload): Promise<BroadcastResult> {
  await delay(200);

  if (!payload.customerIds || payload.customerIds.length === 0) {
    throw new Error("No recipients selected for broadcast.");
  }

  const allCustomers = await getCustomers();
  const targetedCustomers: Customer[] = allCustomers.filter(c =>
    payload.customerIds.includes(c.id)
  );

  if (targetedCustomers.length === 0) {
    throw new Error("None of the selected customers were found in the database.");
  }

  // Validate message length according to channel
  const maxLen =
    payload.channel === "email"
      ? BROADCAST_LIMITS.EMAIL_MAX_LENGTH
      : payload.channel === "whatsapp"
        ? BROADCAST_LIMITS.WHATSAPP_MAX_LENGTH
        : BROADCAST_LIMITS.BOTH_MAX_LENGTH;

  if (payload.message.length > maxLen) {
    throw new Error(
      `Message length (${payload.message.length}) exceeds maximum allowable limit of ${maxLen} characters for ${payload.channel}.`
    );
  }

  if ((payload.channel === "email" || payload.channel === "both") && !payload.subject?.trim()) {
    throw new Error("Email broadcasts require a subject line.");
  }

  const whatsAppRecipients = targetedCustomers.filter(
    c => c.phone && c.phone.trim().length > 0
  ).length;
  const emailRecipients = targetedCustomers.filter(
    c => c.email && c.email.trim().length > 0
  ).length;

  const result: BroadcastResult = {
    broadcastId: `bc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    channel: payload.channel,
    totalRecipients: targetedCustomers.length,
    whatsAppRecipients: payload.channel === "email" ? 0 : whatsAppRecipients,
    emailRecipients: payload.channel === "whatsapp" ? 0 : emailRecipients,
    deliveredCount: targetedCustomers.length,
    timestamp: new Date().toISOString(),
  };

  broadcastHistory = [result, ...broadcastHistory];

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.broadcastSent, {
        detail: result,
      })
    );
  }

  return result;
}

/**
 * Retrieve recent broadcast campaign history
 */
export async function getBroadcastHistory(): Promise<BroadcastResult[]> {
  await delay(50);
  return [...broadcastHistory];
}

/**
 * Utility to build a universal WhatsApp multi-select sharing URL
 */
export function createWhatsAppBroadcastUrl(message: string, imageUrl?: string): string {
  const fullText = imageUrl ? `${message}\n\nMedia: ${imageUrl}` : message;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
}

/**
 * Utility to build a direct 1-to-1 WhatsApp dispatch URL
 */
export function createWhatsAppDirectUrl(phone: string, message: string, imageUrl?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const fullText = imageUrl ? `${message}\n\nMedia: ${imageUrl}` : message;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`;
}

/**
 * Utility to build a discreet BCC mailto link for batch client dispatch
 */
export function createEmailBroadcastMailto(
  emails: string[],
  subject: string,
  message: string,
  imageUrl?: string
): string {
  const cleanEmails = emails.filter(e => e.trim().length > 0).join(",");
  const fullBody = imageUrl ? `${message}\n\nAttached Media: ${imageUrl}` : message;
  return `mailto:?bcc=${encodeURIComponent(cleanEmails)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
}

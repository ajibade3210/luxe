import { CUSTOM_EVENTS } from "@/constants";
import { apiClient } from "@/lib/api-client";
import type { BroadcastPayload, BroadcastResult } from "@/types";

export const BROADCAST_LIMITS = {
  WHATSAPP_MAX_LENGTH: 500,
  EMAIL_MAX_LENGTH: 2000,
  BOTH_MAX_LENGTH: 500,
} as const;

/**
 * Service to execute bulk broadcast dispatches across WhatsApp, Email, or Both.
 */
export async function sendBroadcast(payload: BroadcastPayload): Promise<BroadcastResult> {
  if (!payload.customerIds || payload.customerIds.length === 0) {
    throw new Error("No recipients selected for broadcast.");
  }

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

  const result = await apiClient.post<BroadcastResult>("/broadcasts/send", payload);

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
  const data = await apiClient.get<BroadcastResult[]>("/broadcasts/history");
  return Array.isArray(data) ? data : [];
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

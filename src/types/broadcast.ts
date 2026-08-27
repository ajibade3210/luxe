// Broadcast and notification types
export type BroadcastChannel = "whatsapp" | "email" | "both";

export interface BroadcastPayload {
  channel: BroadcastChannel;
  customerIds: string[];
  message: string;
  subject?: string;
  imageUrl?: string;
}

export interface BroadcastResult {
  broadcastId: string;
  channel: BroadcastChannel;
  totalRecipients: number;
  whatsAppRecipients: number;
  emailRecipients: number;
  deliveredCount: number;
  timestamp: string;
}

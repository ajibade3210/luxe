import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import type { BroadcastResult } from "@/types";
import {
  BROADCAST_LIMITS,
  createEmailBroadcastMailto,
  createWhatsAppBroadcastUrl,
  createWhatsAppDirectUrl,
  getBroadcastHistory,
  sendBroadcast,
} from "../broadcast.service";

describe("Broadcast Service", () => {
  it("throws error when no recipient customer IDs are supplied", async () => {
    await expect(
      sendBroadcast({
        channel: "whatsapp",
        customerIds: [],
        message: "Hello Atelier clients",
      })
    ).rejects.toThrow("No recipients selected for broadcast.");
  });

  it("enforces WhatsApp strict character limit (500 chars)", async () => {
    const longMessage = "A".repeat(BROADCAST_LIMITS.WHATSAPP_MAX_LENGTH + 1);

    await expect(
      sendBroadcast({
        channel: "whatsapp",
        customerIds: ["cust-1"],
        message: longMessage,
      })
    ).rejects.toThrow("exceeds maximum allowable limit");
  });

  it("requires a subject line for email broadcasts", async () => {
    await expect(
      sendBroadcast({
        channel: "email",
        customerIds: ["cust-1"],
        message: "Exclusive Atelier invitation.",
        subject: "   ",
      })
    ).rejects.toThrow("Email broadcasts require a subject line.");
  });

  it("successfully executes a bulk WhatsApp broadcast and records history", async () => {
    const mockResult: BroadcastResult = {
      broadcastId: "bc-test-1",
      channel: "whatsapp",
      totalRecipients: 2,
      whatsAppRecipients: 2,
      emailRecipients: 0,
      deliveredCount: 2,
      timestamp: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockResult);
    vi.spyOn(apiClient, "get").mockResolvedValueOnce([mockResult]);

    const result = await sendBroadcast({
      channel: "whatsapp",
      customerIds: ["cust-1", "cust-2"],
      message: "Your upcoming wedding run-of-show has been updated.",
      imageUrl: "https://example.com/moodboard.jpg",
    });

    expect(result.broadcastId).toBe("bc-test-1");
    expect(result.channel).toBe("whatsapp");
    expect(result.totalRecipients).toBe(2);

    const history = await getBroadcastHistory();
    expect(history.length).toBe(1);
    expect(history[0].broadcastId).toBe(result.broadcastId);
  });

  it("generates correct WhatsApp sharing and mailto BCC URLs", () => {
    const waShareUrl = createWhatsAppBroadcastUrl(
      "Exclusive Event Update",
      "https://example.com/banner.png"
    );
    expect(waShareUrl).toContain("https://api.whatsapp.com/send?text=");
    expect(waShareUrl).toContain("https%3A%2F%2Fexample.com%2Fbanner.png");

    const waDirectUrl = createWhatsAppDirectUrl("+234 805 596 6944", "Private Consultation");
    expect(waDirectUrl).toContain("https://wa.me/2348055966944?text=Private%20Consultation");

    const mailtoUrl = createEmailBroadcastMailto(
      ["client1@example.com", "client2@example.com"],
      "Atelier VIP Gala",
      "We invite you to our gala."
    );
    expect(mailtoUrl).toContain("mailto:?bcc=client1%40example.com%2Cclient2%40example.com");
    expect(mailtoUrl).toContain("subject=Atelier%20VIP%20Gala");
  });
});

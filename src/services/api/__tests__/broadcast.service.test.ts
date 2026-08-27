import { beforeEach, describe, expect, it } from "vitest";
import {
  BROADCAST_LIMITS,
  createEmailBroadcastMailto,
  createWhatsAppBroadcastUrl,
  createWhatsAppDirectUrl,
  getBroadcastHistory,
  sendBroadcast,
} from "../broadcast.service";
import { getCustomers } from "../customer.service";

describe("Broadcast Service", () => {
  beforeEach(async () => {
    // Reset test state if needed
  });

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
    const allCustomers = await getCustomers();
    const customerIds = allCustomers.slice(0, 2).map(c => c.id);
    const longMessage = "A".repeat(BROADCAST_LIMITS.WHATSAPP_MAX_LENGTH + 1);

    await expect(
      sendBroadcast({
        channel: "whatsapp",
        customerIds,
        message: longMessage,
      })
    ).rejects.toThrow("exceeds maximum allowable limit");
  });

  it("requires a subject line for email broadcasts", async () => {
    const allCustomers = await getCustomers();
    const customerIds = allCustomers.slice(0, 2).map(c => c.id);

    await expect(
      sendBroadcast({
        channel: "email",
        customerIds,
        message: "Exclusive Atelier invitation.",
        subject: "   ",
      })
    ).rejects.toThrow("Email broadcasts require a subject line.");
  });

  it("successfully executes a bulk WhatsApp broadcast and records history", async () => {
    const allCustomers = await getCustomers();
    const customerIds = allCustomers.slice(0, 2).map(c => c.id);

    const result = await sendBroadcast({
      channel: "whatsapp",
      customerIds,
      message: "Your upcoming wedding run-of-show has been updated.",
      imageUrl: "https://example.com/moodboard.jpg",
    });

    expect(result.broadcastId).toBeDefined();
    expect(result.channel).toBe("whatsapp");
    expect(result.totalRecipients).toBe(customerIds.length);
    expect(result.deliveredCount).toBe(customerIds.length);

    const history = await getBroadcastHistory();
    expect(history.length).toBeGreaterThan(0);
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

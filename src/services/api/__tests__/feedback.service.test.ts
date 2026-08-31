import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import type { FeatureRequest } from "@/types";
import { getFeatureRequests, submitFeatureRequest } from "../feedback.service";

describe("Feedback & Feature Request Service", () => {
  it("submits a valid feature request successfully", async () => {
    const mockRequest: FeatureRequest = {
      id: "req-1",
      title: "Direct WhatsApp Webhook Integration",
      description:
        "Direct bi-directional WhatsApp chatbot automation for real-time consultation triage.",
      category: "crm",
      email: "director@atelierforma.design",
      createdAt: new Date().toISOString(),
      status: "submitted",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockRequest);

    const result = await submitFeatureRequest({
      title: "Direct WhatsApp Webhook Integration",
      description:
        "Direct bi-directional WhatsApp chatbot automation for real-time consultation triage.",
      category: "crm",
      email: "director@atelierforma.design",
    });

    expect(result.id).toBeDefined();
    expect(result.status).toBe("submitted");
    expect(result.title).toBe("Direct WhatsApp Webhook Integration");
  });

  it("retrieves the list of feature requests", async () => {
    const mockRequests: FeatureRequest[] = [
      {
        id: "req-1",
        title: "Custom Domain Mapping",
        description: "Map custom domain to storefront",
        category: "storefront",
        email: "director@elanevents.com",
        createdAt: "2026-08-20T10:00:00Z",
        status: "planned",
      },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockRequests);

    const requests = await getFeatureRequests();
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);
  });
});

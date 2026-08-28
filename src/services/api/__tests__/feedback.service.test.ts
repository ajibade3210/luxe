import { describe, expect, it } from "vitest";
import { getFeatureRequests, submitFeatureRequest } from "../feedback.service";

describe("Feedback & Feature Request Service", () => {
  it("submits a valid feature request successfully", async () => {
    const request = await submitFeatureRequest({
      title: "Automated Currency Converter",
      description: "Auto-convert invoice totals using live CBN and interbank exchange rates.",
      category: "invoicing",
      email: "director@elanevents.com",
    });

    expect(request.id).toBeDefined();
    expect(request.title).toBe("Automated Currency Converter");
    expect(request.status).toBe("submitted");
  });

  it("retrieves the list of feature requests including initial seeds", async () => {
    const list = await getFeatureRequests();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].title).toBeDefined();
  });

  it("throws validation error for invalid email or short description", async () => {
    await expect(
      submitFeatureRequest({
        title: "Short",
        description: "Too short",
        category: "other",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });
});

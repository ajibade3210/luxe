import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import { uploadBusinessLogo, uploadMediaFile, uploadPortfolioImage } from "../media.service";

describe("Media Service", () => {
  it("uploads a media file successfully via API", async () => {
    const mockResponse = { url: "https://r2.shopwus.com/images/sample.png" };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockResponse);

    const file = new File(["dummy content"], "sample.png", { type: "image/png" });
    const result = await uploadMediaFile(file);

    expect(result).toEqual({
      url: "https://r2.shopwus.com/images/sample.png",
      success: true,
    });
  });

  it("throws error when API does not return a url", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValueOnce({});

    const file = new File(["dummy content"], "sample.png", { type: "image/png" });
    await expect(uploadMediaFile(file)).rejects.toThrow(
      "Failed to upload media file: No URL returned from server"
    );
  });

  it("propagates API upload failure error", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValueOnce(new Error("Network Error"));

    const file = new File(["dummy content"], "sample.png", { type: "image/png" });
    await expect(uploadMediaFile(file)).rejects.toThrow("Network Error");
  });

  it("handles string URLs and File uploads in uploadBusinessLogo", async () => {
    const stringResult = await uploadBusinessLogo("https://cdn.example.com/logo.png");
    expect(stringResult).toEqual({
      url: "https://cdn.example.com/logo.png",
      success: true,
    });

    const emptyResult = await uploadBusinessLogo("");
    expect(emptyResult).toEqual({
      url: "",
      success: false,
    });

    vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      url: "https://r2.shopwus.com/images/logo.png",
    });
    const file = new File(["logo content"], "logo.png", { type: "image/png" });
    const fileResult = await uploadBusinessLogo(file);
    expect(fileResult).toEqual({
      url: "https://r2.shopwus.com/images/logo.png",
      success: true,
    });
  });

  it("handles string URLs and File uploads in uploadPortfolioImage", async () => {
    const stringResult = await uploadPortfolioImage("https://cdn.example.com/portfolio.png");
    expect(stringResult).toEqual({
      url: "https://cdn.example.com/portfolio.png",
      success: true,
    });

    const emptyResult = await uploadPortfolioImage("");
    expect(emptyResult).toEqual({
      url: "",
      success: false,
    });

    vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      url: "https://r2.shopwus.com/images/portfolio.png",
    });
    const file = new File(["img content"], "portfolio.png", { type: "image/png" });
    const fileResult = await uploadPortfolioImage(file);
    expect(fileResult).toEqual({
      url: "https://r2.shopwus.com/images/portfolio.png",
      success: true,
    });
  });
});

import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import {
  uploadBusinessLogo,
  uploadMediaFile,
  uploadMultipleMediaFiles,
  uploadPortfolioImage,
} from "../media.service";

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

  it("uploads business logo directly via API", async () => {
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

  it("uploads portfolio image directly via API", async () => {
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

  it("uploads multiple files via /media/upload-multi", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValueOnce([
      { url: "https://r2.shopwus.com/images/img1.png" },
      { url: "https://r2.shopwus.com/images/img2.png" },
    ]);
    const f1 = new File(["1"], "1.png", { type: "image/png" });
    const f2 = new File(["2"], "2.png", { type: "image/png" });
    const results = await uploadMultipleMediaFiles([f1, f2]);
    expect(results).toEqual([
      { url: "https://r2.shopwus.com/images/img1.png", success: true },
      { url: "https://r2.shopwus.com/images/img2.png", success: true },
    ]);
  });
});

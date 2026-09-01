import { apiClient } from "@/lib/api-client";

export async function uploadMediaFile(
  file: File | Blob
): Promise<{ url: string; success: boolean }> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient.post<{ url: string }>("/media/upload", formData);

  if (!result?.url) {
    throw new Error("Failed to upload media file: No URL returned from server");
  }

  return {
    url: result.url,
    success: true,
  };
}

export async function uploadBusinessLogo(
  file?: File | Blob | string
): Promise<{ url: string; success: boolean }> {
  if (file && typeof file !== "string") {
    return uploadMediaFile(file);
  }
  return {
    url: typeof file === "string" ? file : "",
    success: typeof file === "string" && file.length > 0,
  };
}

export async function uploadPortfolioImage(
  file?: File | Blob | string
): Promise<{ url: string; success: boolean }> {
  if (file && typeof file !== "string") {
    return uploadMediaFile(file);
  }
  return {
    url: typeof file === "string" ? file : "",
    success: typeof file === "string" && file.length > 0,
  };
}

import { apiClient } from "@/lib/api-client";

export async function uploadMediaFile(
  file: File
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

export async function uploadMultipleMediaFiles(
  files: File[]
): Promise<Array<{ url: string; success: boolean }>> {
  if (!files || files.length === 0) return [];

  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const results = await apiClient.post<Array<{ url: string }>>(
    "/media/upload-multi",
    formData
  );

  return results.map((r) => ({
    url: r.url,
    success: true,
  }));
}

export async function uploadBusinessLogo(
  file: File
): Promise<{ url: string; success: boolean }> {
  return uploadMediaFile(file);
}

export async function uploadPortfolioImage(
  file: File
): Promise<{ url: string; success: boolean }> {
  return uploadMediaFile(file);
}


import { apiClient } from "@/lib/api-client";
import { CreateFeatureRequestSchema } from "@/lib/schemas";
import type { CreateFeatureRequestInput, FeatureRequest } from "@/types";

export async function submitFeatureRequest(
  input: CreateFeatureRequestInput
): Promise<FeatureRequest> {
  const validated = CreateFeatureRequestSchema.parse(input);
  return apiClient.post<FeatureRequest>("/feedback", validated);
}

export async function getFeatureRequests(): Promise<FeatureRequest[]> {
  const data = await apiClient.get<FeatureRequest[]>("/feedback");
  return Array.isArray(data) ? data : [];
}

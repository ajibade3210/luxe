import { CreateFeatureRequestSchema } from "@/lib/schemas";
import type { CreateFeatureRequestInput, FeatureRequest } from "@/types";

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

const initialFeatureRequests: FeatureRequest[] = [
  {
    id: "req-1",
    title: "Custom Domain CNAME Mapping",
    description:
      "Allow mapping our bespoke domain (e.g., atelier.elanevents.com) directly to the public 3D stationery card.",
    category: "storefront",
    email: "director@elanevents.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "planned",
  },
  {
    id: "req-2",
    title: "Multi-Staff Sub-Accounts for Show Callers",
    description:
      "Team logins with granular permissions for live event show-calls and floor coordinators.",
    category: "crm",
    email: "laurent@maisonflagship.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: "in_review",
  },
];

let persistedRequests: FeatureRequest[] = [...initialFeatureRequests];

export async function submitFeatureRequest(
  input: CreateFeatureRequestInput
): Promise<FeatureRequest> {
  await delay(120);
  const validated = CreateFeatureRequestSchema.parse(input);

  const newRequest: FeatureRequest = {
    id: `req-${Date.now()}`,
    title: validated.title,
    description: validated.description,
    category: validated.category,
    email: validated.email,
    createdAt: new Date().toISOString(),
    status: "submitted",
  };

  persistedRequests = [newRequest, ...persistedRequests];
  return newRequest;
}

export async function getFeatureRequests(): Promise<FeatureRequest[]> {
  await delay(60);
  return [...persistedRequests];
}

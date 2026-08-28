export type FeatureRequestCategory =
  | "storefront"
  | "invoicing"
  | "bookkeeping"
  | "valuation"
  | "crm"
  | "other";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: FeatureRequestCategory;
  email: string;
  createdAt: string;
  status: "submitted" | "in_review" | "planned";
}

export interface CreateFeatureRequestInput {
  title: string;
  description: string;
  category: FeatureRequestCategory;
  email: string;
}

export interface FloatingChatWidgetProps {
  defaultTab?: "chat" | "request";
}

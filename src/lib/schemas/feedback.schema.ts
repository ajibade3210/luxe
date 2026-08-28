import { z } from "zod";

export const FeatureRequestCategoryEnum = z.enum([
  "storefront",
  "invoicing",
  "bookkeeping",
  "valuation",
  "crm",
  "other",
]);

export const CreateFeatureRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters describing the feature")
    .max(1000, "Description cannot exceed 1000 characters"),
  category: FeatureRequestCategoryEnum,
  email: z.string().trim().email("Please provide a valid email address"),
});

export type CreateFeatureRequestSchemaInput = z.infer<typeof CreateFeatureRequestSchema>;

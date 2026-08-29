import { z } from "zod";
import { CurrencyCodeSchema } from "./invoice.schema";

export const IndustrySectorSchema = z.enum([
  "retail_ecommerce",
  "luxury_services",
  "agency_consulting",
  "events_hospitality",
  "digital_tech",
  "general_business",
]);

export const PublicValuationInputSchema = z.object({
  currency: CurrencyCodeSchema.default("GBP"),
  industry: IndustrySectorSchema.default("luxury_services"),
  annualRevenue: z.number().min(0, "Annual revenue cannot be negative"),
  annualExpenses: z.number().min(0, "Annual expenses cannot be negative"),
  netAssets: z.number().min(0, "Net assets cannot be negative"),
  customerRetentionRate: z
    .number()
    .min(0, "Retention rate must be at least 0%")
    .max(100, "Retention rate cannot exceed 100%"),
});

export type PublicValuationInputValidation = z.infer<typeof PublicValuationInputSchema>;

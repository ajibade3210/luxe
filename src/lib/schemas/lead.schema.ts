import { z } from "zod";

export const LeadStatusSchema = z.enum(["new", "contacted", "qualified", "converted", "closed"]);

export const CreateLeadInputSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z.string().optional(),
  service: z.string().min(1, "Service is required").trim(),
  services: z.array(z.string()).optional(),
  eventDate: z.string().min(1, "Date is required"),
  budget: z.number().nonnegative().optional(),
  message: z.string().trim(),
});

export const LeadSchema = CreateLeadInputSchema.extend({
  id: z.string().min(1),
  status: LeadStatusSchema,
  createdAt: z.string().datetime({ offset: true }).or(z.string()),
});

export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;
export type LeadValidation = z.infer<typeof LeadSchema>;

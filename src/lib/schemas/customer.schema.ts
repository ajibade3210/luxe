import { z } from "zod";

export const ServiceStatusSchema = z.enum(["active", "completed", "pending", "cancelled"]);

export const CustomerServiceSchema = z.object({
  id: z.string().min(1),
  businessId: z.string().optional(),
  customerId: z.string().min(1),
  name: z.string().min(1, "Service name is required").trim(),
  service: z.string().min(1, "Service category/scope is required").trim(),
  amount: z.number().nonnegative(),
  status: ServiceStatusSchema,
  createdAt: z.string().min(1),
  completedAt: z.string().optional(),
});

export const AddServiceInputSchema = z.object({
  businessId: z.string().optional(),
  name: z.string().min(1, "Service name is required").trim(),
  service: z.string().min(1, "Service is required").trim(),
  amount: z.number().nonnegative("Amount must be a positive number"),
  status: ServiceStatusSchema.optional(),
});

export const NewCustomerInputSchema = z
  .object({
    businessId: z.string().optional(),
    name: z.string().min(1, "Customer name is required").trim(),
    email: z
      .string()
      .trim()
      .optional()
      .refine(val => !val || z.string().email().safeParse(val).success, {
        message: "Invalid email address",
      }),
    phone: z.string().optional(),
    company: z.string().optional(),
    serviceName: z.string().optional(),
    service: z.string().optional(),
    amount: z.number().nonnegative().optional(),
    status: ServiceStatusSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine(data => Boolean(data.email?.trim() || data.phone?.trim()), {
    message: "At least one contact method (email or phone) is required",
    path: ["email"],
  });

export const CustomerSchema = z.object({
  id: z.string().min(1),
  businessId: z.string().optional(),
  name: z.string().min(1).trim(),
  email: z.string().trim().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  services: z.array(CustomerServiceSchema),
  totalRevenue: z.number().nonnegative(),
  notes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string().min(1),
});

export type NewCustomerInput = z.infer<typeof NewCustomerInputSchema>;
export type AddServiceInput = z.infer<typeof AddServiceInputSchema>;
export type CustomerValidation = z.infer<typeof CustomerSchema>;

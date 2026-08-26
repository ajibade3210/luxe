import { z } from "zod";

export const ProjectStatusSchema = z.enum(["active", "completed", "pending", "cancelled"]);

export const ProjectSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  name: z.string().min(1, "Project name is required").trim(),
  service: z.string().min(1, "Service is required").trim(),
  amount: z.number().nonnegative(),
  status: ProjectStatusSchema,
  createdAt: z.string().min(1),
  completedAt: z.string().optional(),
});

export const AddProjectInputSchema = z.object({
  name: z.string().min(1, "Project name is required").trim(),
  service: z.string().min(1, "Service is required").trim(),
  amount: z.number().nonnegative("Amount must be a positive number"),
  status: ProjectStatusSchema.optional(),
});

export const NewCustomerInputSchema = z.object({
  name: z.string().min(1, "Customer name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectName: z.string().optional(),
  service: z.string().optional(),
  amount: z.number().nonnegative().optional(),
  status: ProjectStatusSchema.optional(),
  isActive: z.boolean().optional(),
});

export const CustomerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).trim(),
  email: z.string().email().trim(),
  phone: z.string().optional(),
  company: z.string().optional(),
  projects: z.array(ProjectSchema),
  totalRevenue: z.number().nonnegative(),
  notes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string().min(1),
});

export type NewCustomerInput = z.infer<typeof NewCustomerInputSchema>;
export type AddProjectInput = z.infer<typeof AddProjectInputSchema>;
export type CustomerValidation = z.infer<typeof CustomerSchema>;

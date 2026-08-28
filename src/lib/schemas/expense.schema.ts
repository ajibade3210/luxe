import { z } from "zod";
import { CurrencyCodeSchema } from "./invoice.schema";

export const ExpenseCategorySchema = z.enum([
  "materials",
  "logistics",
  "marketing",
  "packaging",
  "utilities",
  "equipment",
  "rent",
  "salaries",
  "other",
]);

export const ExpensePaymentMethodSchema = z.enum([
  "bank_transfer",
  "cash",
  "card",
  "pos",
  "online",
]);

export const ExpenseInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Expense title is required").trim(),
  amount: z.number().positive("Amount must be greater than zero"),
  category: ExpenseCategorySchema,
  date: z.string().min(1, "Date is required"),
  paymentMethod: ExpensePaymentMethodSchema,
  notes: z.string().optional().default(""),
  receiptUrl: z.string().optional(),
  currency: CurrencyCodeSchema.optional(),
});

export const ExpenseSchema = z.object({
  id: z.string().min(1),
  businessId: z.string().optional(),
  title: z.string().min(1).trim(),
  amount: z.number().positive(),
  category: ExpenseCategorySchema,
  date: z.string().min(1),
  paymentMethod: ExpensePaymentMethodSchema,
  notes: z.string().optional(),
  receiptUrl: z.string().optional(),
  currency: CurrencyCodeSchema.optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().optional(),
});

export type ExpenseInputValidation = z.infer<typeof ExpenseInputSchema>;
export type ExpenseValidation = z.infer<typeof ExpenseSchema>;

import { z } from "zod";

export const CurrencyCodeSchema = z.enum(["NGN", "USD", "GBP", "EUR"]);

export const InvoiceStatusSchema = z.enum(["draft", "sent", "paid", "cancelled"]);

export const PaymentTermsSchema = z.enum(["Due on receipt", "Net 14", "Net 30", "Net 60"]);

export const InvoiceItemSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1, "Description is required").trim(),
  quantity: z.number().positive("Quantity must be greater than zero"),
  unit: z.string().min(1, "Unit is required").trim(),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
  amount: z.number().nonnegative(),
});

export const InvoiceInputSchema = z.object({
  id: z.string().optional(),
  businessId: z.string().optional(),
  invoiceNumber: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  customerName: z.string().min(1, "Customer name is required").trim(),
  customerEmail: z.email("Invalid customer email").trim(),
  billingAddress: z.string().trim(),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  paymentTerms: PaymentTermsSchema,
  currency: CurrencyCodeSchema.optional(),
  items: z.array(InvoiceItemSchema).min(1, "At least one invoice item is required"),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().optional().default(0),
  taxRate: z.number().nonnegative().optional().default(0),
  taxAmount: z.number().nonnegative().optional().default(0),
  total: z.number().nonnegative(),
  notes: z.string().optional().default(""),
  status: InvoiceStatusSchema.optional(),
});

export const InvoiceSchema = z.object({
  id: z.string().min(1),
  businessId: z.string().optional(),
  invoiceNumber: z.string().min(1),
  customerId: z.string().min(1),
  customerName: z.string().min(1).trim(),
  customerEmail: z.email().trim(),
  billingAddress: z.string().trim(),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  paymentTerms: PaymentTermsSchema,
  currency: CurrencyCodeSchema.optional(),
  items: z.array(InvoiceItemSchema),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  taxRate: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  notes: z.string(),
  status: InvoiceStatusSchema,
  sentAt: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type InvoiceInputValidation = z.infer<typeof InvoiceInputSchema>;
export type InvoiceItemValidation = z.infer<typeof InvoiceItemSchema>;
export type InvoiceValidation = z.infer<typeof InvoiceSchema>;
